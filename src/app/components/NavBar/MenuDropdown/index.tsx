import React from 'react'
import {useTranslation} from 'react-i18next'
import {Dropdown} from 'gestalt'
import {useSignOutMutation} from '../../../services/auth.service'

interface MenuDropDownProps {
  toggleMenu: () => void
  menuAnchorRef: any
}

const MenuDropDown: React.FC<MenuDropDownProps> = (props) => {
  const {toggleMenu, menuAnchorRef} = props
  const [t] = useTranslation(['common'])

  const [signOutMutation] = useSignOutMutation()

  return (
    <Dropdown anchor={menuAnchorRef.current} id="menu" onDismiss={toggleMenu}>
      <Dropdown.Link
        href="/orders"
        onClick={() => toggleMenu()}
        option={{
          value: 'orders',
          label: t('common:orders'),
        }}
      />
      <Dropdown.Link
        href="/address"
        onClick={() => toggleMenu()}
        option={{
          value: 'address',
          label: t('common:addresses'),
        }}
      />
      <Dropdown.Link
        href="/settings"
        onClick={() => toggleMenu()}
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
