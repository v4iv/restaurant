import React from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Button, Flex, Heading, OverlayPanel, Text} from 'gestalt'
import {useAppSelector} from '../../../../hooks/useAppSelector.ts'
import {selectCart} from '../../../../slices/cart.slice.ts'

interface ICartFooterProps {
  total: number
}

const CartFooter: React.FC<ICartFooterProps> = (props) => {
  const [t] = useTranslation(['common'])
  const {total} = props
  const cart = useAppSelector(selectCart)

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
              text={t('common:checkout')}
              onClick={() => alert(`Cart: ${JSON.stringify(cart)}`)}
            />
          </Flex>
        )
      }
      {/* @ts-ignore */}
    </OverlayPanel.DismissingElement>
  )
}

export default CartFooter
