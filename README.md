# HundePhysio 🐶

Eine kleine PWA rund um Physiotherapie für Hunde.
Aktueller Stand: **Dummy-Version** – die App zeigt „Hallo Welt“, ist aber
bereits vollständig installierbar und offlinefähig.

**Live:** https://sfutterer.github.io/hundePhysio/

## Eigenschaften

- Reines HTML/CSS/JS – **kein Build-Schritt**, kein Framework, keine Abhängigkeiten
- Installierbar (Web App Manifest) mit eigenem Icon (glücklicher Hund)
- Offlinefähig über einen Service Worker
- Daten (später) ausschließlich lokal im `localStorage` – kein Backend, keine Konten

## Projektstruktur

| Datei / Ordner            | Zweck                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `index.html`              | Einstiegsseite                                                |
| `styles.css`, `app.js`    | Oberfläche und Logik                                          |
| `manifest.webmanifest`    | Name, Farben, Icons, Start-URL für die Installation           |
| `sw.js`                   | Service Worker (Offline-Cache), Version über `VERSION` erhöhen |
| `icons/`                  | Icons – `icon.svg` ist die Quelle, die PNGs werden erzeugt    |
| `tools/generate-icons.mjs`| Erzeugt die PNG-Icons aus den Formdefinitionen                |
| `.github/workflows/`      | Automatisches Deployment nach GitHub Pages                    |
| `.nojekyll`               | Verhindert Jekyll-Verarbeitung auf GitHub Pages               |

## Lokal ausprobieren

Service Worker laufen nicht über `file://`, es braucht einen kleinen Webserver:

```bash
npx --yes serve .
```

Danach http://localhost:3000 öffnen. Alternativ jeder andere statische Server.

## Icons neu erzeugen

Nach Änderungen an `icons/icon.svg` die Formen in `tools/generate-icons.mjs`
angleichen (gleiche Koordinaten, Designraum 512×512) und ausführen:

```bash
node tools/generate-icons.mjs
```

## Veröffentlichen (GitHub Pages)

Für öffentliche Repositories ist GitHub Pages kostenlos. Einmalig einzustellen:

1. **Settings → Pages → Build and deployment → Source** auf **GitHub Actions** setzen
   (nicht „Deploy from a branch“ – dafür ist der Workflow gebaut).
2. Falls das Repo privat ist: **Settings → General → Danger Zone → Change
   visibility → Public** (Pages ist für private Repos nur in bezahlten Plänen verfügbar).
3. Nach dem Push auf `main` läuft der Workflow „Deploy PWA to GitHub Pages“
   unter **Actions**. Die fertige URL steht im Job-Ergebnis und unter **Settings → Pages**.

Die App liegt danach unter einem Unterpfad (`/hundePhysio/`). Deshalb sind alle
Pfade im Projekt **relativ** – beim Umbenennen des Repos oder bei einer eigenen
Domain muss nichts angepasst werden.

## Nach einem Update

Der Service Worker liefert alte Dateien aus dem Cache. Damit Nutzer die neue
Version bekommen, in `sw.js` die Konstante `VERSION` hochzählen (`v1` → `v2`);
`APP_VERSION` in `app.js` steuert nur die Anzeige im Status-Bereich.
