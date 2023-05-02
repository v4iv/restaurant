import React from 'react'
import {useLocation} from 'wouter'
import {Dropdown} from 'gestalt'
import {useSignOutMutation} from '../../../services/auth.service'
import {useTranslation} from 'react-i18next'

interface MenuDropDownProps {
  toggleMenu: () => void
  menuAnchorRef: any
}

const MenuDropDown: React.FC<MenuDropDownProps> = (props) => {
  const {toggleMenu, menuAnchorRef} = props
  const [t] = useTranslation(['common'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation()

  const [signOutMutation] = useSignOutMutation()

  return (
    <Dropdown anchor={menuAnchorRef.current} id="menu" onDismiss={toggleMenu}>
      <Dropdown.Item
        onSelect={() => {
          setLocation('/orders')
          toggleMenu()
        }}
        option={{
          value: 'orders',
          label: t('common:orders'),
        }}
      />
      <Dropdown.Item
        onSelect={() => {
          setLocation('/address')
          toggleMenu()
        }}
        option={{
          value: 'address',
          label: t('common:address'),
        }}
      />
      <Dropdown.Item
        onSelect={() => {
          setLocation('/settings')
          toggleMenu()
        }}
        option={{
          value: 'settings',
          label: t('common:settings'),
        }}
      />
      <Dropdown.Item
        onSelect={async () => {
          await signOutMutation()
        }}
        option={{
          value: 'sign-out',
          label: t('common:sign-out'),
        }}
      />
    </Dropdown>
  )
}

export default MenuDropDown
