import path from '@/constants/path'
import { Link } from 'react-router-dom'
import UserIcon from '@/assets/user.svg?react'
import ChangePasswordIcon from '@/assets/change-password.svg?react'
import BillIcon from '@/assets/bill-icon.svg?react'
export default function UserSideNav() {
  return (
    <>
      <div className='flex items-center py-4 border-b border-b-gray-200'>
        <Link to={path.profile} className='flex-shrink-0 w-12 h-12 overflow-hidden border rounded-full border-black/10'>
          <img
            src='https://avatars.githubusercontent.com/u/87435674?v=4'
            alt=''
            className='object-cover w-full h-full'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 font-semibold text-gray-600 truncate'>cdPhuc</div>
          <Link to={path.profile} className='flex items-center text-gray-500 capitalize'>
            <svg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg' className='mr-[4px]'>
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              ></path>
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>

      <div className='mt-7'>
        <Link to={path.profile} className='flex items-center capitalize transition-colors text-orange'>
          <div className='mr-3 h-[22px] w-[22px]'>
            <UserIcon className='w-5 h-5 stroke-blue-600' />
          </div>
          Tài khoản của tôi
        </Link>
        <Link to={path.changePassword} className='flex items-center mt-4 text-gray-600 capitalize transition-colors'>
          <div className='mr-3 h-[22px] w-[22px]'>
            <ChangePasswordIcon className='w-5 h-5 stroke-blue-600' />
          </div>
          Thay đổi mật khẩu
        </Link>
        <Link to={path.historyPurchase} className='flex items-center mt-4 text-gray-600 capitalize transition-colors'>
          <div className='mr-3 h-[22px] w-[22px]'>
            <BillIcon className='w-5 h-5 stroke-blue-600' />
          </div>
          Đơn mua
        </Link>
      </div>
    </>
  )
}
