# Wondering Minds — sito del progetto European Gifted Minds

Scaffold del sito statico bilingue (IT/EN) per l'evento del **9 ottobre 2026 a Bruxelles**,
progetto della Fondazione Carano 4 Children.

Stack: **Astro** (sito statico) + **content collections** per i contenuti gestiti.
Allineato alla Brand Identity ufficiale (palette Deep Forest / Wonder Gold, font Cambria/Calibri).

---

## Avvio rapido (per chi sviluppa)

```bash
npm install      # una volta sola
npm run dev      # sviluppo su http://localhost:4321
npm run build    # genera il sito in dist/
npm run preview  # anteprima della build
```

Hosting consigliato: **Vercel** o **Netlify** (CDN/region EU, free tier sufficiente,
deploy automatico a ogni push su Git). Output 100% statico: nessun server da gestire.

---

## Struttura

```
src/
  pages/          pagine IT in root, pagine EN sotto en/
  layouts/Base.astro    intelaiatura comune (head, header, footer)
  components/     Header, Footer, HomeContent, ReelCard
  content/        contenuti gestiti (reel, news, associazioni) + config.ts (schema)
  i18n/ui.ts      TUTTI i testi dell'interfaccia, IT ed EN
  styles/global.css     design token del brand
public/images/    logo, immagini
```

---

## Come si aggiornano i contenuti

### I reel ("Voices from Europe")

Ogni reel è un file in `src/content/reels/`. Due modelli:

**A) Embed — il ragazzo ha già pubblicato su un social (consigliato)**
```json
{
  "name": "Giulia", "age": 16, "country": "Italy", "countryCode": "it",
  "source": "embed", "platform": "instagram",
  "embedUrl": "https://www.instagram.com/reel/XXXX/",
  "posterUrl": "/images/reels/giulia.jpg",
  "consentOnFile": true, "published": true, "order": 1
}
```

**B) Upload — video raccolto dal team (es. video dei genitori via Drive)**
```json
{
  "name": "Lukas", "age": 15, "country": "Germany", "countryCode": "de",
  "source": "upload",
  "videoUrl": "/videos/lukas.mp4", "posterUrl": "/images/reels/lukas.jpg",
  "consentOnFile": true, "published": true, "order": 2
}
```

**Due interruttori di sicurezza, entrambi obbligatori per la pubblicazione:**
- `published: true` — il reel è pronto a essere mostrato
- `consentOnFile: true` — la liberatoria firmata del minore è archiviata (fuori dal sito)

Se manca anche solo uno dei due, **il reel non appare**. È voluto: tratta dati di minori.

### News e associazioni
Stessa logica in `src/content/news/` e `src/content/associations/`.
Le associazioni mostrano il logo solo se `logoAuthorized: true`.

### I testi del sito
Tutto il testo di menu, bottoni, titoli sta in **`src/i18n/ui.ts`**, in due blocchi `it` ed `en`.
Modifichi lì e cambia ovunque, in entrambe le lingue.

---

## Il CMS Sanity (configurato)

Lo scaffold è **già collegato a Sanity**: chi gestisce i contenuti usa un pannello
web, senza toccare i file. La cartella `studio/` contiene il pannello; `src/lib/sanity.ts`
collega il sito.

**Vedi la guida completa: [`GUIDA-SANITY.md`](./GUIDA-SANITY.md)** — account da zero,
setup, pubblicazione online e uso quotidiano per il non-tecnico.

Comportamento del sito:
- se `.env` contiene `SANITY_PROJECT_ID`, il sito legge i contenuti **da Sanity**;
- altrimenti usa i contenuti di esempio locali in `src/content/` (nessun errore,
  utile per lavorare prima di aver creato l'account).

Gli schemi del CMS (`studio/schemaTypes/`) rispecchiano 1:1 quelli del sito
(`src/content/config.ts`): stessi campi, stessi due interruttori di sicurezza
(`published` + `consentOnFile`) per i reel dei minori.

> **Supabase** (la tua idea iniziale) **non serve** finché l'admin sono solo i 5 gruppi
> del team che editano contenuti: Sanity copre login e ruoli. Lo aggiungeremo se in
> futuro servirà vera autenticazione utenti o un database (es. iscrizioni con stati).

---

## Da completare PRIMA del go-live (compliance — Gruppo Legale)

Questi punti non sono opzionali per un sito che tratta dati di minori, patrocinato da
istituzioni UE. Non sono consulenza legale: vanno validati dal vostro Gruppo Legale.

- [ ] **Privacy policy** completa (`src/pages/privacy.astro` è solo uno stub) con base
      giuridica, consenso verificabile, minimizzazione, data retention.
- [ ] **Cookie banner GDPR** privacy-first: nessuno script di terze parti (inclusi embed
      social) prima del consenso. Punto previsto nel layout.
- [ ] **Liberatorie** immagini/video dei minori firmate e archiviate per ogni reel.
- [ ] **Region EU** sull'hosting e su qualunque servizio (Supabase EU, ecc.).
- [ ] **Autorizzazione all'uso dei loghi** dei patrocinatori (UNESCO, Parlamento Europeo,
      Comitato delle Regioni, ecc.) prima di pubblicarli.
- [ ] **Dominio ed email** sotto `carano4children.org` (fondazione titolare).

---

## Da sostituire (segnaposto presenti)

Le aree tratteggiate verdi sul sito sono segnaposto immagine: ognuna mostra
un'etichetta con cosa caricare. Per sostituirle, metti il file in `public/images/`
e passa il percorso al componente.

Immagini della home (componente `src/components/HomeContent.astro`):
- **Foto hero** — ragazzi di spalle, braccia sulle spalle, davanti alle bandiere UE,
  formato orizzontale ~1600×900px. Caricala come `public/images/hero.jpg` e nel
  componente sostituisci `<Placeholder label={t('hero.photoLabel')} .../>` con
  `<Placeholder src="/images/hero.jpg" alt="..." ratio="16 / 11" />`.
- **5 card** (quadrate ~600×600px): illustrazione Blueland, mano col globo, mappa
  Europa, ragazzi con smartphone, fotocamera. Stesso metodo, una per card.

Altri segnaposto:
- Immagini gallery e poster dei reel.
- Testi delle pagine interne (About, Event, Ambassadors, ecc.): ora segnaposto.
- Link social reali nel footer.

Il logo ufficiale (`public/images/logo.png`) è già inserito nell'header.
