# HundePhysio 🐕

Eine kleine PWA für die täglichen Physiotherapie-Übungen mit dem Hund:
Übungen abhaken, ausführliche Anleitungen nachlesen, den Monat im Blick behalten.

**Live:** https://sfutterer.github.io/hundePhysio/

## Funktionen

- **Heute** – die sieben Übungen des Tages mit Abhak-Kreis, Fortschrittsring und Serie
- **Detailansicht** – Ziel, Material, Ablauf, Schwierigkeitsstufen, Warnhinweise,
  recherchierte Ergänzungen und ein Anleitungsvideo je Übung
- **Kalender** – Monatsraster wie in gängigen Kalender-Apps, Punkt je Tag
  (grau = teilweise, farbig = vollständig), Monatsbilanz und Zähler je Übung
- **Nachtragen** – Tippen auf einen vergangenen Tag öffnet ein Tagesblatt,
  in dem sich Haken nachträglich setzen lassen
- **Speicherung** ausschließlich lokal im `localStorage`; Haken bleiben nach dem
  Schließen der App erhalten. Kein Backend, kein Konto, keine Übertragung
- Installierbar und offlinefähig (Service Worker), Oberfläche an den iOS Human
  Interface Guidelines orientiert (System-Schrift, Large Titles,
  Inset-Grouped-Listen, Tab-Bar mit Blur, Safe-Area-Ränder)

## Inhalte der Übungen

Grundlage sind die Handzettel des **AniCura Kleintierzentrums Weingarten**:
erhöht stehen, passives Bewegen (PROM), Sitz-Steh/Platz-Steh-Transfers,
Cavaletti-Training, Slalom und 8-er laufen, Balance-Kissen, Gewichtsverlagerungen.

Wo die Handzettel knapp sind, steht in der Detailansicht ein eigener Block
**„Ergänzende Hinweise"** – etwa zu Stangenabständen, Stufenhöhen, Haltedauern
oder Schmerzanzeichen. Diese Angaben sind recherchiert und als solche
gekennzeichnet, damit klar bleibt, was vom Handzettel stammt und was nicht.

Die eingebetteten Videos stammen überwiegend von tierphysiotherapeutischen
Kanälen (Gatehouse Vet Rehab, Valiant Vet Physio, Purdue Veterinary Medicine,
Canine Rehab, isy-training). Sie werden erst nach einem Tippen geladen
(`youtube-nocookie.com`), es wird also nichts ungefragt nachgeladen.

Die App ersetzt keine tierärztliche Beratung.

## Projektstruktur

| Datei / Ordner             | Zweck                                                          |
| -------------------------- | -------------------------------------------------------------- |
| `index.html`               | App-Gerüst: Screens, Tab-Bar, Sheet                             |
| `styles.css`               | iOS-Designsystem (Farbtokens hell/dunkel, Listen, Navigation)   |
| `exercises.js`             | Übungsdaten – hier werden Inhalte gepflegt                      |
| `app.js`                   | Zustand, Speicherung, Rendering, Navigation                     |
| `sw.js`                    | Service Worker (Offline-Cache), Version über `VERSION`          |
| `icons/`                   | `icon.svg` ist die Quelle, die PNGs werden daraus erzeugt       |
| `tools/generate-icons.mjs` | Erzeugt die PNG-Icons (nur Node-Bordmittel, kein ImageMagick)   |
| `.github/workflows/`       | Automatisches Deployment nach GitHub Pages                      |

## Übung ändern oder ergänzen

Alles Inhaltliche steht in [`exercises.js`](exercises.js). Ein Eintrag:

```js
{
  id: 'kurzname',            // stabil lassen – dient als Schlüssel im Speicher
  titel: 'Titel',
  kurz: 'Ein Satz für die Detailansicht',
  frequenz: '1–3 × täglich · 3–5 Wiederholungen',
  ziel: ['…'],               // Block "Ziel der Übung"
  material: '…',             // optional
  ablauf: ['…'],             // optional, wird nummeriert
  bloecke: [{ name: 'Anfänger', punkte: ['…'] }],   // optional
  achtung: ['…'],            // optional, roter Block
  recherche: ['…'],          // optional, als Ergänzung gekennzeichnet
  videos: [{ id: 'YouTube-ID', titel: '…', kanal: '…', sprache: 'DE' }],
}
```

Wird eine `id` geändert, verlieren bereits gesetzte Haken dieser Übung ihren
Bezug – deshalb besser nur Titel und Texte anpassen.

## Speicherformat

Ein Schlüssel im `localStorage`:

```
hundephysio.log.v1 = {"2026-09-10":["erhoeht-stehen","cavaletti"]}
```

Pro Datum die Liste der erledigten Übungs-IDs. Leere Tage werden entfernt.

## Lokal ausprobieren

Service Worker laufen nicht über `file://`, es braucht einen kleinen Webserver:

```bash
npx --yes serve .
```

Danach die angezeigte `localhost`-Adresse öffnen.

## Icons neu erzeugen

Nach Änderungen an `icons/icon.svg` die Formen in `tools/generate-icons.mjs`
angleichen (gleiche Koordinaten, Designraum 512×512) und ausführen:

```bash
node tools/generate-icons.mjs
```

## Veröffentlichen (GitHub Pages)

Für öffentliche Repositories ist GitHub Pages kostenlos. Einmalig einzustellen:

1. **Settings → Pages → Build and deployment → Source** auf **GitHub Actions**
   setzen (nicht „Deploy from a branch" – dafür ist der Workflow gebaut).
2. Falls das Repo privat ist: **Settings → General → Danger Zone → Change
   visibility → Public** (Pages ist für private Repos nur in bezahlten Plänen verfügbar).
3. Nach dem Push auf `main` läuft der Workflow „Deploy PWA to GitHub Pages"
   unter **Actions**. Die URL steht im Job-Ergebnis und unter **Settings → Pages**.

Die App liegt unter einem Unterpfad (`/hundePhysio/`). Deshalb sind alle Pfade im
Projekt **relativ** – beim Umbenennen des Repos oder bei einer eigenen Domain
muss nichts angepasst werden.

## Nach einem Update

Der Service Worker liefert alte Dateien aus dem Cache. Damit Nutzer die neue
Version bekommen, in `sw.js` die Konstante `VERSION` hochzählen (`v2` → `v3`);
`APP_VERSION` in `app.js` dient nur der Nachvollziehbarkeit.
