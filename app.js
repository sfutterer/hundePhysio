/* HundePhysio – Tagesplan, Detailansichten und Monatskalender. */
(() => {
  'use strict';

  const APP_VERSION = 'v4';
  const KEY = 'hundephysio.log.v1';

  const $ = (sel) => document.querySelector(sel);
  const el = (id) => document.getElementById(id);

  /* ------------------------------------------------------------ Speicher --- */
  // log = { "2026-09-10": ["prom", "cavaletti"], ... }
  let log = {};
  try {
    log = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    log = {};
  }

  function sichern() {
    try {
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch {
      /* Privater Modus o. Ä. – dann bleibt es bei der Sitzung. */
    }
  }

  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const HEUTE = iso(new Date());
  const erledigte = (tag) => log[tag] || [];
  const istErledigt = (tag, id) => erledigte(tag).includes(id);

  function setzeErledigt(tag, id, wert) {
    const liste = new Set(erledigte(tag));
    wert ? liste.add(id) : liste.delete(id);
    if (liste.size) log[tag] = [...liste];
    else delete log[tag];
    sichern();
    navigator.vibrate?.(8);
    zeichneAlles();
  }

  /* --------------------------------------------------------------- Datum --- */
  const tagVon = (s) => {
    const [j, m, t] = s.split('-').map(Number);
    return new Date(j, m - 1, t);
  };
  const langesDatum = (s) =>
    tagVon(s).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  const kurzesDatum = (s) =>
    tagVon(s).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  /* --------------------------------------------------------------- State --- */
  const state = {
    tab: 'heute',
    detail: null, // { id, datum, herkunft }
    sheet: null, // Datum
    monat: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  };

  /* ------------------------------------------------------------- Zeichnen -- */

  function zeichneAlles() {
    zeichneHeute();
    zeichneKalender();
    if (state.sheet) zeichneSheet(state.sheet);
    if (state.detail) aktualisiereDetailKnopf();
  }

  /* Heute ------------------------------------------------------------------ */

  function zeichneHeute() {
    el('heute-datum').textContent = langesDatum(HEUTE);

    const fertig = UEBUNGEN.filter((u) => istErledigt(HEUTE, u.id)).length;
    const gesamt = UEBUNGEN.length;
    el('heute-stand').textContent = `${fertig} von ${gesamt}`;
    el('heute-hinweis').textContent =
      fertig === gesamt ? 'Alles erledigt – guter Hund!' : 'Übungen erledigt';

    const umfang = 2 * Math.PI * 16;
    const ring = $('.ring-fg');
    ring.style.strokeDasharray = umfang;
    ring.style.strokeDashoffset = umfang * (1 - fertig / gesamt);

    const serie = serieLaenge();
    el('heute-serie').innerHTML = serie
      ? `<b>${serie}</b> ${serie === 1 ? 'Tag Serie' : 'Tage Serie'}`
      : '';

    const liste = el('liste-heute');
    liste.innerHTML = '';
    for (const u of UEBUNGEN) liste.appendChild(zeile(u, HEUTE, 'heute'));
  }

  function zeile(uebung, datum, herkunft) {
    const li = document.createElement('li');
    const an = istErledigt(datum, uebung.id);

    const check = document.createElement('button');
    check.className = 'check';
    check.type = 'button';
    check.setAttribute('aria-pressed', String(an));
    check.setAttribute('aria-label', `${uebung.titel} abhaken`);
    check.innerHTML = '<i></i>';
    check.addEventListener('click', () => setzeErledigt(datum, uebung.id, !istErledigt(datum, uebung.id)));

    const main = document.createElement('button');
    main.className = 'row-main';
    main.type = 'button';
    main.innerHTML = `
      <span class="row-text">
        <span class="row-title"></span>
        <span class="row-sub"></span>
      </span>
      <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>`;
    main.querySelector('.row-title').textContent = uebung.titel;
    main.querySelector('.row-sub').textContent = uebung.frequenz;
    main.addEventListener('click', () => oeffneDetail(uebung.id, datum, herkunft));

    li.append(check, main);
    return li;
  }

  function serieLaenge() {
    const vollstaendig = (tag) => UEBUNGEN.every((u) => istErledigt(tag, u.id));
    const d = new Date();
    if (!vollstaendig(iso(d))) d.setDate(d.getDate() - 1); // heute darf noch laufen
    let n = 0;
    while (vollstaendig(iso(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* Kalender --------------------------------------------------------------- */

  function zeichneKalender() {
    const jahr = state.monat.getFullYear();
    const monat = state.monat.getMonth();
    el('cal-monat').textContent = state.monat.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

    const jetzt = new Date();
    el('cal-vor').disabled = jahr === jetzt.getFullYear() && monat === jetzt.getMonth();

    const ersterTag = new Date(jahr, monat, 1);
    const vorlauf = (ersterTag.getDay() + 6) % 7; // Woche beginnt am Montag
    const tage = new Date(jahr, monat + 1, 0).getDate();

    const grid = el('cal-grid');
    grid.innerHTML = '';
    for (let i = 0; i < vorlauf; i++) {
      const leer = document.createElement('div');
      leer.className = 'cal-tag leer';
      grid.appendChild(leer);
    }

    for (let t = 1; t <= tage; t++) {
      const datum = iso(new Date(jahr, monat, t));
      const anzahl = erledigte(datum).length;
      const zukunft = datum > HEUTE;

      const zelle = document.createElement('button');
      zelle.type = 'button';
      zelle.className = 'cal-tag';
      if (datum === HEUTE) zelle.classList.add('heute');
      if (zukunft) zelle.classList.add('zukunft');
      zelle.disabled = zukunft;
      zelle.setAttribute(
        'aria-label',
        `${t}. – ${anzahl} von ${UEBUNGEN.length} Übungen erledigt`
      );

      const punktKlasse = anzahl === 0 ? '' : anzahl >= UEBUNGEN.length ? ' voll' : ' teil';
      zelle.innerHTML = `<span class="cal-num">${t}</span><span class="cal-punkt${punktKlasse}"></span>`;
      zelle.addEventListener('click', () => oeffneSheet(datum));
      grid.appendChild(zelle);
    }

    zeichneMonatsStatistik(jahr, monat);
  }

  function zeichneMonatsStatistik(jahr, monat) {
    const tage = new Date(jahr, monat + 1, 0).getDate();
    const daten = [];
    for (let t = 1; t <= tage; t++) {
      const datum = iso(new Date(jahr, monat, t));
      if (datum <= HEUTE) daten.push(datum);
    }

    const vollstaendig = daten.filter((d) => erledigte(d).length >= UEBUNGEN.length).length;
    const angefangen = daten.filter((d) => erledigte(d).length > 0).length;
    const summe = daten.reduce((n, d) => n + erledigte(d).length, 0);
    const moeglich = daten.length * UEBUNGEN.length;
    const quote = moeglich ? Math.round((summe / moeglich) * 100) : 0;

    const stat = el('monats-statistik');
    stat.innerHTML = '';
    stat.append(
      statZeile('Vollständige Tage', `${vollstaendig} von ${daten.length}`),
      statZeile('Tage mit Training', String(angefangen)),
      statZeile('Erledigte Übungen', `${summe} von ${moeglich} · ${quote} %`)
    );

    const proUebung = el('monats-uebungen');
    proUebung.innerHTML = '';
    for (const u of UEBUNGEN) {
      const n = daten.filter((d) => istErledigt(d, u.id)).length;
      proUebung.appendChild(statZeile(u.titel, `${n} ×`));
    }
  }

  function statZeile(links, rechts) {
    const li = document.createElement('li');
    li.className = 'plain';
    const b = document.createElement('b');
    b.textContent = links;
    const s = document.createElement('span');
    s.textContent = rechts;
    li.append(b, s);
    return li;
  }

  /* Detailansicht ---------------------------------------------------------- */

  function oeffneDetail(id, datum, herkunft) {
    state.detail = { id, datum, herkunft };
    zeichneDetail();
    history.pushState({ ansicht: 'detail' }, '');
    const screen = el('screen-detail');
    screen.hidden = false;
    void screen.offsetWidth; // Reflow erzwingen, sonst startet die Transition nicht
    screen.classList.add('is-open');
  }

  function schliesseDetail(vonHistory) {
    if (!state.detail) return;
    state.detail = null;
    const screen = el('screen-detail');
    screen.classList.remove('is-open');
    setTimeout(() => {
      if (!state.detail) {
        screen.hidden = true;
        el('scroll-detail').innerHTML = '';
      }
    }, 380);
    if (!vonHistory) history.back();
  }

  function zeichneDetail() {
    const u = UEBUNGEN.find((x) => x.id === state.detail.id);
    el('detail-navtitel').textContent = u.titel;
    el('detail-zurueck-label').textContent = state.detail.herkunft === 'sheet' ? 'Zurück' : 'Heute';

    const teile = [];
    teile.push(`<div class="detail-hero"><h1>${u.titel}</h1><p>${u.kurz}</p></div>`);
    teile.push(`<div class="chips"><span class="chip">${u.frequenz}</span></div>`);

    teile.push(bausteinListe('Ziel der Übung', u.ziel));
    if (u.material) teile.push(`<div class="block"><h3>Material</h3><p>${u.material}</p></div>`);
    if (u.ablauf) teile.push(bausteinListe('Ablauf', u.ablauf, 'ol'));
    for (const b of u.bloecke || []) teile.push(bausteinListe(b.name, b.punkte));
    if (u.achtung) teile.push(bausteinListe('Achtung', u.achtung, 'ul', 'warn'));
    if (u.recherche) {
      teile.push(
        bausteinListe(
          'Ergänzende Hinweise',
          u.recherche,
          'ul',
          'recherche',
          'Nicht Teil des Handzettels – recherchierte Ergänzung zur Ausführung.'
        )
      );
    }

    for (const v of u.videos || []) teile.push(videoKarte(v));

    const an = istErledigt(state.detail.datum, u.id);
    teile.push(
      `<button class="action${an ? ' is-done' : ''}" id="detail-toggle">${
        an ? 'Erledigt – Haken entfernen' : 'Als erledigt markieren'
      }</button>`
    );
    teile.push(
      `<p class="footnote">Für ${
        state.detail.datum === HEUTE ? 'heute' : kurzesDatum(state.detail.datum)
      }. Quelle der Übung: Handzettel AniCura Kleintierzentrum Weingarten.</p>`
    );

    const ziel = el('scroll-detail');
    ziel.innerHTML = teile.join('');
    ziel.scrollTop = 0;

    el('detail-toggle').addEventListener('click', () => {
      setzeErledigt(state.detail.datum, u.id, !istErledigt(state.detail.datum, u.id));
    });

    ziel.querySelectorAll('.video-play').forEach((knopf) => {
      knopf.addEventListener('click', () => {
        const rahmen = knopf.parentElement;
        const id = knopf.dataset.video;
        rahmen.innerHTML =
          `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1&playsinline=1"` +
          ' title="Video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' +
          ' allowfullscreen loading="lazy"></iframe>';
      });
    });
  }

  function aktualisiereDetailKnopf() {
    const knopf = el('detail-toggle');
    if (!knopf) return;
    const an = istErledigt(state.detail.datum, state.detail.id);
    knopf.textContent = an ? 'Erledigt – Haken entfernen' : 'Als erledigt markieren';
    knopf.classList.toggle('is-done', an);
  }

  function bausteinListe(titel, punkte, tag = 'ul', klasse = '', fussnote = '') {
    const eintraege = punkte.map((p) => `<li>${p}</li>`).join('');
    const fuss = fussnote ? `<p class="quelle">${fussnote}</p>` : '';
    return `<div class="block ${klasse}"><h3>${titel}</h3><${tag}>${eintraege}</${tag}>${fuss}</div>`;
  }

  function videoKarte(v) {
    return `<div class="video">
      <div class="video-head">
        <strong>${v.titel}</strong>
        <span>${v.kanal} · ${v.sprache}</span>
      </div>
      <div class="video-frame">
        <button class="video-play" type="button" data-video="${v.id}">
          <svg viewBox="0 0 68 48" aria-hidden="true"><path d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.5 1.6a8.6 8.6 0 0 0-6 6.1A90 90 0 0 0 0 24a90 90 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.5-1.6a8.6 8.6 0 0 0 6-6.1A90 90 0 0 0 68 24a90 90 0 0 0-1.5-16.3z" fill="#f00"/><path d="M27 34l18-10-18-10z" fill="#fff"/></svg>
          Video abspielen
        </button>
      </div>
      <a class="video-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Auf YouTube öffnen</a>
    </div>`;
  }

  /* Tagesblatt (Sheet) ------------------------------------------------------ */

  function oeffneSheet(datum) {
    state.sheet = datum;
    zeichneSheet(datum);
    history.pushState({ ansicht: 'sheet' }, '');
    el('sheet-backdrop').hidden = false;
    el('sheet').hidden = false;
    void el('sheet').offsetWidth; // Reflow erzwingen
    el('sheet-backdrop').classList.add('is-open');
    el('sheet').classList.add('is-open');
  }

  function schliesseSheet(vonHistory) {
    if (!state.sheet) return;
    state.sheet = null;
    el('sheet-backdrop').classList.remove('is-open');
    el('sheet').classList.remove('is-open');
    setTimeout(() => {
      if (!state.sheet) {
        el('sheet-backdrop').hidden = true;
        el('sheet').hidden = true;
      }
    }, 380);
    if (!vonHistory) history.back();
  }

  function zeichneSheet(datum) {
    el('sheet-titel').textContent = datum === HEUTE ? 'Heute' : kurzesDatum(datum);
    const fertig = erledigte(datum).length;

    const liste = document.createElement('ul');
    liste.className = 'list';
    for (const u of UEBUNGEN) liste.appendChild(zeile(u, datum, 'sheet'));

    const hinweis = document.createElement('p');
    hinweis.className = 'sheet-hinweis';
    hinweis.textContent = `${fertig} von ${UEBUNGEN.length} Übungen erledigt. Haken lassen sich auch nachträglich setzen.`;

    const body = el('sheet-body');
    body.innerHTML = '';
    body.append(liste, hinweis);
  }

  /* --------------------------------------------------------- Navigation --- */

  function zeigeTab(name) {
    state.tab = name;
    el('screen-heute').hidden = name !== 'heute';
    el('screen-kalender').hidden = name !== 'kalender';
    el('screen-hilfe').hidden = name !== 'hilfe';
    document.querySelectorAll('.tab').forEach((t) => {
      const aktiv = t.dataset.tab === name;
      t.classList.toggle('is-active', aktiv);
      aktiv ? t.setAttribute('aria-current', 'page') : t.removeAttribute('aria-current');
    });
  }

  document.querySelectorAll('.tab').forEach((t) => {
    t.addEventListener('click', () => zeigeTab(t.dataset.tab));
  });

  el('detail-zurueck').addEventListener('click', () => schliesseDetail(false));
  el('sheet-close').addEventListener('click', () => schliesseSheet(false));
  el('sheet-backdrop').addEventListener('click', () => schliesseSheet(false));

  addEventListener('popstate', () => {
    if (state.sheet) schliesseSheet(true);
    else if (state.detail) schliesseDetail(true);
  });

  el('cal-zurueck').addEventListener('click', () => {
    state.monat = new Date(state.monat.getFullYear(), state.monat.getMonth() - 1, 1);
    zeichneKalender();
  });
  el('cal-vor').addEventListener('click', () => {
    state.monat = new Date(state.monat.getFullYear(), state.monat.getMonth() + 1, 1);
    zeichneKalender();
  });

  // Navigationsleiste erst einblenden, wenn der Large Title weggescrollt ist.
  for (const id of ['heute', 'kalender', 'hilfe']) {
    const bereich = el(`scroll-${id}`);
    bereich.addEventListener(
      'scroll',
      () => {
        bereich.parentElement.querySelector('.navbar').classList.toggle('is-visible', bereich.scrollTop > 36);
      },
      { passive: true }
    );
  }

  // Datumswechsel über Mitternacht: beim Zurückkehren neu laden.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && iso(new Date()) !== HEUTE) location.reload();
  });

  /* ------------------------------------------------------------- Hilfe --- */

  const installiert = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  function zeigeLage() {
    if (installiert()) {
      el('install-lage').textContent = 'Läuft als installierte App';
      el('install-lage-sub').textContent = 'Die Haken werden hier auf dem Gerät gespeichert.';
    } else {
      el('install-lage').textContent = 'Läuft im Browser';
      el('install-lage-sub').textContent = 'Für den Home-Bildschirm der Anleitung unten folgen.';
    }
  }
  zeigeLage();
  el('app-version').textContent = APP_VERSION;

  // Chrome und Edge bieten die Installation selbst an; iOS tut das nicht.
  let installEreignis = null;
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEreignis = e;
    el('install-knopf').hidden = false;
  });

  el('install-knopf').addEventListener('click', async () => {
    if (!installEreignis) return;
    el('install-knopf').disabled = true;
    await installEreignis.prompt();
    await installEreignis.userChoice;
    installEreignis = null;
    el('install-knopf').hidden = true;
  });

  addEventListener('appinstalled', () => {
    el('install-knopf').hidden = true;
    zeigeLage();
  });

  /* ----------------------------------------------------- Service Worker --- */

  if ('serviceWorker' in navigator) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  document.documentElement.dataset.version = APP_VERSION;

  zeigeTab('heute');
  zeichneAlles();
})();
