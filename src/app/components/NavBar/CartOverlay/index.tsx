import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'wouter'
import {
  Box,
  Button,
  CompositeZIndex,
  FixedZIndex,
  Layer,
  OverlayPanel,
  SelectList,
  Spinner,
  Text,
  TextArea,
} from 'gestalt'
import {useAppDispatch} from '../../../hooks/useAppDispatch'
import {useAppSelector} from '../../../hooks/useAppSelector'
import {useGetAddressesQuery} from '../../../services/address.service'
import {useCreateOrderMutation} from '../../../services/order.service'
import {
  clearCart,
  selectCart,
  selectCartAddress,
  selectCartProducts,
  selectSpecialInstruction,
  setAddress,
  setSpecialInstructions,
} from '../../../slices/cart.slice'
import CartItem from './CartItem'
import CartFooter from './CartFooter'

const ErrorToast = lazy(() => import('../../ErrorToast'))

interface CartOverlayProps {
  toggleShowCart: () => void
}

const CartOverlay: React.FC<CartOverlayProps> = (props) => {
  const {toggleShowCart} = props
  const [t] = useTranslation(['common'])
  const dispatch = useAppDispatch()
  const [, setLocation] = useLocation()
  const orderData = useAppSelector(selectCart)
  const cartItems = useAppSelector(selectCartProducts)
  const HEADER_ZINDEX = new FixedZIndex(10)
  const sheetZIndex = new CompositeZIndex([HEADER_ZINDEX])

  const specialInstructions = useAppSelector(selectSpecialInstruction)

  const {data, isLoading, isError} = useGetAddressesQuery()
  const [
    createOrderMutation,
    {isLoading: isCreatingOrder, isError: isOrderError, error: orderError},
  ] = useCreateOrderMutation()

  const addressOptions =
    !isLoading &&
    !isError &&
    data?.map((address) => ({
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

  const handleCheckout = async () => {
    try {
      const result = await createOrderMutation(orderData).unwrap()

      setLocation(`/order/${result.id}`)

      // Clear the cart and show a success message
      dispatch(clearCart())
    } catch (error) {
      console.error('Failed to create order')
    }
  }

  return (
    <>
      {isOrderError && (
        <Suspense
          fallback={
            <Box paddingY={6}>
              <Spinner accessibilityLabel={t('common:loading')} show />
            </Box>
          }
        >
          <ErrorToast message={t('common:errors.something-went-wrong')} />
        </Suspense>
      )}
      <Layer zIndex={sheetZIndex}>
        <OverlayPanel
          accessibilityDismissButtonLabel={
            t('common:cart-overlay.close') || 'Close'
          }
          accessibilityLabel={t('common:cart')}
          heading={t('common:cart') || ''}
          onDismiss={toggleShowCart}
          footer={
            <CartFooter
              total={total}
              handleCheckout={handleCheckout}
              isLoading={isCreatingOrder}
              isError={isOrderError}
              error={orderError}
            />
          }
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
                <Text>{t('common:cart-overlay.cart-empty')}</Text>
              )}
            </Box>

            <Box paddingY={2}>
              <SelectList
                id="address"
                name="Address"
                placeholder={
                  isLoading
                    ? t('common:loading') || 'Loading'
                    : isError
                    ? t('common:sign-in') || 'Sign In'
                    : t('common:select-address') || 'Select Address'
                }
                label={t('common:address') || 'Address'}
                onChange={({value}) => dispatch(setAddress(value))}
                value={useAppSelector(selectCartAddress)}
                disabled={
                  isLoading ||
                  isError ||
                  !addressOptions ||
                  (addressOptions && !addressOptions.length)
                }
              >
                {addressOptions &&
                  addressOptions.map(({label, value}) => (
                    <SelectList.Option
                      key={value}
                      label={label /* @ts-ignore */}
                      value={value}
                    />
                  ))}
              </SelectList>
              <Box marginTop={3} display="flex" justifyContent="center">
                <Text size="400">OR</Text>
              </Box>
              <Box marginTop={3}>
                <Button
                  text="Add New Address"
                  onClick={() => {
                    setLocation('/address')
                    toggleShowCart()
                  }}
                  size="sm"
                  fullWidth
                />
              </Box>
            </Box>

            <Box paddingY={2}>
              <TextArea
                id="specialInstructions"
                onChange={({value}) => dispatch(setSpecialInstructions(value))}
                placeholder={
                  t('common:cart-overlay.special-instructions-placeholder') ||
                  'any special requests...'
                }
                helperText={
                  t('common:cart-overlay.special-instructions-helper-text') ||
                  "We'll TRY to follow the request, but might not be able to depending on circumstances"
                }
                label={
                  t('common:cart-overlay.special-instructions') ||
                  'Special Instructions'
                }
                value={specialInstructions}
              />
            </Box>
          </Box>
        </OverlayPanel>
      </Layer>
    </>
  )
}

export default CartOverlay
