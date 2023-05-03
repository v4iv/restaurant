import React, {lazy, Suspense} from 'react'
import {Box, Spinner} from 'gestalt'
import {useTranslation} from 'react-i18next'
import {useGetOrdersQuery} from '../../services/order.service'
import OrderCard from '../../components/OrderCard'

const ErrorToast = lazy(() => import('../../components/ErrorToast'))

const OrdersPage: React.FC = () => {
  const [t] = useTranslation(['common'])
  const {data, isError, isLoading} = useGetOrdersQuery()

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
      <Box paddingY={2}>
        {!isError &&
          data?.map((order: any) => <OrderCard key={order.id} order={order} />)}
      </Box>
    </>
  )
}

export default OrdersPage
