import purchaseAPi from '@/api/purchase.api'
import Button from '@/components/Button'
import QuantityController from '@/components/Input/QuantityController'
import path from '@/constants/path'
import { purchasesStatus } from '@/constants/purchase'
import { Purchase } from '@/types/puchase.type'
import { formatCurrency, generateNameId } from '@/utils/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { produce } from 'immer'
import { keyBy } from 'lodash'

interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}

function Cart() {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseAPi.getPurchasesList({ status: purchasesStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseAPi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const purchasesIncart = purchasesInCartData?.data.data
  const isAllChecked = extendedPurchases.every((product) => product.checked === true)
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesIncart?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchasesObject[purchase._id]?.checked)
        })) || []
      )
    })
  }, [purchasesIncart])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )

      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
    }
  }

  return (
    <div className='py-16 bg-neutral-100 '>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 py-5 text-sm text-gray-500 capitalize bg-white shadow px-9'>
              <div className='col-span-6 '>
                <div className='flex items-center'>
                  <div className='flex items-center justify-center flex-shrink-0 pr-3'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 accent-orange'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>

              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>

            {/* body */}
            <div className='p-5 my-3 bg-white rounded-sm shadow'>
              {extendedPurchases?.map((purchase, idx) => (
                <div
                  className='grid grid-cols-12 px-4 py-5 mt-5 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-sm first:mt-0 '
                  key={purchase._id}
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex items-center justify-center flex-shrink-0 pr-3'>
                        <input
                          type='checkbox'
                          className='w-5 h-5 accent-orange'
                          checked={purchase.checked}
                          onChange={handleChecked(idx)}
                        />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            className='flex-shrink-0 w-20 h-20'
                            to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                          >
                            <img src={purchase.product.image} alt={purchase.product.name} />
                          </Link>
                          <div className='flex-grow px-2 pt-1 pb-2'>
                            <Link
                              className='line-clamp-2 text-start'
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-span-6'>
                    <div className='grid items-center grid-cols-5'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            ₫{formatCurrency(purchase.product.price_before_discount)}
                          </span>
                          <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          wrapClassName='flex items-center'
                          onIncrease={(value) => handleQuantity(idx, value, value <= purchase.product.quantity)}
                          onDecrease={(value) => handleQuantity(idx, value, value >= 1)}
                          onTyping={handleTypeQuantity(idx)}
                          onFocusOut={(value) =>
                            handleQuantity(
                              idx,
                              value,
                              value >= 1 &&
                                value <= purchase.product.quantity &&
                                value !== (purchasesIncart as Purchase[])[idx].buy_count
                            )
                          }
                          disabled={purchase.disabled}
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange'>
                          ₫{formatCurrency(purchase.product.price_before_discount * purchase.buy_count)}
                        </span>
                      </div>
                      <div className='col-span-1'>
                        <button className='text-black transition-colors bg-none hover:text-orange'>Xoá</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* end body */}
          </div>
        </div>
        {/* footer */}
        <div className='sticky bottom-0 z-10 flex flex-col p-5 mt-8 bg-white border border-gray-100 rounded-sm shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex items-center justify-center flex-shrink-0 pr-3'>
              <input
                type='checkbox'
                className='w-5 h-5 accent-orange'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
            </div>
            <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
              Chọn tất cả ({extendedPurchases.length})
            </button>
            <button className='mx-3 border-none bg-none'>Xóa</button>
          </div>

          <div className='flex flex-col mt-5 sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng thanh toán (0 sản phẩm):</div>
                <div className='ml-2 text-2xl text-orange'>₫138000</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>₫138000</div>
              </div>
            </div>
            <Button className='flex items-center justify-center h-10 mt-5 text-sm text-white uppercase bg-red-500 w-52 hover:bg-red-600 sm:ml-4 sm:mt-0'>
              Mua hàng
            </Button>
          </div>
        </div>
        {/* end footer */}
      </div>
    </div>
  )
}

export default Cart
