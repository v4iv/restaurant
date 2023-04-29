import React from 'react'
import {Helmet} from 'react-helmet'
import {useTranslation} from 'react-i18next'

interface IProps {
  title: string
  url: string
  description: string
}

const SEO: React.FunctionComponent<IProps> = (props) => {
  const [t] = useTranslation(['common'])
  const {title, url, description} = props

  return (
    <Helmet>
      <title>
        {title} &middot; {t('common:kitchen')}
      </title>

      <meta name="description" content={description} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />

      <meta property="og:title" content={`${title} | ${t('common:kitchen')}`} />

      <meta property="og:author" content="Restaurant" />

      <meta property="og:description" content={description} />
    </Helmet>
  )
}

export default SEO
