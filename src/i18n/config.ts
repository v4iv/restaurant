import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import common from './en/common.json'
import homepage from './en/homepage.json'

export const defaultNS = 'common'

export const resources = {
  en: {common, homepage},
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['common', 'home-page'],
  defaultNS,
  resources,
})
