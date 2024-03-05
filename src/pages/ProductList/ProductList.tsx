import ProductApi from '@/api/product.api'
import useQueryParams from '@/hooks/useQueryParams'
import { ProductListConfig } from '@/types/product.type'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import React from 'react'
import AsideFilter from './AsideFilter'
import Product from './Product'
import SortProductList from './SortProductList'
import Pagination from '@/components/Pagination/Pagination'
import CategoryApi from '@/api/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '6',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      category: queryParams.category,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter
    },
    isUndefined
  )

  const { data: ProductData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => ProductApi.getProducts(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData
  })

  const { data: CategoriesData } = useQuery({
    queryKey: ['category'],
    queryFn: () => CategoryApi.getCategories(),
    placeholderData: keepPreviousData
  })

  return (
    <div className='py-6 bg-gray-200'>
      <div className='container'>
        {ProductData && (
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
        )}
      </div>
    </div>
  )
}
