/* eslint-disable */
// MIGRAZIONE: copia il vecchio campo "text" nel nuovo "text_it" dei post-it
// del Wall of Wonder (e fa lo stesso per le news: title -> title_it, ecc.).
//
// Da lanciare UNA volta, dalla cartella studio/:
//   $env:SANITY_WRITE_TOKEN="il_token"; node migrate-fields.mjs
//
// È SICURO: agisce solo sui documenti che hanno il vecchio campo pieno e il
// nuovo vuoto. Non sovrascrive nulla di già compilato. Rilanciarlo non fa danni.
//
// Alla fine stampa un riepilogo di cosa ha migrato.

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('='))
    .map((l) => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim().replace(/^"|"$/g, '')]; })
);
const projectId = env.SANITY_STUDIO_PROJECT_ID;
const dataset = env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('\nManca SANITY_WRITE_TOKEN. Crea un token (manage.sanity.io -> API -> Tokens, permesso Editor) e rilancia:');
  console.error('  $env:SANITY_WRITE_TOKEN="il_token"; node migrate-fields.mjs\n');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

// Mappa delle migrazioni: tipo documento -> [ [campoVecchio, campoNuovo], ... ]
const MIGRATIONS = {
  wallNote: [['text', 'text_it']],
  newsPost: [['title', 'title_it'], ['summary', 'summary_it'], ['body', 'body_it']],
};

async function run() {
  let totalPatched = 0;

  for (const [type, pairs] of Object.entries(MIGRATIONS)) {
    // Prendo tutti i documenti del tipo, comprese le bozze.
    const docs = await client.fetch(`*[_type == $type]{ _id, ${pairs.map(([o, n]) => `${o}, ${n}`).join(', ')} }`, { type });

    if (!docs.length) {
      console.log(`· ${type}: nessun documento trovato.`);
      continue;
    }

    let patched = 0;
    for (const d of docs) {
      const set = {};
      const unset = [];

      for (const [oldF, newF] of pairs) {
        const oldVal = d[oldF];
        const newVal = d[newF];
        const oldHasValue = oldVal !== undefined && oldVal !== null && oldVal !== '';
        const newIsEmpty = newVal === undefined || newVal === null || newVal === '';
        // Migro solo se il vecchio ha un valore e il nuovo è vuoto.
        if (oldHasValue && newIsEmpty) {
          set[newF] = oldVal;
          unset.push(oldF);
        }
      }

      if (Object.keys(set).length) {
        let p = client.patch(d._id).set(set);
        if (unset.length) p = p.unset(unset);
        await p.commit();
        patched++;
        console.log(`  ✔ ${d._id}: ${Object.keys(set).join(', ')}`);
      }
    }

    console.log(`· ${type}: ${patched} documento/i migrato/i su ${docs.length}.`);
    totalPatched += patched;
  }

  console.log(`\n✅ Migrazione completata. Documenti aggiornati: ${totalPatched}.`);
  if (totalPatched > 0) {
    console.log('   Apri lo Studio e ricontrolla i contenuti prima di pubblicare.\n');
  } else {
    console.log('   Non c\'era nulla da migrare (o era già stato fatto).\n');
  }
}

run().catch((e) => { console.error('Errore:', e.message); process.exit(1); });
