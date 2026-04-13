import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Client for read-only operations (used in browser/components)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})

// Client for write operations (used in API routes only)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Need to add this to .env
})