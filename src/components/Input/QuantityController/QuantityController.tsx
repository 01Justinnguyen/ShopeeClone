import InputNumber, { InputNumberProps } from '../InputNumber'
import MinusIcon from '@/assets/minus-icon.svg?react'
import PlusIcon from '@/assets/plus-icon.svg?react'
interface QuantityControllerProps extends InputNumberProps {
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onTyping?: (value: number) => void
  max?: number
  wrapClassName?: string
}

function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onTyping,
  value,
  wrapClassName = 'ml-10'
}: QuantityControllerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onTyping && onTyping(_value)
  }

  const increase = () => {
    let _value = Number(value) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
  }

  const decrease = () => {
    let _value = Number(value) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
  }

  return (
    <div className={`flex items-center ${wrapClassName}`}>
      <button
        onClick={decrease}
        className='flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-l-sm'
      >
        <MinusIcon className='w-4 h-4' />
      </button>
      <InputNumber
        className=''
        classNameErrors='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        value={value}
      />
      <button
        onClick={increase}
        className='flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-r-sm'
      >
        <PlusIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

export default QuantityController
