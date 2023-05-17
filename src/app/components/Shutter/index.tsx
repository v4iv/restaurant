import React from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Heading, Layer, Spinner} from 'gestalt'

interface IShutterProps {
  isOpen: boolean
  isLoading: boolean
}

const Shutter: React.FC<IShutterProps> = (props) => {
  const {isOpen, isLoading} = props
  const [t] = useTranslation(['common'])

  if (isLoading) {
    return (
      <Layer>
        <Box
          color="transparentDarkGray"
          position="fixed"
          top
          left
          right
          bottom
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            position="fixed"
            display="flex"
            alignItems="center"
            justifyContent="center"
            top
            left
            right
            bottom
          >
            <Spinner accessibilityLabel={t('common:loading')} show />
          </Box>
        </Box>
      </Layer>
    )
  }

  if (isOpen === false) {
    return (
      <Layer>
        <Box
          color="transparentDarkGray"
          position="fixed"
          top
          left
          right
          bottom
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box color="default" padding={3} display="flex" alignItems="center">
            <Heading>
              Sorry the restaurant is currently not accepting orders.
            </Heading>
          </Box>
        </Box>
      </Layer>
    )
  }

  return <></>
}

export default Shutter
