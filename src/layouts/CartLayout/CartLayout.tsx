import CartHeader from '@/components/CartHeader'
import Footer from '@/components/Footer'

interface CartLayoutProps {
  children?: React.ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <>
      <CartHeader />
      {children}
      <Footer />
    </>
  )
}
