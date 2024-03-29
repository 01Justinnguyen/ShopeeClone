import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from '@/hooks/useQueryConfig'
import path from '@/constants/path'
import './style.css'

interface PaginationProps {
  queryConfig: QueryConfig
  pageSize: number
}
export default function Pagination({ queryConfig, pageSize }: PaginationProps) {
  const navigate = useNavigate()
  const { page } = queryConfig
  const [_, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState<number>(0)

  useEffect(() => {
    if (!pageSize) return
    setPageCount(pageSize)
  }, [pageSize])

  // const handlePageClick = useEffect((event: any) => {
  //   console.log('page handle', page)
  //   const newOffset = (event.selected * Number(queryConfig.limit)) % 20
  //   setItemOffset(newOffset)
  //   navigate({
  //     pathname: path.home,
  //     search: createSearchParams({
  //       ...queryConfig,
  //       page: String(event.selected + 1)
  //     }).toString()
  //   })
  // },
  // [page])

  // const handlePageChange = useCallback(
  //   (event: any) => {
  //     console.log('page handle', page)
  //     const newOffset = (event.selected * Number(queryConfig.limit)) % 20
  //     setItemOffset(newOffset)
  //     navigate({
  //       pathname: path.home,
  //       search: createSearchParams({
  //         ...queryConfig,
  //         page: String(event.selected + 1)
  //       }).toString()
  //     })
  //   },
  //   [page]
  // )

  // const handlePageClick = useCallback(
  //   (event: any) => {
  //     const newOffset = (event.selected * Number(queryConfig.limit)) % 20
  //     setItemOffset(newOffset)
  //     navigate({
  //       pathname: path.home,
  //       search: createSearchParams({
  //         ...queryConfig,
  //         page: String(event.selected + 1)
  //       }).toString()
  //     })
  //   },
  //   [page, queryConfig, navigate]
  // )

  const handlePageClick = useCallback(
    (event: any) => {
      console.log('🐻 ~ Pagination ~ event:', event)
      const newOffset = (event.selected * Number(queryConfig.limit)) % 20
      setItemOffset(newOffset)
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          page: String(event.selected + 1)
        }).toString()
      })
    },
    [queryConfig, navigate]
  )

  return (
    <div className='mt-4'>
      <ReactPaginate
        className='pagination'
        breakLabel='...'
        nextLabel={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5' />
          </svg>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5' />
          </svg>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  )
}
