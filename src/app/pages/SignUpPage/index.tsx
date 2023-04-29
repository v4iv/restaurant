import React from 'react'
import {Box} from 'gestalt'
import {SignUpForm} from '../../components/_forms'

const SignUpPage: React.FC = () => {
  return (
    <>
      <Box paddingY={2} margin={1}>
        <SignUpForm />
      </Box>
    </>
  )
}

export default SignUpPage
