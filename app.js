/* Dummy-Version: Hallo Welt + PWA-Grundgerüst. */
(() => {
  'use strict';

  const APP_VERSION = 'v1';
  const $ = (id) => document.getElementById(id);
  const SPEICHER_KEY = 'hundephysio.letzterBesuch';

  /* --- Letzter Besuch aus dem localStorage (Platzhalter für spätere Daten) --- */
  try {
    const vorher = localStorage.getItem(SPEICHER_KEY);
    $('besuch').textContent = vorher
      ? `Zuletzt geöffnet: ${new Date(vorher).toLocaleString('de-DE')}`
      : 'Schön, dass du das erste Mal hier bist!';
    localStorage.setItem(SPEICHER_KEY, new Date().toISOString());
  } catch {
    $('besuch').textContent = 'Speichern im Browser ist deaktiviert.';
  }

  /* --- Online/Offline --- */
  const netz = $('netz');
  const zeigeNetz = () => { netz.hidden = navigator.onLine; };
  addEventListener('online', zeigeNetz);
  addEventListener('offline', zeigeNetz);
  zeigeNetz();

  /* --- Installiert oder im Browser? --- */
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    $('install-status').textContent = 'als App installiert';
  }

  /* --- Installations-Button (Chrome/Edge/Android) --- */
  let installEvent = null;
  const button = $('install');
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    button.hidden = false;
  });
  button.addEventListener('click', async () => {
    if (!installEvent) return;
    button.disabled = true;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    installEvent = null;
    button.hidden = true;
    if (outcome === 'accepted') $('install-status').textContent = 'wird installiert';
  });
  addEventListener('appinstalled', () => {
    button.hidden = true;
    $('install-status').textContent = 'als App installiert';
  });

  /* --- Service Worker --- */
  $('version').textContent = APP_VERSION;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(
      () => { $('sw-status').textContent = 'aktiv'; },
      () => { $('sw-status').textContent = 'nicht verfügbar'; }
    );
  } else {
    $('sw-status').textContent = 'vom Browser nicht unterstützt';
  }
})();
