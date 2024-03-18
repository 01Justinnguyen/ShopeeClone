import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  className?: string
  classNameInput?: string
  classNameErrors?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberRef(
  {
    errorMessage,
    name,
    classNameInput = 'w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm',
    classNameErrors = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    className = '',
    onChange,
    value = '',
    ...rest
  }: InputNumberProps,
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
      // Cập nhật localValueState
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} value={value || localValue} />
      <div className={classNameErrors}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
