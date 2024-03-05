import AuthenticateHeader from '@/components/AuthenticateHeader'
import Footer from '@/components/Footer'

interface AuthenticateLayoutProps {
  children?: React.ReactNode
}

export default function AuthenticateLayout({ children }: AuthenticateLayoutProps) {
  return (
    <div>
      <AuthenticateHeader /> {children} <Footer />
    </div>
  )
}
