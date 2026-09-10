/**
 * Erzeugt die PWA-Icons (glücklicher Hund) als echte PNG-Dateien.
 * Nutzt nur Node-Bordmittel: eigenes Rendering + zlib fuer die PNG-Kompression.
 *
 *   node tools/generate-icons.mjs
 *
 * Die Formen sind im Designraum 512x512 definiert - identisch zu icons/icon.svg.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = 512; // Designraum

/* ---------------------------------------------------------- PNG-Encoder --- */

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // Filter: none
    for (let i = 0; i < stride; i++) raw[y * (stride + 1) + 1 + i] = rgba[y * stride + i];
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* -------------------------------------------------------------- Formen --- */

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const ellipse = (cx, cy, rx, ry, rot = 0) => {
  const a = (-rot * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    const u = dx * cos - dy * sin, v = dx * sin + dy * cos;
    return (u * u) / (rx * rx) + (v * v) / (ry * ry) <= 1;
  };
};

const roundedRect = (x0, y0, x1, y1, r) => (x, y) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const qx = Math.max(x0 + r - x, 0, x - (x1 - r));
  const qy = Math.max(y0 + r - y, 0, y - (y1 - r));
  return qx * qx + qy * qy <= r * r;
};

const polygon = (pts) => (x, y) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const polylineStroke = (pts, w) => {
  const h = w / 2;
  return (x, y) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const vx = bx - ax, vy = by - ay;
      const len2 = vx * vx + vy * vy;
      let t = len2 === 0 ? 0 : ((x - ax) * vx + (y - ay) * vy) / len2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const dx = x - (ax + t * vx), dy = y - (ay + t * vy);
      if (dx * dx + dy * dy <= h * h) return true;
    }
    return false;
  };
};

const quad = (p0, c, p1, steps = 48) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps, m = 1 - t;
    return [m * m * p0[0] + 2 * m * t * c[0] + t * t * p1[0], m * m * p0[1] + 2 * m * t * c[1] + t * t * p1[1]];
  });

/* -------------------------------------------------------------- Palette --- */

const FUR = '#9A8F80';        // graubraunes Stockhaar
const FUR_DARK = '#7E7466';   // Ohren, Schattierung
const FUR_DEEP = '#5C5348';   // Ohrinnenseite
const STRIPE = '#6F6557';     // Stromung (Brindle)
const LIGHT = '#C6BCAB';      // helle Abzeichen
const MUZZLE = '#DCD4C4';     // helle Schnauze
const EYE = '#C4802F';        // Bernstein
const DARK = '#2B2622';       // Nase, Pupille, Fang
const BG_TOP = '#2ED3B7', BG_BOTTOM = '#0E9488';

// Hintergrund: vertikaler Verlauf. `full` = randlos (maskable), sonst abgerundet.
const background = (full) => ({
  hit: full ? () => true : roundedRect(0, 0, D, D, 112),
  color: (x, y) => {
    const t = y / D, a = hex(BG_TOP), b = hex(BG_BOTTOM);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  },
});

// Der Hund - von hinten nach vorne gezeichnet. Vorlage: Stehohren,
// lange schmale Schnauze, graubraun gestromt, bernsteinfarbene Augen.
const DOG = [
  // Ohren
  { hit: polygon([[150, 216], [254, 150], [112, 58]]), fill: FUR_DARK },
  { hit: polygon([[362, 216], [258, 150], [400, 58]]), fill: FUR_DARK },
  { hit: polygon([[168, 202], [242, 172], [130, 96]]), fill: FUR_DEEP },
  { hit: polygon([[344, 202], [270, 172], [382, 96]]), fill: FUR_DEEP },

  // Kopf: Schaedel + Nasenruecken verschmelzen zur langen Schnauze
  { hit: ellipse(256, 264, 126, 112), fill: FUR },
  { hit: ellipse(256, 336, 72, 108), fill: FUR },

  // Stromung
  { hit: polylineStroke([[186, 176], [198, 236]], 16), fill: STRIPE },
  { hit: polylineStroke([[228, 158], [236, 214]], 14), fill: STRIPE },
  { hit: polylineStroke([[326, 176], [314, 236]], 16), fill: STRIPE },
  { hit: polylineStroke([[284, 158], [276, 214]], 14), fill: STRIPE },

  // Helle Abzeichen: Nasenruecken und Wangen
  { hit: ellipse(256, 340, 26, 98), fill: LIGHT },
  { hit: ellipse(256, 386, 64, 66), fill: MUZZLE },

  // Augen
  { hit: ellipse(196, 268, 30, 23, -12), fill: DARK },
  { hit: ellipse(316, 268, 30, 23, 12), fill: DARK },
  { hit: ellipse(196, 268, 24, 18, -12), fill: EYE },
  { hit: ellipse(316, 268, 24, 18, 12), fill: EYE },
  { hit: ellipse(198, 269, 11, 13), fill: DARK },
  { hit: ellipse(314, 269, 11, 13), fill: DARK },
  { hit: ellipse(190, 261, 7, 7), fill: '#FFFFFF' },
  { hit: ellipse(306, 261, 7, 7), fill: '#FFFFFF' },

  // Nase und Fang
  { hit: ellipse(256, 396, 33, 25), fill: DARK },
  { hit: polylineStroke([[256, 416], [256, 428]], 11), fill: DARK },
  { hit: polylineStroke(quad([218, 426], [256, 452], [294, 426]), 12), fill: DARK },
];

/* ------------------------------------------------------------ Rendering --- */

function render(size, { maskable = false } = {}) {
  const SS = 4; // 4x4 Supersampling fuer weiche Kanten
  const scale = D / size;
  const shrink = maskable ? 0.72 : 0.94; // Safe-Zone fuer maskable Icons
  const shapes = [background(maskable), ...DOG.map((s) => ({ ...s, dog: true }))];
  const out = new Uint8Array(size * size * 4);

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0; // premultipliziert, ueber alle Subsamples summiert
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) * scale;
          const y = (py + (sy + 0.5) / SS) * scale;
          let pr = 0, pg = 0, pb = 0, pa = 0;
          for (const s of shapes) {
            const hx = s.dog ? (x - D / 2) / shrink + D / 2 : x;
            const hy = s.dog ? (y - D / 2) / shrink + D / 2 : y;
            if (!s.hit(hx, hy)) continue;
            const [cr, cg, cb] = s.color ? s.color(x, y) : hex(s.fill);
            const sa = s.alpha ?? 1;
            pr = cr * sa + pr * (1 - sa);
            pg = cg * sa + pg * (1 - sa);
            pb = cb * sa + pb * (1 - sa);
            pa = sa + pa * (1 - sa);
          }
          r += pr * pa; g += pg * pa; b += pb * pa; a += pa;
        }
      }
      const n = SS * SS;
      const alpha = a / n;
      const i = (py * size + px) * 4;
      out[i] = alpha > 0 ? Math.round(r / n / alpha) : 0;
      out[i + 1] = alpha > 0 ? Math.round(g / n / alpha) : 0;
      out[i + 2] = alpha > 0 ? Math.round(b / n / alpha) : 0;
      out[i + 3] = Math.round(alpha * 255);
    }
  }
  return encodePng(size, size, out);
}

mkdirSync(join(ROOT, 'icons'), { recursive: true });
const jobs = [
  ['icons/icon-192.png', 192, {}],
  ['icons/icon-512.png', 512, {}],
  ['icons/icon-maskable-512.png', 512, { maskable: true }],
  ['icons/apple-touch-icon.png', 180, {}],
  ['icons/favicon-32.png', 32, {}],
];
for (const [file, size, opts] of jobs) {
  writeFileSync(join(ROOT, file), render(size, opts));
  console.log('geschrieben:', file, `(${size}x${size})`);
}
