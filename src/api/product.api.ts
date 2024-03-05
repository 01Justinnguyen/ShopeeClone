import { Product, ProductList, ProductListConfig } from '@/types/product.type'
import { SuccessResponseApi } from '@/types/utils.types'
import http from '@/utils/http'

const URL = '/products'
const ProductApi = {
  getProducts: (params: ProductListConfig) =>
    http.get<SuccessResponseApi<ProductList>>(URL, {
      params
    }),

  getProductDetail: (id: string) => http.get<SuccessResponseApi<Product>>(`${URL}/${id}`)
}

export default ProductApi
