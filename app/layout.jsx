import '@/app/ui/global.css'
import { geist } from './ui/fonts'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  )
}
