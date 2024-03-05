/* eslint-disable import/no-unresolved */
import { Link, useMatch } from 'react-router-dom'
import Logo from '@/assets/logo.svg?react'

export default function AuthenticateHeader() {
  const isMatch = Boolean(useMatch('/register'))
  return (
    <header className='py-5'>
      <div className='container px-4 mx-auto max-w-7xl'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-end'>
            <Link to={'/'}>
              <Logo className='h-8 lg:h-11 fill-orange' />
            </Link>
            <div className='ml-5 text-xl lg:text-2xl'>{isMatch ? 'Đăng ký' : 'Đăng nhập'}</div>
          </div>
          <p className='text-base text-orange'>Bạn cần giúp đỡ?</p>
        </nav>
      </div>
    </header>
  )
}
