import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { RegisterType, schema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import AuthApi from '@/api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityErrors } from '@/utils/utils'
import { ErrorResponseApi } from '@/types/utils.types'
import { useAppContext } from '@/contexts/app.context'
import { toast } from 'react-toastify'
import Button from '@/components/Button'
import path from '@/constants/path'

type FormData = RegisterType

export default function Register() {
  const { setIsAuthenticated, setProfile } = useAppContext()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => AuthApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        navigate(path.home)
        setProfile(data.data.data.user)
        toast.success('Đăng ký thành công')
      },
      onError: (err) => {
        if (isAxiosUnprocessableEntityErrors<ErrorResponseApi<Omit<FormData, 'confirm_password'>>>(err)) {
          const formError = err.response && err.response.data.data
          // if (formError && formError.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 bg-white rounded shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                type='email'
                placeholder='Enter your email'
                register={register}
                name='email'
                autoComplete='on'
                className='mt-8'
                errorMessage={errors && errors.email?.message}
              />

              <Input
                type='password'
                placeholder='Enter your password'
                register={register}
                name='password'
                autoComplete='on'
                className='mt-2'
                errorMessage={errors && errors.password?.message}
              />

              <Input
                type='confirm_password'
                placeholder='Enter your confirm password'
                register={register}
                name='confirm_password'
                autoComplete='on'
                className='mt-2'
                errorMessage={errors && errors.confirm_password?.message}
              />

              <div className='mt-2'>
                <Button
                  isLoaing={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                  className='w-full px-2 py-4 text-sm text-center text-white uppercase bg-red-500 hover:bg-red-600'
                >
                  Đăng ký
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
