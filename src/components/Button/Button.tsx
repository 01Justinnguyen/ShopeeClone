/* eslint-disable import/no-unresolved */
import { type ButtonHTMLAttributes } from 'react'
import Loading from '@/assets/loading-button.svg?react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoaing?: boolean
}

export default function Button(props: ButtonProps) {
  const { isLoaing, className, disabled, children, ...rest } = props
  const newClassName = disabled ? className + ' cursor-not-allowed' : className
  return (
    <>
      <button className={newClassName} disabled={disabled} {...rest}>
        {isLoaing && <Loading className='inline w-4 h-4 text-gray-200 me-3 animate-spin' />}
        <span>{children}</span>
      </button>
    </>
  )
}
