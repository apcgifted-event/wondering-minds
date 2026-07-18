import {defineField, defineType} from 'sanity'

// WALL OF WONDER — un post-it per documento, bilingue (IT + EN).
// Autore, colore e ordine sono comuni alle due lingue.
export default defineType({
  name: 'wallNote',
  title: 'Wall of Wonder — Post-it',
  type: 'document',
  fields: [
    defineField({
      name: 'text_it',
      title: 'IT — Testo del post-it',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: 'text_en',
      title: 'EN — Note text',
      description: 'Se lasciato vuoto, il sito inglese mostra il testo italiano.',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(180),
    }),
    defineField({
      name: 'author',
      title: 'Autore / provenienza (facoltativo)',
      description: 'Es. "Giulia, Italia" oppure "Famiglia da Berlino". Solo nome, senza cognome per i minori.',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Colore',
      type: 'string',
      options: {
        list: [
          {title: 'Giallo', value: 'yellow'},
          {title: 'Rosa', value: 'pink'},
          {title: 'Verde', value: 'green'},
          {title: 'Azzurro', value: 'blue'},
          {title: 'Arancio', value: 'orange'},
        ],
        layout: 'radio',
      },
      initialValue: 'yellow',
    }),
    defineField({
      name: 'order',
      title: 'Ordine',
      type: 'number',
      initialValue: 0,
    }),
    defineField({name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false}),
  ],
  orderings: [
    {title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'text_it', author: 'author', pub: 'published'},
    prepare({title, author, pub}) {
      return {title: title || '(post-it vuoto)', subtitle: `${pub ? '🟢' : '⚪️'} ${author || ''}`}
    },
  },
})
