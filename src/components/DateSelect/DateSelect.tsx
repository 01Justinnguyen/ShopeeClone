import { range } from 'lodash'
import { useState } from 'react'

interface DateSelectProps {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: DateSelectProps) {
  const [date, setDate] = useState({
    day: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target

    const newDate = {
      ...date,
      [name]: value
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.day))
  }

  return (
    <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
      <div className='w-[20%] truncate pt-3 sm:text-right capitalize'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between '>
          <select
            onChange={handleChange}
            name='day'
            value={value?.getDate() || date.day}
            className='hover:border-orange h-10 w-[32%] rounded-sm border border-black/10 px-3'
          >
            <option value='' selected disabled hidden>
              Ngày
            </option>
            {range(1, 32).map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              )
            })}
          </select>
          <select
            onChange={handleChange}
            name='month'
            value={value?.getMonth() || date.month}
            className='hover:border-orange h-10 w-[32%] rounded-sm border border-black/10 px-3'
          >
            <option value='' selected disabled hidden>
              Tháng
            </option>
            {range(0, 12).map((item) => {
              return (
                <option value={item} key={item}>
                  {item + 1}
                </option>
              )
            })}
          </select>
          <select
            onChange={handleChange}
            name='year'
            value={value?.getFullYear() || date.year}
            className='hover:border-orange h-10 w-[32%] rounded-sm border border-black/10 px-3'
          >
            <option value='' selected disabled hidden>
              Năm
            </option>
            {range(1990, 2025).map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              )
            })}
          </select>
        </div>
        <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
      </div>
    </div>
  )
}
