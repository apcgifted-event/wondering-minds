import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// I valori projectId e dataset arrivano dal file .env (vedi .env.example).
// Vengono creati automaticamente quando esegui `npm create sanity@latest`.
export default defineConfig({
  name: 'wondering-minds',
  title: 'Wondering Minds',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'INSERISCI_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
