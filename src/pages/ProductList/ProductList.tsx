import ProductApi from '@/api/product.api'
import { ProductListConfig } from '@/types/product.type'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product'
import SortProductList from './components/SortProductList'
import Pagination from '@/components/Pagination/Pagination'
import CategoryApi from '@/api/category.api'
import useQueryConfig from '@/hooks/useQueryConfig'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: ProductData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => ProductApi.getProducts(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData
  })

  const { data: CategoriesData } = useQuery({
    queryKey: ['category'],
    queryFn: () => CategoryApi.getCategories(),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  return (
    <div className='py-6 bg-gray-200'>
      <div className='container'>
        {ProductData ? (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter
                categoriesData={CategoriesData?.data.data || []}
                queryConfig={queryConfig}
                pageSize={ProductData && (ProductData.data.data.pagination.page_size as number)}
              />
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={ProductData && (ProductData.data.data.pagination.page_size as number)}
              />
              <div className='grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {React.Children.toArray(
                  ProductData.data.data.products.map((product) => (
                    <div className='col-span-1'>
                      <Product product={product} />
                    </div>
                  ))
                )}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={ProductData && (ProductData.data.data.pagination.page_size as number)}
              />
            </div>
          </div>
        ) : (
          <div className='text-xl text-slate-400'>Không tìm thấy sản phẩm nào</div>
        )}
      </div>
    </div>
  )
}
