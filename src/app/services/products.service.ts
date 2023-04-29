import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {Product} from '../types/product.types.ts'

type ProductList = Product[]

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Products'],
  endpoints: (build) => ({
    getProducts: build.query<ProductList, void>({
      query: () => '/retrieve-all-products',
      // Provides a list of `products` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Products` element was added.
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({id}) => ({type: 'Products', id} as const)),
              {type: 'Products', id: 'LIST'},
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Products', id: 'LIST' }` is invalidated
            [{type: 'Products', id: 'LIST'}],
    }),
  }),
})

export const {useGetProductsQuery} = productApi
