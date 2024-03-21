import { AddToCartType, Purchase, PurchaseListStatus } from '@/types/puchase.type'
import { SuccessResponseApi } from '@/types/utils.types'
import http from '@/utils/http'

const URL = 'purchases'

const purchaseAPi = {
  addToCart(body: AddToCartType) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body)
  },

  getPurchasesList(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, {
      params
    })
  },

  buyProducts(body: AddToCartType[]) {
    return http.post<SuccessResponseApi<Purchase[]>>(`${URL}/buy-products`, body)
  },

  updatePurchase(body: AddToCartType) {
    return http.put<SuccessResponseApi<Purchase>>(`${URL}/update-purchase`, body)
  },

  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  }
}

export default purchaseAPi
