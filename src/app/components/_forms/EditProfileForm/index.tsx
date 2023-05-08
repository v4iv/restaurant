import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'wouter'
import {useForm} from 'react-hook-form'
import {Box, Button, Spinner, TextField} from 'gestalt'
import {useUpdateProfileMutation} from '../../../services/auth.service'
import {User} from '../../../types/user.types'

const ErrorToast = lazy(() => import('../../ErrorToast'))

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface IEditProfileFormProps {
  user: User
}

const EditProfileForm: React.FC<IEditProfileFormProps> = (props) => {
  const {user} = props
  const [t] = useTranslation(['common'])
  const [, setLocation] = useLocation()
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  })

  const [updateProfileMutation, {isLoading, isError, error}] =
    useUpdateProfileMutation()

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfileMutation({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      }).unwrap()
      // sign up successful
      setLocation('/sign-in')
    } catch (err) {
      console.error('Sign Up Error: ', err)
    }
  }

  const firstName = register('firstName', {required: true})
  const lastName = register('lastName', {required: true})
  const email = register('email', {required: true})
  const phone = register('phone', {required: true})

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box rounding={2} display="flex" width="100%" direction="column">
        <Box flex="grow" paddingX={3} paddingY={3}>
          {isError && (
            <Suspense
              fallback={
                <Box paddingY={6}>
                  <Spinner accessibilityLabel={t('common:loading')} show />
                </Box>
              }
            >
              <ErrorToast
                message={
                  // @ts-ignore
                  error?.data?.error || t('common:something-went-wrong')
                }
              />
            </Suspense>
          )}

          <Box paddingY={2}>
            <Box flex="grow" paddingX={3} paddingY={3}>
              <Box
                display="flex"
                wrap
                marginEnd={-3}
                marginStart={-3}
                marginBottom={-3}
                marginTop={-3}
              >
                <Box flex="grow" paddingX={3} paddingY={3}>
                  <TextField
                    id="firstName"
                    name={firstName.name}
                    placeholder="First Name"
                    ref={firstName.ref}
                    errorMessage={errors.firstName?.message}
                    onChange={({value}) => setValue('firstName', value)}
                  />
                </Box>

                <Box flex="grow" paddingX={3} paddingY={3}>
                  <TextField
                    id="lastName"
                    name={lastName.name}
                    placeholder="Last Name"
                    ref={lastName.ref}
                    errorMessage={errors.lastName?.message}
                    onChange={({value}) => setValue('lastName', value)}
                  />
                </Box>
              </Box>
            </Box>

            <Box flex="grow" paddingX={3} paddingY={3}>
              <TextField
                id="email"
                type="email"
                name={email.name}
                placeholder="eMail"
                ref={email.ref}
                errorMessage={errors.email?.message}
                onChange={({value}) => setValue('email', value)}
              />
            </Box>

            <Box flex="grow" paddingX={3} paddingY={3}>
              <TextField
                id="phone"
                name={phone.name}
                type="tel"
                placeholder="Phone Number"
                ref={phone.ref}
                errorMessage={errors.phone?.message}
                onChange={({value}) => setValue('phone', value)}
              />
            </Box>

            <Box flex="grow" paddingX={3} paddingY={3}>
              <Box
                justifyContent="end"
                marginStart={-1}
                marginTop={-1}
                marginBottom={-1}
                display="flex"
                wrap
              >
                <Box paddingX={1} paddingY={1}>
                  <Button
                    text="Submit"
                    color="red"
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  )
}

export {EditProfileForm}
