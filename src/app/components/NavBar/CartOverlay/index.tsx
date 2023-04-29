import React from 'react'
import {Box, CompositeZIndex, FixedZIndex, Layer, OverlayPanel} from 'gestalt'
import {useTranslation} from 'react-i18next'
import {useAppSelector} from '../../../hooks/useAppSelector'
import {selectCartItems} from '../../../slices/cart.slice'
import CartItem from './CartItem'
import CartFooter from './CartFooter'

interface CartOverlayProps {
  toggleShowCart: () => void
}

const CartOverlay: React.FC<CartOverlayProps> = (props) => {
  const [t] = useTranslation(['common'])
  const {toggleShowCart} = props
  const cartItems = useAppSelector(selectCartItems)
  const HEADER_ZINDEX = new FixedZIndex(10)
  const sheetZIndex = new CompositeZIndex([HEADER_ZINDEX])

  // const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  // const [billingAddress, setBillingAddress] = useState<Address | null>(null)

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const total =
    cartItems.length > 0
      ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0

  return (
    <Layer zIndex={sheetZIndex}>
      <OverlayPanel
        accessibilityDismissButtonLabel="Close audience creation overlay panel"
        accessibilityLabel="Audience list creation for new campaign"
        heading={t('common:cart') || ''}
        onDismiss={toggleShowCart}
        footer={<CartFooter total={total} />}
        size="sm"
      >
        <Box padding={2}>
          <Box height={180}>
            {cartItems.map((cartItem) => {
              return (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  getCartQuantity={getCartQuantity}
                />
              )
            })}
          </Box>
        </Box>
      </OverlayPanel>
    </Layer>
  )
}

export default CartOverlay
