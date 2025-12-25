import { Field } from 'payload'
import formatSlug from '../utilities/formatSlug'

export const slugField = (fieldToUse: string = 'title'): Field => ({
  name: 'slug',
  label: 'Slug',
  type: 'text',
  index: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
})
