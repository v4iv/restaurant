import React from 'react'
import {Box, Layer, Toast} from 'gestalt'

interface IErrorToastProps {
  message: string
}

const ErrorToast: React.FC<IErrorToastProps> = (props) => {
  const {message} = props
  return (
    <Layer>
      <Box
        fit
        dangerouslySetInlineStyle={{
          __style: {
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
          },
        }}
        paddingX={1}
        position="fixed"
      >
        {/* @ts-ignore */}
        <Toast text={message} type="error" />
      </Box>
    </Layer>
  )
}

export default ErrorToast
