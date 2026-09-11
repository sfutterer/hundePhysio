/**
 * Erzeugt die App-Icons aus der Illustration in icons/source/.
 *
 *   node tools/build-icons.mjs
 *
 * Node bringt keine Bildverarbeitung mit, deshalb übernimmt das Zuschneiden und
 * Skalieren der Browser: Das Skript startet einen kleinen Server, liefert
 * build-icons.html aus und schreibt die PNGs, die die Seite zurückschickt.
 * Danach beendet es sich selbst.
 */
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4180;
const ERWARTET = 5;
let fertig = 0;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/save') {
    const name = url.searchParams.get('name');
    if (!/^[a-z0-9-]+\.png$/.test(name || '')) {
      res.writeHead(400).end('ungueltiger Name');
      return;
    }
    const teile = [];
    for await (const chunk of req) teile.push(chunk);
    await writeFile(join(ROOT, 'icons', name), Buffer.concat(teile));
    console.log('geschrieben: icons/' + name);
    res.writeHead(204).end();
    if (++fertig >= ERWARTET) {
      console.log('fertig.');
      setTimeout(() => server.close(() => process.exit(0)), 300);
    }
    return;
  }

  const datei = url.pathname === '/source.jpg'
    ? join(ROOT, 'icons', 'source', 'hund-illustration.jpg')
    : join(ROOT, 'tools', 'build-icons.html');
  try {
    const daten = await readFile(datei);
    res.writeHead(200, {
      'Content-Type': datei.endsWith('.jpg') ? 'image/jpeg' : 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(daten);
  } catch {
    res.writeHead(404).end('nicht gefunden');
  }
});

server.listen(PORT, () => console.log(`Seite oeffnen: http://localhost:${PORT}/`));
