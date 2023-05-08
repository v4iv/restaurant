import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Spinner} from 'gestalt'

const OrderReceived = lazy(() => import('./OrderReceived'))
const OrderDispatched = lazy(() => import('./OrderDispatched'))
const Delivered = lazy(() => import('./Delivered'))
const Cancelled = lazy(() => import('./Cancelled'))

interface IStatusGraphic {
  status: string | undefined
}
const StatusGraphic: React.FC<IStatusGraphic> = (props) => {
  const {status} = props
  const {t} = useTranslation(['common'])

  switch (status) {
    case 'ORDER_RECEIVED':
      return (
        <Suspense
          fallback={
            <Box
              position="fixed"
              display="flex"
              alignItems="center"
              justifyContent="center"
              top
              left
              right
              bottom
            >
              <Spinner accessibilityLabel={t('common:loading')} show />
            </Box>
          }
        >
          <OrderReceived />
        </Suspense>
      )
    case 'ORDER_DISPATCHED':
      return (
        <Suspense
          fallback={
            <Box
              position="fixed"
              display="flex"
              alignItems="center"
              justifyContent="center"
              top
              left
              right
              bottom
            >
              <Spinner accessibilityLabel={t('common:loading')} show />
            </Box>
          }
        >
          <OrderDispatched />
        </Suspense>
      )
    case 'DELIVERED':
      return (
        <Suspense
          fallback={
            <Box
              position="fixed"
              display="flex"
              alignItems="center"
              justifyContent="center"
              top
              left
              right
              bottom
            >
              <Spinner accessibilityLabel={t('common:loading')} show />
            </Box>
          }
        >
          <Delivered />
        </Suspense>
      )
    case 'CANCELLED':
      return (
        <Suspense
          fallback={
            <Box
              position="fixed"
              display="flex"
              alignItems="center"
              justifyContent="center"
              top
              left
              right
              bottom
            >
              <Spinner accessibilityLabel={t('common:loading')} show />
            </Box>
          }
        >
          <Cancelled />
        </Suspense>
      )
    default:
      return (
        <Suspense
          fallback={
            <Box
              position="fixed"
              display="flex"
              alignItems="center"
              justifyContent="center"
              top
              left
              right
              bottom
            >
              <Spinner accessibilityLabel={t('common:loading')} show />
            </Box>
          }
        >
          <Cancelled />
        </Suspense>
      )
  }
}

export default StatusGraphic
