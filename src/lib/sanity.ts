// Client Sanity lato sito (Astro). Legge i contenuti pubblicati dal CMS.
// Variabili in .env del progetto Astro (vedi .env.example nella root).
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET || 'production'

// Il client viene creato solo se il CMS è collegato (projectId presente).
// Senza credenziali resta null e le query restituiscono [] (modalità fallback).
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true, // CDN: ottimo per contenuti pubblici, veloce ed economico
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null
export function urlFor(source) {
  if (!builder) return {url: () => ''}
  return builder.image(source)
}

// -------- QUERY (GROQ) --------

// Reel pubblicabili: published == true E consentOnFile == true. Ordinati per 'order'.
export async function getReels() {
  if (!sanityClient) return [] // se il CMS non è ancora collegato, niente errori: lista vuota
  return sanityClient.fetch(
    `*[_type == "reel" && published == true && consentOnFile == true] | order(order asc){
      "id": _id, name, age, country, countryCode, source, platform, embedUrl,
      "videoUrl": video.asset->url,
      "posterUrl": poster.asset->url
    }`
  )
}

export async function getNews() {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "newsPost" && published == true] | order(date desc){
      "id": _id, title, "slug": slug.current, date, summary,
      "coverUrl": cover.asset->url
    }`
  )
}

export async function getAssociations() {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "association" && published == true] | order(order asc){
      "id": _id, name, country, website, logoAuthorized,
      "logoUrl": logo.asset->url
    }`
  )
}
