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
    .max(60, 'Độ dài từ 6 - 160 ký tự'),
  price_min: yup.string().test({
    name: 'Price-not-allowed',
    message: 'Giá chưa đúng',
    test: function (value) {
      const price_min = value
      const { price_max } = this.parent as { price_min: string; price_max: string }
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  price_max: yup.string().test({
    name: 'Price-not-allowed',
    message: 'Giá chưa đúng',
    test: function (value) {
      const price_max = value
      const { price_min } = this.parent as { price_min: string; price_max: string }
      if (value !== '' && price_min !== '') {
        return Number(price_max) >= Number(value)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  name: yup.string().required('Cần phải nhập tên sản phẩm').trim()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  data_of_birth: yup.date().max(new Date(), 'Hãy chọn 1 ngày trong quá khứ'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confim_password: schema.fields['confirm_password']
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>
