import { ErrorResponseApi } from '@/types/utils.types'
import axios, { AxiosError, HttpStatusCode } from 'axios'

export function isAxiosErrors<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityErrors<FormError>(errors: unknown): errors is AxiosError<FormError> {
  return isAxiosErrors(errors) && errors.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedErrors<UnauthorizedError>(errors: unknown): errors is AxiosError<UnauthorizedError> {
  return isAxiosErrors(errors) && errors.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenErrors<UnauthorizedError>(errors: unknown): errors is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedErrors<ErrorResponseApi<{ name: string; message: string }>>(errors) &&
    errors.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

export const rateSale = ({ original, sale }: { original: number; sale: number }): string => {
  const priceSale = Math.round(original - sale)
  return Math.round((priceSale / original) * 100) + '%'
}
