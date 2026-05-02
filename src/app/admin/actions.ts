'use server'

import { currentUser } from '@clerk/nextjs/server'
import { updateQuoteStatus } from '@/lib/sanity'
import type { Quote } from '@/lib/types'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
  if (email !== process.env.ADMIN_EMAIL) throw new Error('No autorizado')
}

export async function setQuoteStatus(id: string, status: Quote['status']) {
  await assertAdmin()
  await updateQuoteStatus(id, status)
  revalidatePath('/admin')
}
