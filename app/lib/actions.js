'use server'
import { z } from 'zod'
import { supabase } from '@/app/lib/data'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const InvoiceSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true })

export async function createInvoice(formData) {
  const { customer_id, amount, status } = CreateInvoice.parse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]
  const insertData = { customer_id, amount: amountInCents, status, date }
  const { data, error } = await supabase
    .from('invoices')
    .insert([insertData])
    .select()
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
