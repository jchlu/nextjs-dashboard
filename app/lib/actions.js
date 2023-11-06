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

  try {
    const insertData = { customer_id, amount: amountInCents, status, date }
    const { data, error } = await supabase
      .from('invoices')
      .insert([insertData])
      .select()
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Failed to insert the new invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

// Use Zod to update the expected types
const UpdateInvoice = InvoiceSchema.omit({ date: true })

// ...

export async function updateInvoice(id, formData) {
  const { customer_id, amount, status } = UpdateInvoice.parse({
    id,
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  const amountInCents = amount* 100
  const updateData = { customer_id, amount: amountInCents, status }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Failed to update the invoice.' }
  }

    
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}


export async function deleteInvoice(id) {

 try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Failed to delete the invoice.' }
  }

  revalidatePath('/dashboard/invoices')
}
