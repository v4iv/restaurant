import React from 'react'
import {Box, Heading} from 'gestalt'
import {useTranslation} from 'react-i18next'

const PageNotFound: React.FunctionComponent = () => {
  const {t} = useTranslation(['common'])

  return (
    <Box
      height="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Heading size="600" color="error">
        404
      </Heading>

      <Heading size="500">{t('common:errors.page-not-found')}</Heading>
    </Box>
  )
}

export default PageNotFound
