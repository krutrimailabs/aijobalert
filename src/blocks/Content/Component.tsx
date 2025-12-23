import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Post } from '@/payload-types'

import { CMSLink } from '../../components/Link'

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

interface ContentBlockProps {
  id?: string
  columns?: Array<{
    size?: 'full' | 'half' | 'oneThird' | 'twoThirds'
    richText?: DefaultTypedEditorState
    enableLink?: boolean
    link?: CMSLinkType
  }>
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
