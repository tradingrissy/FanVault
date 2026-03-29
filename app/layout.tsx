import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'FanVault — Support Creators',
  description: 'The creator platform that pays more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0,padding:0,background:'#0a0a0a',color:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
        <Nav />
        {children}
      </body>
    </html>
  )
}
