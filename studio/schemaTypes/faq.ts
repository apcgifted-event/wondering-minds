import {defineField, defineType} from 'sanity'

// FAQ — ogni documento è una domanda con risposta, bilingue.
export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question_it', title: 'IT — Domanda', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'answer_it', title: 'IT — Risposta', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'question_en', title: 'EN — Question', type: 'string'}),
    defineField({name: 'answer_en', title: 'EN — Answer', type: 'text', rows: 4}),
    defineField({
      name: 'order',
      title: 'Ordine',
      description: 'Numero per ordinare le domande (più basso = prima).',
      type: 'number',
      initialValue: 0,
    }),
    defineField({name: 'published', title: 'Pubblicata', type: 'boolean', initialValue: false}),
  ],
  orderings: [
    {title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'question_it', pub: 'published', order: 'order'},
    prepare({title, pub, order}) {
      return {title: title || '(domanda senza testo)', subtitle: `${pub ? '🟢' : '⚪️'} ordine ${order ?? 0}`}
    },
  },
})
