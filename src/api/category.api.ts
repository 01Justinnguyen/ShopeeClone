import { Category } from '@/types/category.type'
import { SuccessResponseApi } from '@/types/utils.types'
import http from '@/utils/http'

const URL = 'categories'

const CategoryApi = {
  getCategories: () => http.get<SuccessResponseApi<Category[]>>(URL)
}

export default CategoryApi
