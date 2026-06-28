# Guida Sanity — da zero alla pubblicazione

Questa guida porta dal nulla a un sito con contenuti gestibili da una persona
non-tecnica. Tre parti:

- **Parte 1 — Setup tecnico** (una volta sola, la fa chi sviluppa)
- **Parte 2 — Pubblicazione online** (una volta sola)
- **Parte 3 — Uso quotidiano** (per chi gestisce i contenuti, nessuna competenza tecnica)

In fondo: spiegazione di cosa contiene `wondering-minds.tar.gz` e come aprirlo.

---

## Che cos'è Sanity, in una riga

È il "pannello di controllo" dei contenuti: una persona apre una pagina web, scrive,
carica foto e video, clicca *Publish*, e il sito si aggiorna. I file del sito non si
toccano mai.

Due pezzi che lavorano insieme:
- **Studio** = il pannello di amministrazione (la cartella `studio/`).
- **Sito** = il sito pubblico in Astro, che legge i contenuti da Sanity.

---

# Parte 1 — Setup tecnico (una volta sola)

Serve avere **Node.js 18+** installato (https://nodejs.org, versione "LTS").

### 1.1 Creare l'account Sanity

1. Vai su **https://www.sanity.io** e clicca **Get started** / **Sign up**.
2. Registrati con Google o con email. Il piano gratuito ("Free") è ampiamente
   sufficiente per questo progetto.
3. Conferma l'email se richiesto.

### 1.2 Creare il progetto e collegare lo Studio

Apri un terminale **dentro la cartella `studio/`** del progetto e lancia:

```bash
cd studio
npm install
npm create sanity@latest -- --env
```

Durante la procedura guidata:
- fai login (si apre il browser),
- scegli **Create new project**, dai il nome `Wondering Minds`,
- come dataset scegli **production**,
- se chiede di sovrascrivere file di configurazione, **rispondi no** (`N`):
  gli schemi e la config sono già nel progetto.

Al termine viene creato un file `.env` con dentro il tuo **Project ID**.
Se non venisse creato, copia `.env.example` in `.env` e incolla il Project ID
(lo trovi anche su **https://www.sanity.io/manage** → il tuo progetto).

### 1.3 Avviare lo Studio in locale

```bash
npm run dev
```

Apri **http://localhost:3333**. Vedi il pannello con tre sezioni: *Reel*,
*News e aggiornamenti*, *Associazioni partner*. Già funzionante.

### 1.4 Collegare il sito Astro a Sanity

Nella **cartella principale** del progetto (non in `studio/`):

1. copia `.env.example` in `.env`,
2. apri `.env` e incolla lo stesso **Project ID** del passo 1.2:

```
SANITY_PROJECT_ID=il_tuo_project_id
SANITY_DATASET=production
```

3. installa e avvia:

```bash
npm install
npm run dev
```

Apri **http://localhost:4321**: il sito ora legge i reel da Sanity.
Finché su Sanity non c'è nulla, il sito mostra i contenuti di esempio locali
(comportamento voluto: niente schermate vuote o errori).

### 1.5 Far comparire le immagini di Sanity

I reel "embed" e le news usano immagini caricate su Sanity. Per mostrarle, il
dominio di Sanity va autorizzato. È già gestito dal client (`src/lib/sanity.ts`);
non serve altro per il piano gratuito.

---

# Parte 2 — Pubblicazione online (una volta sola)

### 2.1 Mettere lo Studio online

Così chi gestisce i contenuti non deve installare niente: userà un semplice link.

```bash
cd studio
npm run deploy
```

Scegli un indirizzo, es. `wonderingminds`. Lo Studio sarà su
**https://wonderingminds.sanity.studio** — questo è il link da dare al gestore.

### 2.2 Invitare chi gestirà i contenuti

1. Vai su **https://www.sanity.io/manage**, apri il progetto.
2. Sezione **Members** → **Invite member**.
3. Inserisci l'email della persona. Ruolo consigliato: **Editor**
   (può creare e pubblicare contenuti, non può cambiare la configurazione).
4. La persona riceve un invito, crea la password e accede dal link dello Studio.

### 2.3 Mettere il sito online

Il sito è statico: si pubblica su **Vercel** o **Netlify** (gratis per questo uso).

1. Carica il progetto su un repository Git (GitHub).
2. Su Vercel/Netlify: **New project** → collega il repository.
3. Imposta come cartella radice la **cartella principale** (dove c'è `astro.config.mjs`),
   non `studio/`.
4. Nelle **Environment variables** del progetto, aggiungi:
   - `SANITY_PROJECT_ID` = il tuo Project ID
   - `SANITY_DATASET` = `production`
5. Avvia il deploy. Scegli una **region EU** (Francoforte/Irlanda) — importante per
   il GDPR, visto che il sito riguarda minori.

### 2.4 Aggiornare il sito quando cambiano i contenuti

Il sito è statico: si rigenera a ogni pubblicazione. Due modi:
- **Manuale**: su Vercel/Netlify, pulsante *Redeploy*.
- **Automatico (consigliato)**: su Sanity → *manage* → **API** → **Webhooks**,
  crea un webhook che punta all'URL di "deploy hook" fornito da Vercel/Netlify.
  Così ogni *Publish* aggiorna il sito da solo in 1–2 minuti.

---

# Parte 3 — Uso quotidiano (per chi gestisce i contenuti)

Nessuna competenza tecnica. Apri il link dello Studio
(es. **https://wonderingminds.sanity.studio**) e accedi.

### Aggiungere un reel "Voci dall'Europa"

1. Clicca **Reel — Voci dall'Europa** → **+** (nuovo).
2. Compila: nome (solo il nome, **mai il cognome**), età, paese, codice paese
   (2 lettere: `it`, `de`, `es`…).
3. Scegli il **Tipo di reel**:
   - **Embed** se il ragazzo ha già pubblicato su Instagram/TikTok/YouTube:
     scegli la piattaforma e incolla l'URL del post.
   - **Upload** se hai tu il file video (es. video dei genitori): carica il file.
4. Carica un'immagine di anteprima (poster).
5. **Spunta "Liberatoria firmata archiviata"** solo se la liberatoria del minore
   è davvero firmata e conservata.
6. **Spunta "Pubblicato"**.
7. Clicca **Publish** in basso.

> Regola di sicurezza: il reel appare sul sito **solo** se sono spuntate
> *entrambe* le caselle (Liberatoria + Pubblicato). Se ne manca una, resta
> nascosto. È una protezione voluta perché si tratta di minori.

### Aggiungere una news o un'associazione

**News** (bilingue): scegli **News e aggiornamenti** → **+**. Compila i campi comuni
(data, copertina, slug) e poi i campi testuali in italiano (IT — Titolo/Riassunto/
Contenuto) e in inglese (EN — Title/Summary/Content). Spunta **Pubblicato** → **Publish**.
Se lasci vuoti i campi EN, il sito inglese mostra il testo italiano come ripiego.

**Associazioni**: scegli la sezione, **+**, compila, spunta **Pubblicato**, **Publish**.
Il logo compare solo se spunti **Uso del logo autorizzato**. Il campo "Paese" è unico
(non tradotto): conviene scriverlo in inglese (es. "Italy", "Germany"), leggibile su
entrambe le versioni del sito.

### Modificare i testi di una pagina (es. "Il progetto")

Le pagine di testo del sito (a partire da "Il progetto / About") sono gestibili dal
pannello, sezione **Pagine di testo**. Ogni pagina ha i campi in italiano e inglese
affiancati (Titolo, Introduzione, Contenuto). Modifichi il testo e fai **Publish**:
il sito si aggiorna. La struttura grafica e l'impaginazione restano nel codice e non
si toccano dal pannello (è voluto, così il layout non si rompe).

> La pagina About arriva già precaricata coi testi dai documenti della Fondazione,
> tramite lo script `studio/seed-pages.mjs` (vedi GUIDA-ONLINE per lanciarlo una volta).
> Se non lo lanci, il sito mostra comunque gli stessi testi dal fallback locale.

### Modificare o togliere un contenuto

Aprilo, modifica e **Publish**. Per nasconderlo dal sito senza cancellarlo,
togli la spunta **Pubblicato** e **Publish**.

### Il pallino verde / bianco

Nella lista, accanto a ogni elemento:
- 🟢 = visibile sul sito,
- ⚪️ = bozza (non pubblicato, o senza liberatoria).

---

# Cosa contiene `wondering-minds.tar.gz` e come aprirlo

È un archivio compresso (come uno .zip) con **tutto il progetto**: sito + Studio.

### Aprirlo

- **macOS**: doppio clic sul file; si estrae la cartella `wondering-minds`.
- **Windows**: con un programma come 7-Zip, "Estrai qui". (Windows non apre i
  `.tar.gz` con doppio clic: serve 7-Zip o WinRAR.)
- **Da terminale** (macOS/Linux):
  ```bash
  tar -xzf wondering-minds.tar.gz
  ```

### Cosa trovi dentro

```
wondering-minds/
├── README.md                ← panoramica e checklist compliance
├── GUIDA-SANITY.md          ← questa guida
├── astro.config.mjs         ← config del sito
├── package.json             ← dipendenze del sito
├── .env.example             ← da copiare in .env con il Project ID
├── public/                  ← logo e immagini statiche
├── src/
│   ├── pages/               ← pagine (IT in root, EN sotto en/)
│   ├── components/          ← Header, Footer, ReelCard, HomeContent
│   ├── content/             ← contenuti di esempio (fallback senza CMS)
│   ├── lib/sanity.ts        ← collegamento del sito a Sanity
│   ├── i18n/ui.ts           ← tutti i testi IT/EN
│   └── styles/global.css    ← colori e font del brand
└── studio/                  ← il pannello Sanity (CMS)
    ├── package.json
    ├── sanity.config.ts
    ├── .env.example
    └── schemaTypes/         ← reel, news, associazioni
```

### Nota: cosa NON è incluso (è normale)

Non ci sono le cartelle `node_modules/` (le dipendenze) né `dist/` (il sito
generato): si ricreano da sole con `npm install` e `npm run build`. Tenerle fuori
dall'archivio lo rende molto più leggero.

### Da fare al primo avvio, in ordine

1. Estrai l'archivio.
2. Segui la **Parte 1** di questa guida (account + setup).
3. Poi la **Parte 2** per mettere tutto online.
4. Consegna al gestore il link dello Studio e la **Parte 3**.
