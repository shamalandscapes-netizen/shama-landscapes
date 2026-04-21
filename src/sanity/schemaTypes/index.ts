import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { submissionType } from './submissionType'
import { newsletterType } from './newsletterType'
import { leadType } from './leadType'
import { commentType } from './commentType'
import { likeType } from './likeType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    submissionType,
    newsletterType,
    leadType,
    commentType,
    likeType,
  ],
}