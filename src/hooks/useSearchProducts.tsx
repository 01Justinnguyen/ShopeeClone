import path from '@/constants/path'
import useQueryConfig from '@/hooks/useQueryConfig'
import { Schema, schema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

function useSearchProducts() {
  const navigate = useNavigate()

  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const queryConfig = useQueryConfig()
  const onSubmitSearch = handleSubmit((value) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: value.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: value.name
        }

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })

  return { onSubmitSearch, register }
}

export default useSearchProducts
