import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'wouter'
import {useForm} from 'react-hook-form'
import {Box, Button, Divider, Heading, Spinner, TextField} from 'gestalt'
import {useSignInMutation} from '../../../services/auth.service.ts'

const ErrorToast = lazy(() => import('../../ErrorToast'))

type FormValues = {
  email: string
  password: string
}

const SignInForm: React.FC = () => {
  const [t] = useTranslation(['common'])
  const [, setLocation] = useLocation()
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormValues>()

  const [signInMutation, {isLoading, isError, error}] = useSignInMutation()

  const onSubmit = async (data: FormValues) => {
    try {
      await signInMutation({
        email: data.email,
        password: data.password,
      }).unwrap()
      // sign up successful
      setLocation('/', {replace: true})
    } catch (err) {
      console.error('Sign In Error: ', err)
    }
  }

  const email = register('email', {required: true})
  const password = register('password', {required: true})

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        borderStyle={'sm'}
        rounding={2}
        padding={5}
        display="flex"
        width="100%"
        direction="column"
        maxWidth={800}
      >
        <Box flex="grow" paddingX={3} paddingY={3}>
          <Box paddingX={3} paddingY={3}>
            <Heading size="300" accessibilityLevel={2}>
              {t('common:sign-in')}
            </Heading>
          </Box>

          <Divider />

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
                id="password"
                type="password"
                name={password.name}
                placeholder="Password"
                ref={password.ref}
                errorMessage={errors.password?.message}
                onChange={({value}) => setValue('password', value)}
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

export {SignInForm}
