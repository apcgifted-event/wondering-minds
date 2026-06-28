# Andare online — guida completa

Obiettivo: portare online le **tre** parti del progetto e collegarle.

1. **GitHub** — ospita il codice (e fa da ponte verso Netlify).
2. **Netlify** — pubblica il sito visibile a tutti.
3. **Sanity** — ospita contenuti + pannello di amministrazione.

Segui le parti in ordine. Tutti i piani usati qui sono **gratuiti e senza pubblicità**.

> Comandi: sei su **Windows / PowerShell**. Dove vedi un blocco di comandi,
> incollali uno alla volta nella finestra PowerShell aperta dentro la cartella
> `wondering-minds`.

---

# PARTE 1 — Mettere il codice su GitHub

### 1.1 Creare l'account GitHub

1. Vai su **https://github.com** → **Sign up**.
2. Registrati con email, scegli username e password. Piano: **Free**.
3. Conferma l'email.

### 1.2 Creare il repository (il "cassetto" del codice)

1. In alto a destra su GitHub: **+** → **New repository**.
2. **Repository name**: `wondering-minds`.
3. Lascialo **Private** (consigliato finché non è pronto) o Public, come preferisci.
4. **NON** spuntare "Add a README" né altro: il progetto ha già i suoi file.
5. **Create repository**.
6. Si apre una pagina con dei comandi: **lasciala aperta**, ti serve l'indirizzo
   del repo, simile a `https://github.com/tuo-username/wondering-minds.git`.

### 1.3 Caricare il progetto

Apri PowerShell **nella cartella `wondering-minds`** ed esegui, una riga alla volta.
Sostituisci l'URL con quello del TUO repository (dal passo 1.2).

```powershell
git init
git add .
git commit -m "Primo caricamento del sito"
git branch -M main
git remote add origin https://github.com/tuo-username/wondering-minds.git
git push -u origin main
```

Al `git push` GitHub chiede di autenticarti: si apre una finestra del browser,
accetti, e il caricamento parte. Quando finisce, ricarica la pagina del repository
su GitHub: vedi tutti i file. ✅

> Le cartelle `node_modules`, `dist`, `.astro` **non** vengono caricate: è corretto,
> sono escluse apposta dal file `.gitignore`. Si ricreano da sole.

### 1.4 (importante) Lo Studio Sanity è una cartella separata

Dentro il progetto c'è `studio/` con un suo `.gitignore`. Va bene così: viene
caricato anch'esso su GitHub, ma le sue dipendenze restano escluse. Lo gestiremo
nella Parte 3.

---

# PARTE 2 — Pubblicare il sito su Netlify

Netlify guarda il tuo repository GitHub e, a ogni modifica, ricostruisce e
ripubblica il sito da solo.

### 2.1 Creare l'account

1. Vai su **https://www.netlify.com** → **Sign up**.
2. Scegli **Sign up with GitHub** (il modo più semplice: collega subito i due).
3. Autorizza Netlify ad accedere a GitHub.

### 2.2 Collegare il repository

1. Dalla dashboard Netlify: **Add new site** → **Import an existing project**.
2. Scegli **GitHub** e, se chiede, autorizza l'accesso al repo `wondering-minds`.
3. Seleziona il repository `wondering-minds`.

### 2.3 Impostazioni di build (Netlify le riconosce da solo, verifica che siano)

- **Base directory**: *(vuoto)* — la radice del progetto, NON `studio`.
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 2.4 Variabili d'ambiente (il collegamento a Sanity)

Prima di lanciare, apri **Add environment variables** / **Show advanced** e aggiungi
(li avrai pronti dopo la Parte 3; se non li hai ancora, puoi tornare qui dopo):

| Nome                | Valore               |
|---------------------|----------------------|
| `SANITY_PROJECT_ID` | *(il tuo Project ID)*|
| `SANITY_DATASET`    | `production`         |

> Senza queste variabili il sito va online lo stesso, mostrando i contenuti di
> esempio locali. Le aggiungi/aggiorni quando Sanity è pronto (Parte 3), poi un
> nuovo deploy collega i due.

### 2.5 Pubblicare

1. Clicca **Deploy**. In 1-2 minuti il sito è online su un indirizzo tipo
   `https://random-name-123.netlify.app`.
2. Per cambiarlo: **Site configuration** → **Change site name** → es.
   `wondering-minds` → diventa `https://wondering-minds.netlify.app`.

### 2.6 Region EU (importante per i dati dei minori)

Netlify serve il sito da una CDN globale che include nodi EU; per un sito statico
i dati personali non risiedono lì. Il punto critico EU è **Sanity** (Parte 3.6) e
l'**hosting dei video** caricati: assicurati che il dataset Sanity sia in regione EU.

### 2.7 Aggiornamenti automatici del sito

D'ora in poi: ogni volta che fai `git push` su GitHub, Netlify ricostruisce e
ripubblica il sito da solo. Non devi rifare nulla qui.

### Se preferisci Vercel invece di Netlify

Stessa logica. Differenze:
- Su **https://vercel.com** → Sign up with GitHub → **Add New Project** → importi il repo.
- Framework preset: seleziona **Astro** (Vercel lo riconosce).
- Build command `npm run build`, output `dist` (di solito già corretti).
- Le environment variables si aggiungono in **Settings → Environment Variables**.
- Il piano gratuito si chiama **Hobby**, anch'esso senza pubblicità.

---

# PARTE 3 — Mettere online Sanity (contenuti + pannello)

Ricorda la distinzione:
- **Contenuti**: sempre online sui server Sanity (creati nel passo 3.2).
- **Studio** (il pannello): lo pubblichi online nel passo 3.5, così la persona
  non-tecnica lo usa da un semplice link.

### 3.1 Account Sanity

1. Vai su **https://www.sanity.io** → **Get started / Sign up**.
2. Registrati (puoi usare GitHub). Piano **Free**.

### 3.2 Creare il progetto e collegare lo Studio

Apri PowerShell **nella cartella `studio`**:

```powershell
cd studio
npm install
npm create sanity@latest -- --env
```

Durante la procedura guidata:
- fai login (si apre il browser),
- scegli **Create new project**, nome `Wondering Minds`,
- dataset: **production**,
- **visibility del dataset: Public** (il sito legge i contenuti pubblici; i video
  e i dati sensibili NON vanno comunque caricati senza liberatoria — vedi 3.6),
- se chiede di sovrascrivere config o schemi, **rispondi N (no)**: ci sono già.

Al termine viene creato `studio/.env` con il tuo **Project ID**. Segnatelo: serve a
Netlify (Parte 2.4) e al sito (3.4).
Se non venisse creato: copia `studio/.env.example` in `studio/.env` e incolla il
Project ID (lo trovi anche su **https://www.sanity.io/manage**).

### 3.3 Provare lo Studio in locale (facoltativo)

```powershell
npm run dev
```

Apri **http://localhost:3333**: vedi il pannello con Reel, News, Associazioni.
`Ctrl+C` per fermarlo.

### 3.4 Collegare il SITO a Sanity

Vai nella **cartella principale** (esci da studio):

```powershell
cd ..
```

1. Copia `.env.example` in `.env` (in PowerShell: `Copy-Item .env.example .env`).
2. Apri `.env` con un editor e inserisci lo stesso Project ID:

```
SANITY_PROJECT_ID=il_tuo_project_id
SANITY_DATASET=production
```

3. Aggiungi gli **stessi due valori** anche su Netlify (Parte 2.4) e rilancia un
   deploy lì (su Netlify: **Deploys → Trigger deploy → Deploy site**), così il sito
   online inizia a leggere da Sanity.

### 3.5 Mettere lo Studio ONLINE (per il gestore non-tecnico)

Sempre nella cartella `studio`:

```powershell
cd studio
npm run deploy
```

Scegli un indirizzo, es. `wonderingminds`. Lo Studio sarà su
**https://wonderingminds.sanity.studio** — questo è il link da dare alla persona
che gestirà i contenuti. Non deve installare nulla: apre il link e accede.

### 3.6 Invitare il gestore e scegliere la regione EU

1. Su **https://www.sanity.io/manage** → progetto → **Members** → **Invite member**.
   Inserisci l'email, ruolo **Editor** (crea e pubblica, non tocca la configurazione).
2. **Regione dati**: nelle impostazioni del progetto verifica che il dataset sia
   ospitato in **EU**. Se alla creazione non hai potuto sceglierla, controlla qui e,
   se necessario, ricrea il progetto selezionando EU prima di inserire contenuti.
   È importante perché il progetto riguarda minori (GDPR).

### 3.7 Aggiornare il sito quando cambiano i contenuti

Il sito è statico: si rigenera a ogni pubblicazione su Sanity. Due modi:
- **Manuale**: su Netlify, **Trigger deploy → Deploy site**.
- **Automatico (consigliato)**: collega un webhook.
  1. Su Netlify: **Site configuration → Build & deploy → Build hooks → Add build
     hook**. Copia l'URL che genera.
  2. Su Sanity **manage → API → Webhooks → Create webhook**: incolla quell'URL,
     trigger su "create/update/delete". Salva.
  Così ogni *Publish* nel pannello aggiorna il sito in 1-2 minuti, da solo.

---

# Riepilogo: chi sta dove

| Cosa                        | Dove vive            | Chi lo usa            |
|-----------------------------|----------------------|-----------------------|
| Codice del sito             | GitHub               | tu (sviluppo)         |
| Sito pubblico               | Netlify (o Vercel)   | tutti i visitatori    |
| Contenuti (reel, news…)     | Sanity (cloud, EU)   | —                     |
| Pannello Studio             | *.sanity.studio      | il gestore non-tecnico|

Flusso quotidiano una volta online:
- **Tu** cambi codice → `git push` → Netlify ripubblica da solo.
- **Il gestore** apre il link Studio, scrive, **Publish** → webhook → sito aggiornato.

---

# Prima di considerare il sito "live" davvero

Non saltare la **checklist compliance** nel README (privacy policy, cookie banner,
liberatorie dei minori, autorizzazione loghi patrocinatori, dominio
`carano4children.org`). Finché non è completata, tieni il sito su un indirizzo
`.netlify.app` non diffuso e non pubblicizzarlo.
