import React from 'react'
import {useLocation} from 'wouter'
import {Dropdown} from 'gestalt'
import {useAppDispatch} from '../../../hooks/useAppDispatch'
import {signOut} from '../../../slices/auth.slice'

interface MenuDropDownProps {
  toggleMenu: () => void
  menuAnchorRef: any
}

const MenuDropDown: React.FC<MenuDropDownProps> = (props) => {
  const {toggleMenu, menuAnchorRef} = props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation()
  const dispatch = useAppDispatch()

  return (
    <Dropdown
      anchor={menuAnchorRef.current}
      id="demo-dropdown-example"
      onDismiss={toggleMenu}
    >
      <Dropdown.Item
        onSelect={() => {
          setLocation('/profile')
        }}
        option={{
          value: 'item 3',
          label: 'My Profile',
        }}
      />
      <Dropdown.Item
        onSelect={() => {
          setLocation('/orders')
        }}
        option={{
          value: 'item 3',
          label: 'My Orders',
        }}
      />
      <Dropdown.Item
        onSelect={() => {
          setLocation('/settings')
        }}
        option={{
          value: 'item 3',
          label: 'Settings',
        }}
      />
      <Dropdown.Item
        onSelect={() => {
          setLocation('/')
          dispatch(signOut)
        }}
        option={{
          value: 'sign-out',
          label: 'Sign Out',
        }}
      />
    </Dropdown>
  )
}

export default MenuDropDown
