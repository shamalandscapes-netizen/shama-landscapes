// sanity/schemaTypes/categoryType.ts
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
      rows: 3,
      description: 'Used for SEO meta description on category pages',
      validation: (Rule) =>
        Rule.max(160).warning('Keep it under 160 characters for SEO'),
    }),

    // ✅ Safe replacement for color-input plugin (no dependencies)
    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color (e.g. #0F7F40)',

      validation: (Rule) =>
        Rule.required()
          .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            name: 'hex color',
          })
          .warning('Use a valid hex color like #0F7F40 or #FFF'),
    }),

    defineField({
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      description: 'Show in main navigation',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})