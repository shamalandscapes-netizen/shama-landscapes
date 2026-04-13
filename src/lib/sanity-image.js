import { dataset, projectId } from '@/sanity/env'

export function getSanityImageUrl(source) {
  if (!source?.asset) return null
  
  // If URL is already resolved
  if (source.asset.url) return source.asset.url
  
  // Construct from _ref
  const ref = source.asset._ref
  if (!ref) return null
  
  // Parse ref: image-abc123-800x600-jpg
  const parts = ref.split('-')
  if (parts[0] !== 'image') return null
  
  const id = parts[1]
  const extension = parts[parts.length - 1]
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`
}

export function getSanityImageUrlWithParams(source, params = {}) {
  const baseUrl = getSanityImageUrl(source)
  if (!baseUrl) return null
  
  const queryParams = new URLSearchParams()
  
  if (params.width) queryParams.append('w', params.width)
  if (params.height) queryParams.append('h', params.height)
  if (params.quality) queryParams.append('q', params.quality)
  if (params.format) queryParams.append('fm', params.format)
  if (params.crop) queryParams.append('crop', params.crop)
  if (params.fit) queryParams.append('fit', params.fit)
  
  const queryString = queryParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}