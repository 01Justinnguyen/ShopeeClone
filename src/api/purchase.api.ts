import { Purchase, PurchaseListStatus } from '@/types/puchase.type'
import { SuccessResponseApi } from '@/types/utils.types'
import http from '@/utils/http'

const URL = 'purchases'

const purchaseAPi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body)
  },

  getPurchasesList(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, {
      params
    })
  }
}

export default purchaseAPi
