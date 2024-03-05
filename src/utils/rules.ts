import * as yup from 'yup'

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(60, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(60, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Confirm password must match')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(60, 'Độ dài từ 6 - 160 ký tự')
})

export const loginSchema = schema.omit(['confirm_password'])

export type RegisterType = yup.InferType<typeof schema>
export type LoginType = Omit<yup.InferType<typeof schema>, 'confirm_password'>
