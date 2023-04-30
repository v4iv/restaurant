import React from 'react'
import {useTranslation} from 'react-i18next'
import {
  Box,
  CompositeZIndex,
  FixedZIndex,
  Layer,
  OverlayPanel,
  SelectList,
  Text,
  TextArea,
} from 'gestalt'
import {useAppDispatch} from '../../../hooks/useAppDispatch'
import {useAppSelector} from '../../../hooks/useAppSelector'
import {useGetAddressesQuery} from '../../../services/address.service'
import {
  selectCartAddress,
  selectCartProducts,
  selectSpecialInstruction,
  setAddress,
  setSpecialInstructions,
} from '../../../slices/cart.slice'
import CartItem from './CartItem'
import CartFooter from './CartFooter'

interface CartOverlayProps {
  toggleShowCart: () => void
}

const CartOverlay: React.FC<CartOverlayProps> = (props) => {
  const [t] = useTranslation(['common'])
  const dispatch = useAppDispatch()
  const {toggleShowCart} = props
  const cartItems = useAppSelector(selectCartProducts)
  const HEADER_ZINDEX = new FixedZIndex(10)
  const sheetZIndex = new CompositeZIndex([HEADER_ZINDEX])

  const specialInstructions = useAppSelector(selectSpecialInstruction)

  const {data, isLoading, isError} = useGetAddressesQuery()

  const addressOptions =
    !isLoading &&
    !isError &&
    data &&
    data.addresses.map((address) => ({
      label: `${address.name}, ${address.addressLineOne}, ${address.area}`,
      value: address.id,
    }))

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
          <Box height={180} overflow="scroll">
            {cartItems.length ? (
              cartItems.map((cartItem) => {
                return (
                  <CartItem
                    key={cartItem.id}
                    cartItem={cartItem}
                    getCartQuantity={getCartQuantity}
                  />
                )
              })
            ) : (
              <Text>There's nothing in the cart!</Text>
            )}
          </Box>

          <Box paddingY={2}>
            <SelectList
              id="address"
              name="Address"
              placeholder={isLoading ? 'Loading...' : 'Select Address'}
              label="Address"
              onChange={({value}) => dispatch(setAddress(value))}
              value={useAppSelector(selectCartAddress)}
              disabled={isLoading || isError}
            >
              {addressOptions &&
                addressOptions.map(({label, value}) => (
                  <SelectList.Option key={value} label={label} value={value} />
                ))}
            </SelectList>
          </Box>

          <Box paddingY={2}>
            <TextArea
              id="special_instructions"
              onChange={({value}) => dispatch(setSpecialInstructions(value))}
              placeholder="any special instructions for preparation..."
              helperText="We'll TRY to follow the instructions, but might not be able to depending on circumstances"
              label="Special Instructions"
              value={specialInstructions}
            />
          </Box>
        </Box>
      </OverlayPanel>
    </Layer>
  )
}

export default CartOverlay
