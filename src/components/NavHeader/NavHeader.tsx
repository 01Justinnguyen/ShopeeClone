import { Link } from 'react-router-dom'
import FaceBookLogo from '@/assets/logo-facebook.svg?react'
import InstagramLogo from '@/assets/logo-instagram.svg?react'
import Popover from '@/components/Popover'
import GlobalLogo from '@/assets/global-logo.svg?react'
import ArrowDown from '@/assets/arrow-down.svg?react'
import { useAppContext } from '@/contexts/app.context'
import path from '@/constants/path'
import Button from '@/components/Button'
import { useMutation } from '@tanstack/react-query'
import AuthApi from '@/api/auth.api'
import { toast } from 'react-toastify'
import { queryClient } from '@/main'
import { purchasesStatus } from '@/constants/purchase'
function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useAppContext()

  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      toast.success('Đã đăng xuất')
      queryClient.removeQueries({
        queryKey: ['purchases', { status: purchasesStatus.inCart }]
      })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
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
  )
}

export default NavHeader
