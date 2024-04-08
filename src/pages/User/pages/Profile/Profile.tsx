import UserApi from '@/api/user.api'
import Button from '@/components/Button'
import DateSelect from '@/components/DateSelect'
import Input from '@/components/Input'
import InputNumber from '@/components/Input/InputNumber'
import { userSchema, UserSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'data_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'data_of_birth', 'avatar'])

export default function Profile() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: UserApi.getProfile
  })

  const profile = profileData?.data.data

  const updateProfileMutation = useMutation({
    mutationFn: UserApi.updateProfile
  })

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      data_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('data_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(2000, 10, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    // await updateProfileMutation.mutateAsync(data)
  })

  return (
    <div className='px-2 pb-10 bg-white rounded-sm shadow md:pb-20 md:px-7'>
      <div className='py-6 border-b border-b-gray-200'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='flex flex-col-reverse mt-8 md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='flex-grow mt-6 md:pr-12 md:mt-0'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='flex flex-col flex-wrap mt-6 sm:flex-row'>
            <div className='w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
            <div className='w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
            <div className='w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>

          <Controller
            control={control}
            name='data_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.data_of_birth?.message} onChange={field.onChange} value={field.value} />
            )}
          />

          <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
            <div className='w-[20%] truncate pt-3 sm:text-right capitalize' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex items-center px-5 text-sm text-center text-white h-9 bg-orange hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>

        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='w-24 h-24 my-5'>
              <img
                src='https://avatars.githubusercontent.com/u/87435674?v=4'
                alt=''
                className='object-cover w-full h-full rounded-full'
              />
            </div>
            <input type='file' accept='.jpg,.jpeg,.png' className='hidden' />
            <button
              type='button'
              className='flex items-center justify-end h-10 px-6 text-sm text-gray-600 bg-white border rounded-sm shadow-sm'
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>Dung lượng file tối đa 1MB</div>
            <div className='mt-1 text-gray-400'>Định dạng: .JPEG, .PNG</div>
          </div>
        </div>
      </form>
    </div>
  )
}
