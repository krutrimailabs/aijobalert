import type React from 'react'
import type { Job, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string | undefined

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Job | Post

      if (collection === 'jobs') {
        redirectUrl = `/jobs/${document.id}`
      } else {
        const slug = (document as Post)?.slug
        if (slug) redirectUrl = `/posts/${slug}`
      }
    } else {
      const collection = redirectItem.to?.reference?.relationTo
      const doc = redirectItem.to?.reference?.value as Job | Post

      if (collection === 'jobs') {
        redirectUrl = `/jobs/${doc?.id}`
      } else {
        const slug = (doc as Post)?.slug
        if (slug) redirectUrl = `/posts/${slug}`
      }
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
