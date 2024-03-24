import InputNumber, { InputNumberProps } from '../InputNumber'
import MinusIcon from '@/assets/minus-icon.svg?react'
import PlusIcon from '@/assets/plus-icon.svg?react'
import { useState } from 'react'
interface QuantityControllerProps extends InputNumberProps {
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onTyping?: (value: number) => void
  onFocusOut?: (value: number) => void
  max?: number
  wrapClassName?: string
}

function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onTyping,
  onFocusOut,
  value,
  wrapClassName = 'ml-10',
  disabled,
  ...rest
}: QuantityControllerProps) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onTyping && onTyping(_value)
    setLocalValue(_value)
  }

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
      return
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
      return
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className={`flex items-center ${wrapClassName}`}>
      <button
        onClick={decrease}
        disabled={disabled}
        className={`${disabled ? 'bg-gray-100' : ''} flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-l-sm`}
      >
        <MinusIcon className='w-4 h-4' />
      </button>
      <InputNumber
        className=''
        classNameErrors='hidden'
        classNameInput={`${disabled ? 'bg-gray-100' : ''} h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none`}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value || localValue}
        {...rest}
      />
      <button
        onClick={increase}
        disabled={disabled}
        className={`${disabled ? 'bg-gray-100' : ''} flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-r-sm`}
      >
        <PlusIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

export default QuantityController
