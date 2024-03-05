import { type InputHTMLAttributes } from 'react'
import type { UseFormRegister } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  className?: string
  name: string
  register?: UseFormRegister<any>
  classNameInput?: string
}

export default function Input({
  errorMessage,
  register,
  name,
  classNameInput = 'w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm',
  className = '',
  ...rest
}: InputProps) {
  const registerResult = register && name ? register(name) : {}
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
