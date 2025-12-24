import type { Media as MediaType, Post } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { ButtonProps } from '@/components/ui/button'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'posts'
    value: Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export interface HeroProps {
  type?: 'highImpact' | 'mediumImpact' | 'lowImpact' | 'none'
  links?: Array<{ link: CMSLinkType }>
  media?: MediaType | string | number | null
  richText?: DefaultTypedEditorState
}
