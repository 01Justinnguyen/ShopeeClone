import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ErrorResponseApi } from '@/types/utils.types'
import AuthApi from '@/api/auth.api'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useAppContext } from '@/contexts/app.context'
import { Schema, schema } from '@/utils/rules'
import { isAxiosUnprocessableEntityErrors } from '@/utils/utils'
import path from '@/constants/path'

type FormData = Pick<Schema, 'email' | 'password'>

const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useAppContext()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => AuthApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        navigate(path.home)
        setProfile(data.data.data.user)
        toast.success('Đăng nhập thành công')
      },
      onError: (err) => {
        if (isAxiosUnprocessableEntityErrors<ErrorResponseApi<FormData>>(err)) {
          const formErrors = err.response && err.response.data.data

          if (formErrors) {
            Object.keys(formErrors).forEach((key) => {
              setError(key as keyof FormData, {
                message: formErrors[key as keyof FormData],
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
              <div className='text-2xl'>Đăng nhập</div>
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

              <div className='mt-2'>
                <Button
                  isLoaing={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  className='flex items-center justify-center w-full px-2 py-4 text-sm text-center text-white uppercase bg-red-500 hover:bg-red-600'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
