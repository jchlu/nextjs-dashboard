import { ClerkProvider } from '@clerk/nextjs'
import '@/app/ui/global.css'
import { geist } from './ui/fonts'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider
        afterSignInUrl="/dashboard"
        appearance={{
          signIn: {
            elements: {
              footer: {
                display: 'none',
              },
            },
          },
        }}
      >
        <body className={`${geist.className} antialiased`}>{children}</body>
      </ClerkProvider>
    </html>
  )
}
