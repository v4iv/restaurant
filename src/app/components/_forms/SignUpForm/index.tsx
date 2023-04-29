import React from 'react'
import {useForm} from 'react-hook-form'
import {Box, Button, Divider, Heading, TextField} from 'gestalt'
import {useSignUpMutation} from '../../../services/auth.service.ts'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormValues>()

  const [signUpMutation, {isLoading}] = useSignUpMutation()

  const onSubmit = async (data: FormValues) => {
    try {
      await signUpMutation({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      }).unwrap()
      // sign up successful
    } catch (err) {
      console.error('Sign Up Error: ', err)
    }
  }

  const firstName = register('firstName', {required: true})
  const lastName = register('lastName', {required: true})
  const email = register('email', {required: true})
  const phoneNumber = register('phoneNumber', {required: true})
  const password = register('password', {required: true})

  return (
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
            Sign Up
          </Heading>
        </Box>

        <Divider />
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
            <TextField
              id="phoneNumber"
              name={phoneNumber.name}
              type="tel"
              placeholder="Phone Number"
              ref={phoneNumber.ref}
              errorMessage={errors.phoneNumber?.message}
              onChange={({value}) => setValue('phoneNumber', value)}
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
                  onClick={() => handleSubmit(onSubmit)}
                  disabled={isLoading}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export {SignUpForm}
