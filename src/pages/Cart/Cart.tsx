import purchaseAPi from '@/api/purchase.api'
import Button from '@/components/Button'
import QuantityController from '@/components/Input/QuantityController'
import path from '@/constants/path'
import { purchasesStatus } from '@/constants/purchase'
import { Purchase } from '@/types/puchase.type'
import { formatCurrency, generateNameId } from '@/utils/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { useAppContext } from '@/contexts/app.context'

function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useAppContext()
  const navigate = useNavigate()

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
  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseAPi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message)
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseAPi.deletePurchase,
    onSuccess: () => {
      toast.success('Xoá sản phẩm thành công')
      refetch()
    }
  })

  const location = useLocation()
  console.log('🐻 ~ Cart ~ location:', location)

  // const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId

  const [choosenPurchaseIdFromLocation, setChoosenPurchaseIdFromLocation] = useState<string | undefined>(
    (location.state as { purchaseId: string } | null)?.purchaseId
  )

  const purchasesIncart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(
    () => extendedPurchases.every((product) => product.checked === true),
    [extendedPurchases]
  )
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasesPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price_before_discount * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchasesSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesIncart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesIncart, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

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

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]?._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchase = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    if (purchaseIds.length < 1) {
      toast.error('Bạn cần chọn sản phẩm')
      return
    }
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyPurchaseMutation.mutate(body)
    } else {
      toast.error('Bạn cần chọn sản phẩm')
      return
    }
  }

  return (
    <div className='py-16 bg-neutral-100 '>
      {extendedPurchases.length > 0 ? (
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
                    className='grid items-center grid-cols-12 px-4 py-5 mt-5 text-sm text-gray-500 bg-white border border-gray-200 rounded-sm first:mt-0'
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
                            <div className='px-2 pt-1 pb-2 text-center'>
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
                        <div className='col-span-1 text-center'>
                          <span className=' text-orange'>
                            ₫{formatCurrency(purchase.product.price_before_discount * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1 text-center'>
                          <button
                            onClick={handleDelete(idx)}
                            disabled={deletePurchaseMutation.isPending}
                            className='text-black transition-colors bg-none hover:text-orange'
                          >
                            Xoá
                          </button>
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
              <button
                disabled={deletePurchaseMutation.isPending}
                onClick={handleDeleteManyPurchase}
                className='mx-3 border-none bg-none'
              >
                Xóa
              </button>
            </div>

            <div className='flex flex-col mt-5 sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
              <div>
                <div className='flex items-center sm:justify-end'>
                  <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                  <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasesPrice)}</div>
                </div>
                <div className='flex items-center text-sm sm:justify-end'>
                  <div className='text-gray-500'>Tiết kiệm</div>
                  <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedPurchasesSavingPrice)}</div>
                </div>
              </div>
              <Button
                onClick={handleBuyPurchase}
                disabled={buyPurchaseMutation.isPending}
                className='flex items-center justify-center h-10 mt-5 text-sm text-white uppercase bg-red-500 w-52 hover:bg-red-600 sm:ml-4 sm:mt-0'
              >
                Mua hàng
              </Button>
            </div>
          </div>
          {/* end footer */}
        </div>
      ) : (
        <div className='container'>
          <div className='flex flex-col items-center justify-center'>
            <div className='bg-no-repeat bg-cover bg-emptyCart w-[150px] h-[150px]'></div>
            <span className='block my-5 font-semibold text-grayRgba'>Giỏ hàng của bạn còn trống</span>
            <Button
              onClick={() => navigate('/')}
              className='flex items-center justify-center h-10 mt-5 text-sm text-white uppercase bg-red-500 w-52 hover:bg-red-600 sm:mt-0'
            >
              Mua hàng
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
