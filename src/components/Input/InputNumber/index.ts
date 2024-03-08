import InputNumber from './InputNumber'

export default InputNumber

type Todo = {
  name: string
  number: number
}

// Partial<Type>: chuyển từ bắt buộc thành ko bắt buộc
type Todo2 = Partial<Todo>

//Required<Type>: chuyển từ không bắt buộc thành bắt buộc
type Todo3 = Required<Todo2>

// Readonly<Type>: chỉ được đọc không được sửa đổi
type Todo4 = Readonly<Todo3>

// Record<Keys, Type>: tạo một object
// type CatName = "miffy" | "boris" | "mordred"; // => union
type Todo5 = Record<string, { name: string; age: number }[]>

const newCat: Todo5 = {
  hieu: [
    {
      age: 18,
      name: 'ádasdsa'
    }
  ]
}

// Omit<Type, Keys>: loại bỏ một hoặc nhiều key
// Pick<Type, Keys>: lấy một hoặc nhiều key
