import NavHeader from '@/components/NavHeader'
import { Link } from 'react-router-dom'
import Logo from '@/assets/logo.svg?react'
import path from '@/constants/path'
import FindIcon from '@/assets/find-icon.svg?react'
import useSearchProducts from '@/hooks/useSearchProducts'

function CartHeader() {
  const { onSubmitSearch, register } = useSearchProducts()
  return (
    <div className='border-b border-b-black/10'>
      <div className='text-white bg-orange'>
        <div className='container'>
          <NavHeader />
        </div>
      </div>
      <div className='py-6 bg-white '>
        <div className='container'>
          <nav>
            <div className='md:flex md:items-center md:justify-between'>
              <Link to={path.home} className='flex items-center flex-shrink-0'>
                <div>
                  <Logo className='h-8 lg:h-11 fill-orange' />
                </div>
                <div className='mx-4 h-6 lg:h-8 w-[1px] bg-orange'></div>
                <div className='text-lg capitalize md:text-xl lg:text-2xl text-orange'>Giỏ hàng</div>
              </Link>
              <form className='mt-3 md:mt-0 md:w-[50%]' onSubmit={onSubmitSearch}>
                <div className='flex p-1 border-2 rounded-sm border-orange'>
                  <input
                    type='text'
                    className='flex-grow w-full px-3 py-1 text-black bg-transparent border-none outline-none'
                    placeholder='Shopee bao ship 0Đ - Đăng ký ngay!'
                    {...register('name')}
                  />
                  <button type='submit' className='flex-shrink-0 px-8 py-2 rounded-sm bg-orange hover:bg-orange/90'>
                    <FindIcon className='w-4 h-4 stroke-white' />
                  </button>
                </div>
              </form>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default CartHeader
