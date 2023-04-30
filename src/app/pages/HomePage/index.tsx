import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Spinner} from 'gestalt'
import {useAppSelector} from '../../hooks/useAppSelector'
import {selectCartProducts} from '../../slices/cart.slice'
import {useGetProductsQuery} from '../../services/products.service.ts'
import SEO from '../../components/SEO'
import ProductCard from '../../components/ProductCard'

const ErrorToast = lazy(() => import('../../components/ErrorToast'))

const HomePage: React.FC = () => {
  const [t] = useTranslation(['common'])
  const cartItems = useAppSelector(selectCartProducts)
  const {data, isError, isLoading} = useGetProductsQuery()

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  if (isLoading) {
    return (
      <Box paddingY={4}>
        <Spinner accessibilityLabel={t('common:loading')} show={isLoading} />
      </Box>
    )
  }

  if (isError) {
    return (
      <Suspense
        fallback={
          <Box paddingY={6}>
            <Spinner accessibilityLabel={t('common:loading')} show />
          </Box>
        }
      >
        <ErrorToast message={t('common:errors.something-went-wrong')} />
      </Suspense>
    )
  }

  return (
    <>
      <SEO
        title={t('common:home')}
        url={t('common:url')}
        description={t('common:description')}
      />

      <Box paddingY={2}>
        {!isError &&
          data?.products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              getCartQuantity={getCartQuantity}
            />
          ))}
      </Box>
    </>
  )
}

export default HomePage
