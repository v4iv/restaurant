import React from 'react'
import {useTranslation} from 'react-i18next'
import {Box, IconButton, Text} from 'gestalt'
import {useAppDispatch} from '../../../../hooks/useAppDispatch'
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../../../slices/cart.slice'
import {CartItem} from '../../../../types/cart.types'

interface ICartItemProps {
  cartItem: CartItem
  getCartQuantity: (productId: string) => number
}

const CartItem: React.FC<ICartItemProps> = (props) => {
  const [t] = useTranslation(['common'])
  const dispatch = useAppDispatch()
  const {cartItem, getCartQuantity} = props
  const {id, name, quantity, price} = cartItem
  return (
    <Box
      color="elevationRaised"
      alignItems="center"
      direction="row"
      display="flex"
      borderStyle="raisedTopShadow"
      rounding={1}
      padding={4}
      marginBottom={2}
    >
      <Box paddingX={1} flex="grow" wrap>
        <Text>{name}</Text>
      </Box>
      <Box paddingX={1}>
        <Box
          color="default"
          borderStyle="sm"
          maxHeight={32}
          rounding="pill"
          display="flex"
          direction="row"
          justifyContent="around"
          alignItems="center"
          opacity={0.8}
        >
          <Box>
            {getCartQuantity(id) > 1 ? (
              <IconButton
                accessibilityLabel={t('common:decrease-quantity')}
                icon="dash"
                size="sm"
                onClick={() => dispatch(decreaseQuantity(id))}
              />
            ) : (
              <IconButton
                accessibilityLabel={t('common:remove-from-cart')}
                icon="trash-can"
                size="sm"
                onClick={() => dispatch(removeFromCart(id))}
              />
            )}
          </Box>
          <Box flex="grow" padding={1}>
            <Text align="center">{getCartQuantity(id)}</Text>
          </Box>
          <Box>
            <IconButton
              accessibilityLabel={t('common:increase-quantity')}
              icon="add"
              size="sm"
              onClick={() => dispatch(increaseQuantity(id))}
            />
          </Box>
        </Box>
      </Box>
      <Box paddingX={1} wrap>
        <Text>₹ {price * quantity}</Text>
      </Box>
    </Box>
  )
}

export default CartItem
