import React, {lazy, Suspense, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Spinner, Table, Text} from 'gestalt'
import ThemeContext from '../../contexts/theme.context'
import {useGetOrderQuery} from '../../services/order.service'
import StatusGraphic from '../../components/StatusGraphic'

const ErrorToast = lazy(() => import('../../components/ErrorToast'))

interface IOrderPageProps {
  id: string
}
const OrderPage: React.FC<IOrderPageProps> = (props) => {
  const {id} = props
  const [t] = useTranslation(['common'])
  const themeContext = useContext(ThemeContext)

  const {data, isLoading, isError} = useGetOrderQuery(id)

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
      <Box paddingY={2} marginStart={1} marginEnd={1}>
        <Box
          alignItems="start"
          borderStyle={
            themeContext.theme === 'light' ? 'raisedTopShadow' : 'sm'
          }
          rounding={1}
          padding={6}
          marginBottom={4}
        >
          <Table accessibilityLabel="Main example table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">Product(s)</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Quantity</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Price</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.products.map(({product, quantity, price}) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <Text>{product.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{quantity}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>₹ {price}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.Cell>
                  <Text weight="bold">Total</Text>
                </Table.Cell>
                <Table.Cell />
                <Table.Cell>
                  <Text weight="bold">₹ {data?.total}</Text>
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Box>
        <Box
          alignItems="start"
          borderStyle={
            themeContext.theme === 'light' ? 'raisedTopShadow' : 'sm'
          }
          rounding={1}
          padding={6}
          marginBottom={4}
        >
          <StatusGraphic status={data?.status} />
        </Box>
      </Box>
    </>
  )
}

export default OrderPage
