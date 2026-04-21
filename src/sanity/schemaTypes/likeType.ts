import { defineField, defineType } from 'sanity'

export const likeType = defineType({
  name: 'like',
  title: 'Like',
  type: 'document',

  fields: [
    defineField({
      name: 'postId',
      title: 'Post ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'postSlug',
      title: 'Post Slug',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Used to prevent duplicate likes from same user session',
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: 'postSlug',
      subtitle: 'sessionId',
    },
    prepare({ title, subtitle }) {
      return {
        title: `Like → ${title || 'Unknown Post'}`,
        subtitle: subtitle || 'No session',
      }
    },
  },
})