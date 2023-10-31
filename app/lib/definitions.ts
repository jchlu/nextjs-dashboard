export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          email: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          email: string
          id?: string
          image_url: string
          name: string
        }
        Update: {
          email?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          customer_id: string
          date: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          customer_id: string
          date: string
          id?: string
          status: string
        }
        Update: {
          amount?: number
          customer_id?: string
          date?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      revenue: {
        Row: {
          month: string
          revenue: number
        }
        Insert: {
          month: string
          revenue: number
        }
        Update: {
          month?: string
          revenue?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string
          id: string
          name: string
          password: string
        }
        Insert: {
          email: string
          id?: string
          name: string
          password: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
          password?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']


// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string
  name: string
  email: string
  password: string
}

export type Customer = {
  id: string
  name: string
  email: string
  image_url: string
}

export type Invoice = {
  id: string
  customer_id: string
  amount: number
  date: string
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid'
}

export type Revenue = {
  month: string
  revenue: number
}

export type LatestInvoice = {
  id: string
  name: string
  image_url: string
  email: string
  amount: string
}

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number
}

export type InvoicesTable = {
  id: string
  customer_id: string
  name: string
  email: string
  image_url: string
  date: string
  amount: number
  status: 'pending' | 'paid'
}

export type CustomersTable = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: number
  total_paid: number
}

export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: string
  total_paid: string
}

export type CustomerField = {
  id: string
  name: string
}

export type InvoiceForm = {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}
