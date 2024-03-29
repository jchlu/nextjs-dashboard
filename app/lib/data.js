import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)
import { formatCurrency } from './utils'
import { unstable_noStore as noStore } from 'next/cache'
// import { invoices } from './placeholder-data'

export async function fetchBusinesses() {
    // Add noStore() here prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).

    try {
        let { data: businesses, error } = await supabase.from('Business').select('*')
        if (error) console.log(error.message)
        return businesses
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch businesses data.')
    }
}

export async function fetchRevenue() {
    // Add noStore() here prevent the response from being cached.
    // This is equivalent to in fetch(..., {cache: 'no-store'}).

    try {
        let { data: revenue, error } = await supabase.from('revenue').select('*')

        return revenue
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch revenue data.')
    }
}

export async function fetchLatestInvoices() {
    try {
        let { data: invoices, error } = await supabase
            .from('invoices')
            .select(
                `
	id,
	amount,
	customers ( name, image_url, email )
	`
            )
            .limit(5)
            .order('date', { ascending: false })

        const latestInvoices = invoices.map((invoice) => ({
            ...invoice.customers,
            id: invoice.id,
            amount: formatCurrency(invoice.amount),
        }))
        return latestInvoices
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch the latest invoices.')
    }
}

export async function fetchCardData() {
    try {
        let { data, error } = await supabase.from('v_invoicestatus').select('*')

        const { customerCount, invoiceCount, paid, pending } = data[0]
        const numberOfInvoices = Number(invoiceCount ?? '0')
        const numberOfCustomers = Number(customerCount ?? '0')
        const totalPaidInvoices = formatCurrency(paid ?? '0')
        const totalPendingInvoices = formatCurrency(pending ?? '0')

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices,
            totalPendingInvoices,
        }
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to card data.')
    }
}
const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices(query, currentPage) {
    const rangeStart = (currentPage - 1) * ITEMS_PER_PAGE
    const rangeEnd = rangeStart + (ITEMS_PER_PAGE - 1)
    // console.log(`rangeStart: ${rangeStart}, rangeEnd: ${rangeEnd}`)
    try {
        let { data: invoices, error } = await supabase
            .from('v_invoiceswithcustomers')
            .select('*')
            .or(
                `name.ilike.%${query}%,email.ilike.%${query}%,amount.ilike.%${query}%,date.ilike.%${query}%,status.ilike.%${query}%`
            )
            .order('date', { ascending: false })
            .limit(ITEMS_PER_PAGE)
            .range(rangeStart, rangeEnd)
        // console.log(`Invoice data: ${invoices.length}`)
        return invoices
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch invoices.')
    }
}
export async function fetchInvoicesPages(query) {
    try {
        let { count, error } = await supabase
            .from('v_invoiceswithcustomers')
            .select('*', { count: 'exact', head: true })
            .or(
                `name.ilike.%${query}%,email.ilike.%${query}%,amount.ilike.%${query}%,date.ilike.%${query}%,status.ilike.%${query}%`
            )

        // console.table(count)
        const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch total number of invoices.')
    }
}

export async function fetchInvoiceById(id) {
    noStore()
    try {
        const { data } = await supabase
            .from('invoices')
            .select('id,customer_id,amount,status')
            .eq('id', id)
        if (!data) {
            return
        }
        const invoice = {
            ...data[0],
            // Convert amount from cents to dollars
            amount: data[0].amount / 100,
        }
        return invoice
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch invoice.')
    }
}

export async function fetchCustomers() {
    try {
        let { data: customers, error } = await supabase
            .from('customers')
            .select('id,name')
            .order('name')

        return customers
    } catch (err) {
        console.error('Database Error:', err)
        throw new Error('Failed to fetch all customers.')
    }
}
/*
export async function fetchFilteredCustomers(query) {
  try {
    const data = await sql<CustomersTable>`
        SELECT
          customers.id,
          customers.name,
          customers.email,
          customers.image_url,
          COUNT(invoices.id) AS total_invoices,
          SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
          SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
        FROM customers
        LEFT JOIN invoices ON customers.id = invoices.customer_id
        WHERE
          customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`}
        GROUP BY customers.id, customers.name, customers.email, customers.image_url
        ORDER BY customers.name ASC
      `

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }))

    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
  }
}

export async function getUser(email) {
  try {
    const user = await sql`SELECT * from USERS where email=${email}`
    return user.rows[0] as User
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
} */
