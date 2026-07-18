import {defineField, defineType} from 'sanity'

// DOCUMENTI PDF
// Un documento per ogni PDF scaricabile. Titolo bilingue, file caricato,
// interruttore online/offline.
export default defineType({
  name: 'pdfDoc',
  title: 'PDF — Documenti',
  type: 'document',
  fields: [
    defineField({
      name: 'title_it',
      title: 'IT — Titolo del documento',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'EN — Document title',
      type: 'string',
    }),
    defineField({
      name: 'description_it',
      title: 'IT — Descrizione breve (facoltativa)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'description_en',
      title: 'EN — Short description (optional)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'file',
      title: 'File PDF',
      type: 'file',
      options: {accept: 'application/pdf'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordine',
      description: 'Numero per ordinare i documenti (più basso = prima).',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'published',
      title: 'Online',
      description: 'Se spento, il documento non compare sul sito (offline).',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title_it', pub: 'published', order: 'order'},
    prepare({title, pub, order}) {
      return {
        title: title || '(documento senza titolo)',
        subtitle: `${pub ? '🟢 online' : '⚪️ offline'} · ordine ${order ?? 0}`,
      }
    },
  },
})
