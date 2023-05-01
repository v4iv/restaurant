import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Spinner} from 'gestalt'
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
} from '../../services/address.service'
import AddressCard from '../../components/AddressCard'

const ErrorToast = lazy(() => import('../../components/ErrorToast'))

const AddressPage: React.FC = () => {
  const [t] = useTranslation(['common'])
  const {data, isError, isLoading} = useGetAddressesQuery()
  const [deleteAddressMutation, {isLoading: isDeleting}] =
    useDeleteAddressMutation()

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddressMutation(addressId).unwrap()
    } catch (err) {
      console.error('Delete Address Error: ', err)
    }
  }
  return (
    <>
      <Box paddingY={2}>
        {isLoading && (
          <Box paddingY={4}>
            <Spinner
              accessibilityLabel={t('common:loading')}
              show={isLoading}
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

        {!isLoading &&
          !isError &&
          data?.addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDeleting={isDeleting}
              handleDelete={handleDeleteAddress}
            />
          ))}
      </Box>
    </>
  )
}

export default AddressPage
