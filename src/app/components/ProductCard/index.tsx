import React from 'react'
import {Box, Button, Column, Icon, IconButton, Image, Text} from 'gestalt'
import {useAppDispatch} from '../../hooks/useAppDispatch'
import {CartItem} from '../../types/cart.types'
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../slices/cart.slice'
import {useTranslation} from 'react-i18next'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description?: string
    image: string
    isVegetarian: boolean
    isAvailable: boolean
    quantity: number
    price: number
  }
  getCartQuantity: (productId: string) => number
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const [t] = useTranslation(['homepage'])
  const dispatch = useAppDispatch()
  const {product, getCartQuantity} = props
  const {
    id,
    name,
    description,
    image,
    price,
    quantity,
    isAvailable,
    isVegetarian,
  } = product

  return (
    <Box
      color="default"
      rounding={2}
      padding={4}
      marginStart={1}
      marginEnd={1}
      marginBottom={3}
      borderStyle="sm"
      justifyContent="center"
      alignItems="start"
      direction="row"
      display="flex"
      wrap
    >
      <Column span={6} mdSpan={9}>
        <Box padding={1}>
          <Box paddingY={2}>
            <Text weight="bold">{name}</Text>
            <Box alignItems="center" display="flex" paddingY={2}>
              <Box marginEnd={2}>
                <Icon
                  accessibilityLabel={
                    isVegetarian
                      ? t('homepage:vegetarian')
                      : t('homepage:non-vegetarian')
                  }
                  icon="fill-opaque"
                  color={isVegetarian ? 'success' : 'error'}
                />
              </Box>
              <Text size="300">₹ {price}</Text>
            </Box>
            <Text size="300">{description}</Text>
          </Box>
        </Box>
      </Column>

      <Column span={6} mdSpan={3}>
        <Box
          padding={1}
          display="flex"
          justifyContent="end"
          alignItems="center"
        >
          <Box
            color="transparentDarkGray"
            height={150}
            width={150}
            alignItems="center"
          >
            <Image
              alt="square"
              color="#000"
              fit="cover"
              naturalHeight={1}
              naturalWidth={1}
              src={image}
            >
              <Box padding={2} width="100%" position="absolute" bottom>
                {getCartQuantity(id) > 0 ? (
                  <Box
                    color="default"
                    maxHeight={32}
                    rounding={'pill'}
                    display="flex"
                    direction="row"
                    justifyContent="around"
                    alignItems="center"
                    opacity={0.8}
                  >
                    <Box>
                      {getCartQuantity(id) > 1 ? (
                        <IconButton
                          accessibilityLabel={t('homepage:decrease-quantity')}
                          icon="dash"
                          onClick={() => dispatch(decreaseQuantity(id))}
                        />
                      ) : (
                        <IconButton
                          accessibilityLabel={t('homepage:remove-from-cart')}
                          icon="trash-can"
                          onClick={() => dispatch(removeFromCart(id))}
                        />
                      )}
                    </Box>
                    <Box flex="grow">
                      <Text align="center">{getCartQuantity(id)}</Text>
                    </Box>
                    <Box>
                      <IconButton
                        accessibilityLabel={t('homepage:increase-quantity')}
                        icon="add"
                        onClick={() => dispatch(increaseQuantity(id))}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Button
                    text={
                      isAvailable
                        ? t('homepage:add')
                        : t('homepage:out-of-stock')
                    }
                    size="sm"
                    color="red"
                    onClick={() => {
                      const newCartItem: CartItem = {
                        id: id,
                        name: name,
                        price: price,
                        quantity: 1,
                      }

                      dispatch(addToCart(newCartItem))
                    }}
                    disabled={!isAvailable || quantity <= 0}
                    fullWidth
                  />
                )}
              </Box>
            </Image>
          </Box>
        </Box>
      </Column>
    </Box>
  )
}

export default ProductCard
