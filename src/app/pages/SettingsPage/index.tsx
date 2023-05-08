import React, {useContext} from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Module,
  OnLinkNavigationProvider,
  SlimBanner,
  Text,
} from 'gestalt'
import ThemeContext from '../../contexts/theme.context'
import {useAppSelector} from '../../hooks/useAppSelector'
import {selectUser} from '../../slices/auth.slice'
import {UpdatePasswordForm} from '../../components/_forms/UpdatePasswordForm'

const SettingsPage: React.FC = () => {
  const user = useAppSelector(selectUser)
  const themeContext = useContext(ThemeContext)
  const {firstName, lastName, email, phone} = user

  return (
    <>
      {/* @ts-ignore */}
      <OnLinkNavigationProvider onNavigation={undefined}>
        <Box paddingY={2} marginStart={1} marginEnd={1}>
          <Box
            alignItems="start"
            direction="row"
            display="flex"
            borderStyle={
              themeContext.theme === 'light' ? 'raisedTopShadow' : 'sm'
            }
            rounding={1}
            padding={6}
            marginBottom={4}
          >
            <Box paddingX={1}>
              <Avatar name={firstName} size="md" />
            </Box>
            <Box paddingX={1} flex="grow" wrap>
              <Heading color="shopping">
                {firstName} {lastName}
              </Heading>
              <Box paddingX={1} marginTop={2} wrap>
                <Text size="300">
                  <Link href={`mailto:${email}`}>{email}</Link>
                </Text>
                <Text size="300">
                  <Link href={`tel:+91${phone}`}>Phone: +91-{phone}</Link>
                </Text>
              </Box>
            </Box>
            <Box paddingX={1}>
              <Button text="Edit" color="red" />
            </Box>
          </Box>

          <Divider />

          <Box marginTop={4} marginBottom={2}>
            <Module.Expandable
              accessibilityExpandLabel="Update Password Form"
              accessibilityCollapseLabel="Collapse Update Password Form"
              id="updatePasswordModule"
              expandedIndex={0}
              items={[
                {
                  title: 'Update Password',
                  summary: [],
                  children: <UpdatePasswordForm email={email} />,
                  icon: 'key',
                },
              ]}
            ></Module.Expandable>
          </Box>

          <Box marginBottom={4}>
            <SlimBanner
              iconAccessibilityLabel="Get Help"
              message="Need Help? Drop us a Message."
              primaryAction={{
                accessibilityLabel: 'WhatsApp Us',
                label: 'WhatsApp',
                href: `https://wa.me/+917727950963`,
              }}
              type="info"
            />
          </Box>

          <Divider />

          <Box marginTop={4}>
            <Button text="Deactivate Account" color="red" fullWidth />
          </Box>
        </Box>
      </OnLinkNavigationProvider>
    </>
  )
}

export default SettingsPage
