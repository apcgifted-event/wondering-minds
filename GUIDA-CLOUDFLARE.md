# Hosting su Cloudflare Pages

Guida per pubblicare il sito su **Cloudflare Pages** invece di Netlify.
Motivo del cambio: il piano free di Netlify usa un sistema "a crediti" che si esaurisce
e può mettere il sito offline. Cloudflare Pages ha build illimitati sul piano gratuito,
nessuna pubblicità, CDN globale. Il sito è statico: non serve cambiare il codice.

> Il codice resta su GitHub. Sanity resta dov'è (separato, non si tocca).
> Cambia solo *chi serve le pagine*: da Netlify a Cloudflare.

---

## 1. Crea l'account Cloudflare

1. Vai su **https://dash.cloudflare.com/sign-up** e registrati (email + password). Gratis.
2. Conferma l'email.

## 2. Collega il repository GitHub

1. Nella dashboard Cloudflare: menu laterale **Workers & Pages**.
2. **Create application** → scheda **Pages** → **Connect to Git**.
3. Autorizza Cloudflare ad accedere a GitHub (se chiede, dai accesso al repo
   `wondering-minds`).
4. Seleziona il repository **wondering-minds** → **Begin setup**.

## 3. Impostazioni di build

Compila così (sono i valori per Astro statico):

| Campo | Valore |
|---|---|
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | *(lascia vuoto)* |

> Il file `.nvmrc` nel progetto dice già a Cloudflare di usare Node 20: non devi
> impostarlo a mano.

## 4. Variabili d'ambiente (il collegamento a Sanity)

Sempre in questa schermata di setup, apri **Environment variables** e aggiungi le
**stesse due** che usavi su Netlify:

| Nome | Valore |
|---|---|
| `SANITY_PROJECT_ID` | `9gkbg85q` |
| `SANITY_DATASET` | `production` |

## 5. Pubblica

1. Clicca **Save and Deploy**. La prima build richiede ~1 minuto.
2. Il sito sarà online su un indirizzo tipo **`wondering-minds.pages.dev`**.
3. Da ora ogni `git push` su GitHub fa ripartire il deploy automaticamente —
   come prima, ma senza il limite dei crediti.

## 6. Aggiorna il webhook di Sanity (per i contenuti)

Il vecchio webhook puntava a Netlify. Va rifatto verso Cloudflare, così quando il
gestore pubblica un contenuto il sito si ricostruisce da solo.

1. In Cloudflare: il tuo progetto Pages → **Settings** → **Builds & deployments** →
   sezione **Deploy hooks** → **Add deploy hook**.
   - Nome: `Sanity publish`, branch: `main`. Crea. Copia l'URL generato.
2. Su Sanity **manage.sanity.io** → progetto → **API** → **Webhooks**:
   - Apri il webhook esistente (quello che puntava a Netlify) e **sostituisci l'URL**
     con quello nuovo di Cloudflare. Salva.
   - (oppure cancellalo e creane uno nuovo con l'URL Cloudflare, trigger
     create/update/delete, method POST — come avevamo fatto prima.)

## 7. (Quando pronti) Il dominio definitivo

Per usare un indirizzo `carano4children.org` invece di `.pages.dev`: progetto Pages →
**Custom domains** → **Set up a domain**. Cloudflare gestisce il certificato HTTPS
automaticamente. Da fare insieme alla parte compliance, non prima.

---

## E Netlify?

Una volta che Cloudflare funziona e mostra il sito aggiornato (con tutte le immagini),
puoi **eliminare il progetto su Netlify** per non lasciarlo a metà: dashboard Netlify →
sito → **Site configuration** → in fondo **Danger zone** → **Delete site**. Non è
urgente: appena Cloudflare è live, Netlify smette semplicemente di essere usato.
