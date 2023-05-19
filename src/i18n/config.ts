import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import common from './en/common.json'
import * as home from './en/home-page.json'
import * as address from './en/address-page.json'
import * as orders from './en/orders-page.json'

export const defaultNS = 'common'

export const resources = {
  en: {common, home, address, orders},
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['common', 'home', 'address', 'orders'],
  defaultNS,
  resources,
})
