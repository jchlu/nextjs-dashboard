import '@/app/ui/global.css'
import { inter } from './ui/fonts'
import { Children } from '@/types'

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
