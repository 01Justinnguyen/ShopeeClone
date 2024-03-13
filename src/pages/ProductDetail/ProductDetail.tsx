import ProductApi from '@/api/product.api'
import InputNumber from '@/components/Input/InputNumber'
import ProductRating from '@/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useParams } from 'react-router-dom'
import ChevronLeft from '@/assets/chevron-left.svg?react'
import ChevronRight from '@/assets/chevron-right.svg?react'
import CartIcon from '@/assets/cart-icon.svg?react'
import MinusIcon from '@/assets/minus-icon.svg?react'
import PlusIcon from '@/assets/plus-icon.svg?react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Product as ProductType, ProductListConfig } from '@/types/product.type'
import Product from '../ProductList/components/Product'

export default function ProductDetail() {
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductApi.getProductDetail(id as string)
  })

  const [currentIndexImages, setCurrentIndexImages] = useState<number[]>([0, 5])
  const [activeImage, setActiveImage] = useState<string>('')
  const product = productDetailData?.data.data

  const imageRef = useRef<HTMLImageElement>(null)

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  const queryConfig: ProductListConfig = { limit: '6', page: '1', category: product?.category._id }

  const { data: ProductData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => ProductApi.getProducts(queryConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })
  console.log('🐻 ~ ProductDetail ~ ProductData:', ProductData)

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = e.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event không cần pointer-events: none;
    const offsetX = e.pageX - (rect.x + window.scrollX)
    const offsetY = e.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  if (!product) return null
  return (
    <div className='py-6 bg-gray-200'>
      <div className='container'>
        <div className='p-4 bg-white rounded-lg shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden hover:cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 object-cover w-full h-full bg-white '
                  ref={imageRef}
                />
              </div>
              <div className='relative grid grid-cols-5 gap-1 mt-4'>
                <button
                  onClick={prev}
                  className='absolute left-0 z-10 w-5 text-white -translate-y-1/2 top-1/2 h-9 bg-black/20'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 object-cover w-full h-full bg-white cursor-pointer'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  onClick={next}
                  className='absolute right-0 z-10 w-5 text-white -translate-y-1/2 top-1/2 h-9 bg-black/20'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='flex items-center mt-8'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassNames='fill-orange text-orange h-4 w-4'
                    nonActiveClassNames='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='flex items-center px-5 py-4 mt-8 bg-gray-50'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale({
                    original: product.price_before_discount,
                    sale: product.price
                  })}{' '}
                  giảm
                </div>
              </div>
              <div className='flex items-center mt-8'>
                <div className='text-gray-500 capitalize'>Số lượng</div>
                <div className='flex items-center ml-10'>
                  <button className='flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-l-sm'>
                    <MinusIcon className='w-4 h-4' />
                  </button>
                  <InputNumber
                    value={1}
                    className=''
                    classNameErrors='hidden'
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  />
                  <button className='flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-r-sm'>
                    <PlusIcon className='w-4 h-4' />
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='flex items-center mt-8'>
                <button className='flex items-center justify-center h-12 px-5 capitalize border rounded-sm shadow-sm border-orange bg-orange/10 text-orange hover:bg-orange/5'>
                  <CartIcon className='mr-[10px] h-5 w-5  stroke-orange text-orange' />
                  Thêm vào giỏ hàng
                </button>
                <button className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='p-4 mt-8 bg-white rounded-lg shadow'>
            <div className='p-4 text-lg capitalize rounded bg-gray-50 text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='container'>
          <div className='text-gray-400 uppercase'>CÓ THỂ BẠN CŨNG THÍCH</div>
          <div className='grid grid-cols-2 gap-3 mt-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {React.Children.toArray(
              ProductData &&
                ProductData.data.data.products.map((product) => (
                  <div className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
