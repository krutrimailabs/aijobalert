import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  let headerData: Header | null = null

  try {
    headerData = await getCachedGlobal('header', 1)()
  } catch (error) {
    console.error('Failed to fetch Header data (DB likely down):', error)
    // headerData remains null
  }

  return <HeaderClient headerPromise={Promise.resolve(headerData as Header)} />
}
