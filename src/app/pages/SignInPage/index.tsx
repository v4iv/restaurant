import React from 'react'
import {Box} from 'gestalt'
import {SignInForm} from '../../components/_forms'

const SignInPage: React.FC = () => {
  return (
    <>
      <Box paddingY={2} margin={1}>
        <SignInForm />
      </Box>
    </>
  )
}

export default SignInPage
