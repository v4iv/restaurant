import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import common from './en/common.json'
import homepage from './en/homepage.json'
import addresspage from './en/addresspage.json'
import orderspage from './en/orderspage.json'

export const defaultNS = 'common'

export const resources = {
  en: {common, homepage, addresspage, orderspage},
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['common', 'homepage', 'addresspage', 'orderspage'],
  defaultNS,
  resources,
})
