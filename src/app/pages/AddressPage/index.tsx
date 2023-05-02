import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Divider, Flex, Module, Spinner, Text} from 'gestalt'
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
} from '../../services/address.service'
import AddressCard from '../../components/AddressCard'
import {AddressForm} from '../../components/_forms'

const ErrorToast = lazy(() => import('../../components/ErrorToast'))

const AddressPage: React.FC = () => {
  const [t] = useTranslation(['common'])
  const {data, isError, isLoading} = useGetAddressesQuery()
  const [deleteAddressMutation, {isLoading: isDeleting}] =
    useDeleteAddressMutation()

  const handleDeleteAddress = async (addressId: string | undefined) => {
    if (addressId) {
      try {
        await deleteAddressMutation(addressId).unwrap()
      } catch (err) {
        console.error('Delete Address Error: ', err)
      }
    }
  }
  return (
    <>
      <Box paddingY={2} marginStart={1} marginEnd={1}>
        <Module.Expandable
          accessibilityExpandLabel="Add New Address Module"
          accessibilityCollapseLabel="Collapse New Address Module"
          id="addNewAddressModule"
          expandedIndex={data?.length ? 1 : 0}
          items={[
            {
              title: 'New Address',
              summary: [],
              children: <AddressForm />,
              icon: 'add',
            },
          ]}
        ></Module.Expandable>

        <Box paddingY={2}>
          <Divider />

          {(isLoading || isDeleting) && (
            <Box paddingY={4}>
              <Spinner
                accessibilityLabel={t('common:loading')}
                show={isLoading || isDeleting}
              />
            </Box>
          )}

          {!isLoading && isError && (
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

          <Box paddingY={3}>
            {!isLoading && !isError && data && data.length ? (
              data.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isDeleting={isDeleting}
                  handleDelete={handleDeleteAddress}
                />
              ))
            ) : (
              <Flex justifyContent="center">
                <Text>Add an address to start ordering...</Text>
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AddressPage
