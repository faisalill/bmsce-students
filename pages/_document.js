import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Html, Head, Main, NextScript } from 'next/document'



export default function Document() {
  return (
    <Html lang="en" data-theme='dark'>
      <Head />
      <body>
        <Navbar />
        <Main />
        <NextScript />
        <Footer />
      </body>
    </Html>
  )
}
