import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getMeUser } from '@/utilities/getMeUser'
// import { Input } from '@/components/ui/input' // Assuming standard UI components exist
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Select... } from ...

// Since UI components might vary, I'll use standard HTML/Tailwind for the form if specific components aren't guaranteed,
// OR assume standard shadcn-like structure which user seems to use (DiscusisonThread used them).
import { CreateThreadForm } from '@/components/community/CreateThreadForm'

export default async function CreateThreadPage() {
  const payload = await getPayload({ config: configPromise })
  const user = await getMeUser()

  if (!user || !user.user) {
    redirect(`/login?redirect=/community/new`)
  }

  const topics = await payload.find({
    collection: 'forum-topics',
    limit: 100,
    sort: 'title',
  })

  // We can use a Server Action here for submission, or a client component wrapper.
  // Using a simple server action inline (if supported) or importing one.
  // For simplicity and to stick to patterns seen (client side fetch in DiscussionThread),
  // let's make a Client Component for the form to handle loading states/toast nicely.
  // But wait, this is a Server Component page.
  // I will create a `CreateThreadForm` client component and embed it here.

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Discussion</h1>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <CreateThreadForm topics={topics.docs} />
      </div>
    </div>
  )
}

// Inline Client Component for the form (or could be separate file, but inline for speed if acceptable pattern)
// Next.js doesn't allow inline client components in server files easily without 'use client' at top which makes whole file client.
// So I must make this file 'use client' OR separate them.
// The data fetching (topics) is best done on server.
// So I will create `src/components/community/CreateThreadForm.tsx` and import it.
