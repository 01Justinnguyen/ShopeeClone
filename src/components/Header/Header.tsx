/* eslint-disable import/no-unresolved */
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import CartLogo from '@/assets/cart-logo.svg?react'
import FindIcon from '@/assets/find-icon.svg?react'
import FaceBookLogo from '@/assets/logo-facebook.svg?react'
import InstagramLogo from '@/assets/logo-instagram.svg?react'
import Logo from '@/assets/logo.svg?react'
import GlobalLogo from '@/assets/global-logo.svg?react'
import ArrowDown from '@/assets/arrow-down.svg?react'
import Popover from '../Popover'
import { useAppContext } from '@/contexts/app.context'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@tanstack/react-query'

import path from '@/constants/path'
import Button from '../Button'
import AuthApi from '@/api/auth.api'
import useQueryConfig from '@/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { Schema, schema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { purchasesStatus } from '@/constants/purchase'
import purchaseAPi from '@/api/purchase.api'
import { formatCurrency, sliceTitle } from '@/utils/utils'

type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])
const MAX_PRODUCT = 5

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useAppContext()
  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const queryConfig = useQueryConfig()

  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      toast.success('Đã đăng xuất')
    }
  })

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseAPi.getPurchasesList({ status: purchasesStatus.inCart })
  })

  const purchasesIncart = purchasesInCartData?.data.data

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const onSubmitSearch = handleSubmit((value) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: value.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: value.name
        }

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })

  return (
    <div className='pt-2 pb-5 bg-[linear-gradient(-180deg,#f53d2d,#f63)] text-white'>
      <div className='container'>
        <div className='flex items-center justify-between'>
          <div className='flex items-end gap-x-2'>
            <span className='text-xs cursor-pointer hover:text-gray-300'>Tải ứng dụng</span>

            <div className='h-4 border border-[#f96c5c]'></div>

            <div className='flex text-sm'>
              <span className='mr-1 text-xs hover:text-gray-300'>Kết nối</span>
              <div className='flex items-end gap-x-2'>
                <Link to={'https://www.facebook.com/'}>
                  <FaceBookLogo className='w-4 h-4 cursor-pointer fill-white hover:fill-slate-200' />
                </Link>
                <Link to={'https://www.instagram.com/'}>
                  <InstagramLogo className='w-4 h-4 cursor-pointer fill-white hover:fill-slate-200' />
                </Link>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-x-3'>
            <Popover
              className='flex items-center py-1 cursor-pointer hover:text-gray-300'
              as={'span'}
              renderPopoverParent={
                <>
                  <GlobalLogo className='w-4 h-4' />
                  <span className='mx-[3px] text-xs'>Tiếng việt</span>
                  <ArrowDown className='w-[14px] h-[14px]' />
                </>
              }
            >
              <div className='bg-white border border-gray-200 border-none rounded-sm shadow-md'>
                <div className='flex flex-col px-3 py-1 pr-24'>
                  <button className='px-2 py-1 text-[14px] hover:text-orange'>Tiếng Việt</button>
                  <button className='px-2 py-1 mt-2 text-[14px] hover:text-orange'>EngLish</button>
                </div>
              </div>
            </Popover>

            {isAuthenticated ? (
              <Popover
                className='flex items-center py-1 cursor-pointer hover:text-gray-300'
                renderPopoverParent={
                  <>
                    <div className='flex-shrink-0 w-4 h-4 mr-2 '>
                      <img
                        src='https://avatars.githubusercontent.com/u/87435674?v=4'
                        alt=''
                        className='object-cover w-full h-full rounded-full'
                      />
                    </div>
                    <span className='text-xs'>{profile?.email}</span>
                  </>
                }
              >
                <div className='overflow-hidden rounded-sm shadow-lg'>
                  <Link
                    to={path.profile}
                    className='block w-full px-3 py-2 text-[14px] bg-white hover:bg-slate-100 hover:text-cyan-500'
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to={path.home}
                    className='block w-full px-3 py-2 text-[14px] bg-white hover:bg-slate-100 hover:text-cyan-500'
                  >
                    Đơn mua
                  </Link>
                  <Button
                    disabled={logoutMutation.isPending}
                    onClick={() => handleLogout()}
                    className='block w-full px-3 py-2 text-[14px] text-left bg-white hover:bg-slate-100 hover:text-cyan-500'
                  >
                    Đăng xuất
                  </Button>
                </div>
              </Popover>
            ) : (
              <div className='flex items-center gap-x-2'>
                <Link to={path.login} className='text-xs cursor-pointer hover:text-gray-300'>
                  Đăng nhập
                </Link>
                <div className='h-4 border border-[#f96c5c]'></div>
                <Link to={path.register} className='text-xs cursor-pointer hover:text-gray-300'>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

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
              <Link to={path.home} className='flex-shrink-0 px-6 py-2 rounded-sm bg-orange hover:bg-orange/90'>
                <FindIcon className='w-4 h-4' />
              </Link>
            </div>
          </form>
          <Popover
            className='items-end col-span-1 text-center'
            renderPopoverParent={
              <Link to={path.cart} className='relative inline-block'>
                <CartLogo className='w-7 h-7' />
                <span className='absolute -top-[6px] left-[14px] px-2 py-[2px] text-[10px] bg-white rounded-full text-orange border border-[#ee4d2d]'>
                  {purchasesIncart?.length}
                </span>
              </Link>
            }
          >
            {isAuthenticated && purchasesIncart ? (
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
                    {/* <div className='flex p-[10px] cursor-pointer hover:bg-slate-100'>
                      <div className='flex-shrink-0'>
                        <img
                          src='https://avatars.githubusercontent.com/u/87435674?v=4'
                          alt='product'
                          className='object-cover w-10 h-10'
                        />
                      </div>
                      <div className='flex-grow ml-2 overflow-hidden'>
                        <div className='truncate'>
                          Beam Transporter GFT60T3B106-13 Bộ giảm tốc hành trình-GFT60T3B106-15 trình
                        </div>
                        <span className='text-sm text-gray-400'>x2</span>
                      </div>

                      <div className='flex-shrink-0 ml-2'>
                        <span className='text-orange'>₫115.709.000</span>
                      </div>
                    </div>
                    <div className='flex p-[10px] cursor-pointer hover:bg-slate-100'>
                      <div className='flex-shrink-0'>
                        <img
                          src='https://avatars.githubusercontent.com/u/87435674?v=4'
                          alt='product'
                          className='object-cover w-10 h-10'
                        />
                      </div>
                      <div className='flex-grow ml-2 overflow-hidden'>
                        <div className='truncate'>
                          Beam Transporter GFT60T3B106-13 Bộ giảm tốc hành trình-GFT60T3B106-15 trình
                        </div>
                        <span className='text-sm text-gray-400'>x2</span>
                      </div>

                      <div className='flex-shrink-0 ml-2'>
                        <span className='text-orange'>₫115.709.000</span>
                      </div>
                    </div>
                    <div className='flex p-[10px] cursor-pointer hover:bg-slate-100'>
                      <div className='flex-shrink-0'>
                        <img
                          src='https://avatars.githubusercontent.com/u/87435674?v=4'
                          alt='product'
                          className='object-cover w-10 h-10'
                        />
                      </div>
                      <div className='flex-grow ml-2 overflow-hidden'>
                        <div className='truncate'>
                          Beam Transporter GFT60T3B106-13 Bộ giảm tốc hành trình-GFT60T3B106-15 trình
                        </div>
                        <span className='text-sm text-gray-400'>x2</span>
                      </div>

                      <div className='flex-shrink-0 ml-2'>
                        <span className='text-orange'>₫115.709.000</span>
                      </div>
                    </div>
                    <div className='flex p-[10px] cursor-pointer hover:bg-slate-100'>
                      <div className='flex-shrink-0'>
                        <img
                          src='https://avatars.githubusercontent.com/u/87435674?v=4'
                          alt='product'
                          className='object-cover w-10 h-10'
                        />
                      </div>
                      <div className='flex-grow ml-2 overflow-hidden'>
                        <div className='truncate'>
                          Beam Transporter GFT60T3B106-13 Bộ giảm tốc hành trình-GFT60T3B106-15 trình
                        </div>
                        <span className='text-sm text-gray-400'>x2</span>
                      </div>

                      <div className='flex-shrink-0 ml-2'>
                        <span className='text-orange'>₫115.709.000</span>
                      </div>
                    </div> */}
                  </div>
                  <div className='flex items-center justify-between mt-6 px-[10px] pb-[10px]'>
                    <div className='text-xs text-gray-400 capitalize'>
                      <span>{purchasesIncart.length > MAX_PRODUCT ? purchasesIncart.length - MAX_PRODUCT : ''}</span>{' '}
                      Thêm vào giỏ hàng
                    </div>
                    <button className='hover:opacity-95 transition-all py-2 text-white capitalize px-[15px] bg-orange'>
                      Xem giỏ hàng
                    </button>
                  </div>
                </>
              </div>
            ) : (
              <div className='text-center min-w-[400px] bg-white py-[100px] shadow-lg rounded-sm border-none'>
                <div
                  className='inline-block w-[100px] h-[100px] bg-cover bg-center bg-no-repeat '
                  style={{
                    backgroundImage:
                      'url("https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png")'
                  }}
                ></div>
                <h3 className='font-normal'>Chưa có sản phẩm</h3>
              </div>
            )}
          </Popover>
        </div>
      </div>
    </div>
  )
}
