import React, {lazy, Suspense, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useForm} from 'react-hook-form'
import {
  Box,
  Button,
  Flex,
  SelectList,
  Spinner,
  Status,
  TextField,
} from 'gestalt'
import {Address} from '../../../types/address.types'
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from '../../../services/address.service'

const ErrorToast = lazy(() => import('../../ErrorToast'))

interface IAddressFormProps {
  address?: Address
  toggleEditModal?: () => void
}

type FormValues = {
  name: string
  addressLineOne: string
  addressLineTwo: string
  landmark?: string
  area: string
  phone: string
  location?: string
}

const AddressForm: React.FC<IAddressFormProps> = (props) => {
  const {address, toggleEditModal} = props
  const [gpsLocation, setGPSLocation] = useState(address?.location || '')
  const [areaValue, setAreaValue] = useState(address?.area || '')
  const [t] = useTranslation(['common'])
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: address?.name || '',
      addressLineOne: address?.addressLineOne || '',
      addressLineTwo: address?.addressLineTwo || '',
      landmark: address?.landmark || '',
      area: address?.area || '',
      phone: address?.phone || '',
    },
  })

  const [
    createAddressMutation,
    {isLoading: isCreating, isError: isCreateError},
  ] = useCreateAddressMutation()
  const [
    updateAddressMutation,
    {isLoading: isUpdating, isError: isUpdateError},
  ] = useUpdateAddressMutation()

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        setGPSLocation(`${coords.latitude}, ${coords.longitude}`)
      },
      (error) => {
        console.error(error)
      },
    )
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (address) {
        await updateAddressMutation({
          id: address.id,
          location: gpsLocation,
          ...data,
        })

        toggleEditModal && toggleEditModal()
      } else {
        await createAddressMutation({
          name: data.name,
          addressLineOne: data.addressLineOne,
          addressLineTwo: data.addressLineTwo,
          landmark: data.landmark,
          area: data.area,
          phone: data.phone,
          location: gpsLocation,
        })

        reset()
      }
    } catch (err) {
      console.error('Address Error', err)
    }
  }

  const areaOptions = [
    {
      value: 'CHIRKUNDA',
      label: 'Chirkunda',
    },
    {
      value: 'KUMARDUBI',
      label: 'Kumardubi',
    },
    {
      value: 'TALDANGA',
      label: 'Taldanga',
    },
  ]

  const name = register('name', {required: true})
  const addressLineOne = register('addressLineOne', {required: true})
  const addressLineTwo = register('addressLineTwo', {required: true})
  const landmark = register('landmark', {required: false})
  const area = register('area', {required: true})
  const phone = register('phone', {required: true})

  // Disable submit button if the form is not dirty
  // const isSubmitDisabled = address && !isDirty

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box flex="grow" paddingX={1} paddingY={1}>
        {(isCreateError || isUpdateError) && (
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
        <Box flex="grow" paddingX={3} paddingY={3}>
          <TextField
            id="name"
            name={name.name}
            label="Name*"
            placeholder="Name"
            ref={name.ref}
            errorMessage={errors.name?.message}
            onChange={({value}) => setValue('name', value)}
            disabled={isCreating || isUpdating}
          />
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <TextField
            id="addressLineOne"
            name={addressLineOne.name}
            label="Address Line One*"
            placeholder="example: Apt 501, Fifth Floor"
            ref={addressLineOne.ref}
            errorMessage={errors.addressLineOne?.message}
            onChange={({value}) => setValue('addressLineOne', value)}
            disabled={isCreating || isUpdating}
          />
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <TextField
            id="addressLineTwo"
            name={addressLineTwo.name}
            label="Address Line Two*"
            placeholder="example: Stoner Apartment"
            ref={addressLineTwo.ref}
            errorMessage={errors.addressLineTwo?.message}
            onChange={({value}) => setValue('addressLineTwo', value)}
            disabled={isCreating || isUpdating}
          />
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <TextField
            id="landmark"
            name={landmark.name}
            label="Landmark"
            placeholder="example: Near Railway Station"
            ref={landmark.ref}
            errorMessage={errors.landmark?.message}
            onChange={({value}) => setValue('landmark', value)}
            disabled={isCreating || isUpdating}
          />
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <Box
            display="flex"
            wrap
            marginStart={-3}
            marginEnd={-3}
            marginBottom={-3}
            marginTop={-3}
          >
            <Box flex="grow" paddingX={3} paddingY={3}>
              <SelectList
                id="area"
                name={area.name}
                onChange={({value}) => {
                  setValue('area', value)
                  setAreaValue(value)
                }}
                placeholder="Select Area"
                label="Area*"
                helperText="We currently only serve Chirkunda, Taldanga & Kumardubi"
                value={areaValue}
                disabled={isCreating || isUpdating}
              >
                {areaOptions.map(({label, value}) => (
                  <SelectList.Option key={value} label={label} value={value} />
                ))}
              </SelectList>
            </Box>

            <Box flex="grow" paddingX={3} paddingY={3}>
              <TextField
                id="phone"
                name={phone.name}
                label="Phone*"
                type="tel"
                placeholder="example: 5553336669"
                ref={phone.ref}
                errorMessage={errors.phone?.message}
                onChange={({value}) => setValue('phone', value)}
                disabled={isCreating || isUpdating}
              />
            </Box>
          </Box>
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <Flex justifyContent="evenly" alignItems="center">
            <Status
              title={
                gpsLocation.length ? 'Location Added' : 'Location Not Added'
              }
              type={gpsLocation.length ? 'ok' : 'problem'}
            />
            <Button text="Add Delivery Location" onClick={getLocation} />
          </Flex>
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <Box
            justifyContent="end"
            marginStart={-1}
            marginEnd={-1}
            marginTop={-1}
            marginBottom={-1}
            display="flex"
            wrap
          >
            {address && (
              <Box paddingX={1} paddingY={1}>
                <Button
                  text="Close"
                  color="gray"
                  size="lg"
                  onClick={toggleEditModal}
                />
              </Box>
            )}
            <Box paddingX={1} paddingY={1}>
              <Button
                type="submit"
                text="Submit"
                color="red"
                size="lg"
                disabled={isCreating || isUpdating}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  )
}

export {AddressForm}
