import React from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Button, Flex, Heading, OverlayPanel, Text} from 'gestalt'
import {useAppSelector} from '../../../../hooks/useAppSelector'
import {
  selectCartAddress,
  selectCartProducts,
} from '../../../../slices/cart.slice'

interface ICartFooterProps {
  total: number
  handleCheckout: () => void
  isLoading: boolean
  isError: boolean
  error: any
}

const CartFooter: React.FC<ICartFooterProps> = (props) => {
  const [t] = useTranslation(['common'])
  const {total, handleCheckout, isError, isLoading} = props
  const cartItems = useAppSelector(selectCartProducts)
  const selectedAddress = useAppSelector(selectCartAddress)

  return (
    /* @ts-ignore */
    <OverlayPanel.DismissingElement>
      {
        /* @ts-ignore */
        ({onDismissStart}) => (
          <Flex alignItems="center" justifyContent="end">
            <Box paddingX={1}>
              {/* @ts-ignore */}
              <Heading size={300}>Total</Heading>
            </Box>
            <Box paddingX={1} flex="grow">
              <Text>₹ {total.toFixed(2)}</Text>
            </Box>
            <Button
              color="red"
              text={
                isLoading
                  ? t('common:cart-overlay.placing-order')
                  : t('common:checkout')
              }
              disabled={isLoading || !selectedAddress || !cartItems.length}
              onClick={() => {
                handleCheckout()
                if (!isError) {
                  onDismissStart()
                }
              }}
            />
          </Flex>
        )
      }
      {/* @ts-ignore */}
    </OverlayPanel.DismissingElement>
  )
}

export default CartFooter
