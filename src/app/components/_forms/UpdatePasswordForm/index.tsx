import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {useForm} from 'react-hook-form'
import {Box, Button, Spinner, TextField} from 'gestalt'
import {useUpdatePasswordMutation} from '../../../services/auth.service'

const ErrorToast = lazy(() => import('../../ErrorToast'))

type FormValues = {
  currentPassword: string
  newPassword: string
}

interface IUpdatePasswordForm {
  email: string
}

const UpdatePasswordForm: React.FC<IUpdatePasswordForm> = (props) => {
  const {email} = props
  const [t] = useTranslation(['common'])
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormValues>()

  const [updatePasswordMutation, {isLoading, isError, error}] =
    useUpdatePasswordMutation()

  const onSubmit = async ({currentPassword, newPassword}: FormValues) => {
    try {
      await updatePasswordMutation({
        email: email,
        currentPassword,
        newPassword,
      })
    } catch (err) {
      console.error('Update Password Error: ', err)
    }
  }

  const currentPassword = register('currentPassword', {required: true})
  const newPassword = register('newPassword', {required: true})

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              error?.data?.error || t('common:errors.something-went-wrong')
            }
          />
        </Suspense>
      )}

      <Box paddingY={2}>
        <Box flex="grow" paddingX={3} paddingY={3}>
          <TextField
            id="currentPassword"
            type="password"
            name={currentPassword.name}
            label="Current Password*"
            placeholder="Your Current Password"
            ref={currentPassword.ref}
            errorMessage={errors.currentPassword?.message}
            onChange={({value}) => setValue('currentPassword', value)}
          />
        </Box>

        <Box flex="grow" paddingX={3} paddingY={3}>
          <TextField
            id="newPassword"
            type="password"
            name={newPassword.name}
            label="New Password*"
            placeholder="Enter New Password"
            ref={newPassword.ref}
            errorMessage={errors.newPassword?.message}
            onChange={({value}) => setValue('newPassword', value)}
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
    </form>
  )
}

export {UpdatePasswordForm}
