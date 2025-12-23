import React from 'react'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | 'default' | 'outline'
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'posts'
    value: Post | string | number
  } | null
  size?: 'default' | 'sm' | 'lg' | 'icon' | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

interface CTABlockProps {
  id?: string
  links?: Array<{ link: CMSLinkType }>
  richText?: DefaultTypedEditorState
}

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
