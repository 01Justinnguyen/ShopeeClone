/* eslint-disable import/no-unresolved */
import purchaseAPi from '@/api/purchase.api'
import CartLogo from '@/assets/cart-logo.svg?react'
import FindIcon from '@/assets/find-icon.svg?react'
import Logo from '@/assets/logo.svg?react'
import NavHeader from '@/components/NavHeader'
import path from '@/constants/path'
import { purchasesStatus } from '@/constants/purchase'
import { useAppContext } from '@/contexts/app.context'
import useQueryConfig from '@/hooks/useQueryConfig'
import { Schema, schema } from '@/utils/rules'
import { formatCurrency, sliceTitle } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Popover from '../Popover'
import useSearchProducts from '@/hooks/useSearchProducts'

const MAX_PRODUCT = 5

export default function Header() {
  const { isAuthenticated } = useAppContext()
  const { onSubmitSearch, register } = useSearchProducts()

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseAPi.getPurchasesList({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesIncart = purchasesInCartData?.data.data

  return (
    <div className='pt-2 pb-5 bg-[linear-gradient(-180deg,#f53d2d,#f63)] text-white'>
      <div className='container'>
        <NavHeader />

        <div className='grid items-end grid-cols-12 gap-4 mt-4'>
          <Link to={path.home} className='col-span-2'>
            <Logo className='h-7 lg:h-11 fill-white' />
          </Link>
          <form className='col-span-9' onSubmit={onSubmitSearch}>
            <div className='flex p-1 bg-white rounded-sm'>
              <input
                type='text'
                className='flex-grow px-3 py-2 text-sm text-black bg-transparent border-none outline-none'
                placeholder='Shopee bao ship 0Đ - Đăng ký ngay!'
                {...register('name')}
              />
              <button type='submit' className='flex-shrink-0 px-6 py-2 rounded-sm bg-orange hover:bg-orange/90'>
                <FindIcon className='w-4 h-4' />
              </button>
            </div>
          </form>
          <Popover
            className='items-end col-span-1 text-center'
            renderPopoverParent={
              <Link to={path.cart} className='relative inline-block'>
                <CartLogo className='w-7 h-7' />
                {purchasesIncart && (
                  <span className='absolute -top-[6px] left-[14px] px-2 py-[2px] text-[10px] bg-white rounded-full text-orange border border-[#ee4d2d]'>
                    {purchasesIncart?.length}
                  </span>
                )}
              </Link>
            }
          >
            {isAuthenticated && purchasesIncart && purchasesIncart.length > 0 ? (
              <div className='relative text-xs bg-white border-gray-200 border-none rounded-sm shadow-md'>
                <>
                  <div className='flex items-center text-gray-400 h-10 pl-[10px] capitalize'>Sản Phẩm Mới Thêm</div>
                  <div className=''>
                    {purchasesIncart.slice(0, MAX_PRODUCT).map((productItem) => (
                      <Link key={productItem._id} to={'/'} className='flex p-[10px] cursor-pointer hover:bg-slate-100'>
                        <div className='flex-shrink-0'>
                          <img src={productItem.product.image} alt='product' className='object-cover w-10 h-10' />
                        </div>
                        <div className='flex-grow ml-2 overflow-hidden'>
                          <div className='truncate'>
                            {sliceTitle({
                              title: productItem.product.name,
                              length: 40
                            })}
                          </div>
                          <span className='text-sm text-gray-400'>x{productItem.buy_count}</span>
                        </div>

                        <div className='flex-shrink-0 ml-2'>
                          <span className='text-orange'>₫{formatCurrency(productItem.product.price)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className='flex items-center justify-between mt-6 px-[10px] pb-[10px]'>
                    <div className='text-xs text-gray-400 capitalize'>
                      <span>{purchasesIncart.length > MAX_PRODUCT ? purchasesIncart.length - MAX_PRODUCT : ''}</span>{' '}
                      Thêm vào giỏ hàng
                    </div>
                    <Link
                      to={'/cart'}
                      className='hover:opacity-95 transition-all py-2 text-white capitalize px-[15px] bg-orange'
                    >
                      Xem giỏ hàng
                    </Link>
                  </div>
                </>
              </div>
            ) : (
              <div className='text-center min-w-[400px] bg-white py-[100px] shadow-lg rounded-sm border-none'>
                <div className='bg-emptyCart inline-block w-[100px] h-[100px] bg-cover bg-center bg-no-repeat'></div>
                <h3 className='font-normal'>Chưa có sản phẩm</h3>
              </div>
            )}
          </Popover>
        </div>
      </div>
    </div>
  )
}
