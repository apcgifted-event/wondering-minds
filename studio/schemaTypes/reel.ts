import {defineField, defineType} from 'sanity'

// REEL — "Voices from Europe"
// Rispecchia src/content/config.ts del sito. Due modelli: embed | upload.
// Pubblicazione possibile SOLO con published === true E consentOnFile === true.
export default defineType({
  name: 'reel',
  title: 'Reel — Voci dall’Europa',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome (solo nome, senza cognome)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'age',
      title: 'Età',
      type: 'number',
      validation: (r) => r.required().min(6).max(18).integer(),
    }),
    defineField({
      name: 'country',
      title: 'Paese (es. Italy)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'countryCode',
      title: 'Codice paese a 2 lettere (es. it, de, es)',
      type: 'string',
      validation: (r) => r.required().length(2).lowercase(),
    }),
    defineField({
      name: 'source',
      title: 'Tipo di reel',
      type: 'string',
      options: {
        list: [
          {title: 'Embed — post social già pubblico', value: 'embed'},
          {title: 'Upload — video ospitato da noi', value: 'upload'},
        ],
        layout: 'radio',
      },
      initialValue: 'embed',
      validation: (r) => r.required(),
    }),

    // --- campi EMBED ---
    defineField({
      name: 'platform',
      title: 'Piattaforma social',
      type: 'string',
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'YouTube', value: 'youtube'},
        ],
      },
      hidden: ({parent}) => parent?.source !== 'embed',
    }),
    defineField({
      name: 'embedUrl',
      title: 'URL del post social',
      type: 'url',
      hidden: ({parent}) => parent?.source !== 'embed',
    }),

    // --- campi UPLOAD ---
    defineField({
      name: 'video',
      title: 'File video',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.source !== 'upload',
    }),

    // --- comune ---
    defineField({
      name: 'poster',
      title: 'Immagine di anteprima (poster)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'order',
      title: 'Ordine di visualizzazione',
      type: 'number',
      initialValue: 0,
    }),

    // --- interruttori di sicurezza ---
    defineField({
      name: 'consentOnFile',
      title: 'Liberatoria firmata archiviata',
      description:
        'Spunta SOLO se la liberatoria immagini/video del minore è firmata e archiviata. Senza, il reel non viene pubblicato.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: 'Pubblicato',
      description: 'Mostra il reel sul sito. Richiede anche la liberatoria archiviata.',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {title: 'name', age: 'age', country: 'country', media: 'poster', pub: 'published', consent: 'consentOnFile'},
    prepare({title, age, country, media, pub, consent}) {
      const live = pub && consent
      return {
        title: `${title}, ${age} — ${country}`,
        subtitle: live ? '🟢 visibile sul sito' : '⚪️ bozza (non pubblicato o senza liberatoria)',
        media,
      }
    },
  },
})
