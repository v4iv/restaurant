import React, {lazy, Suspense, useEffect, useState} from 'react'
import {Route, useLocation} from 'wouter'
import {useTranslation} from 'react-i18next'
import {
  Box,
  ColorSchemeProvider,
  ColorSchemeProviderProps,
  Container,
  OnLinkNavigationProvider,
  Spinner,
} from 'gestalt'
import ThemeContext from './contexts/theme.context'
import NavBar from './components/NavBar'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const SignInPage = lazy(() => import('./pages/SignInPage'))
const AddressPage = lazy(() => import('./pages/AddressPage'))

const App: React.FC = () => {
  const {t} = useTranslation(['common'])
  const [, navigate] = useLocation()
  const [theme, setTheme] =
    useState<ColorSchemeProviderProps['colorScheme']>('light')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('colorScheme', nextTheme)
    setTheme(nextTheme)
  }

  // @ts-ignore
  const useOnNavigation = ({href}) => {
    // @ts-ignore
    return ({event}) => {
      event.preventDefault()
      navigate(href)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (localStorage && localStorage.getItem('colorScheme')) {
      const colorScheme = localStorage.getItem('colorScheme')

      // @ts-ignore
      setTheme(colorScheme)
    }
  }, [])

  return (
    <>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <ColorSchemeProvider colorScheme={theme}>
          {/* @ts-ignore */}
          <OnLinkNavigationProvider onNavigation={useOnNavigation}>
            <Box color="default" minHeight="100vh">
              <Container>
                <NavBar />
                <Suspense
                  fallback={
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
                  }
                >
                  <Route path="/" component={HomePage}>
                    Home Page
                  </Route>
                  <Route path="/sign-in" component={SignInPage}>
                    Sign In Page
                  </Route>
                  <Route path="/sign-up" component={SignUpPage}>
                    Sign Up Page
                  </Route>
                  <Route path="/address" component={AddressPage}>
                    Address Page
                  </Route>
                </Suspense>
              </Container>
            </Box>
          </OnLinkNavigationProvider>
        </ColorSchemeProvider>
      </ThemeContext.Provider>
    </>
  )
}

export default App
