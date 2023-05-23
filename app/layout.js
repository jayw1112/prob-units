import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Probation Units',
  description: 'View and edit probation units pop sheets',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div>
          <h1>Probation Units</h1>
          <Link href='/'>Home</Link>
        </div>
        {children}
      </body>
    </html>
  )
}
