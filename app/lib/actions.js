'use server'
import { z } from 'zod'
import { supabase } from '@/app/lib/data'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'

export async function authenticate(prevState, formData) {
  try {
    await signIn('credentials', Object.fromEntries(formData))
  } catch (error) {
    if (error.message.includes('CredentialsSignin')) {
      return 'CredentialSignin'
    }
    throw error
  }
}
const InvoiceSchema = z.object({
  id: z.string(),
  customer_id: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Pleasae select an invoice status',
  }),
  date: z.string(),
})

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true })

export async function createInvoice(prevState, formData) {
  const validatedFields = CreateInvoice.safeParse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  // console.log(`validatedfields: ${JSON.stringify(validatedFields, null, 2)}`)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create invoice.',
    }
  }
  const { customer_id, amount, status } = validatedFields.data
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

  const amountInCents = amount * 100
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
    const { error } = await supabase.from('invoices').delete().eq('id', id)
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Failed to delete the invoice.' }
  }

  revalidatePath('/dashboard/invoices')
}
