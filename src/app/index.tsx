import React, {Suspense, useEffect, useState} from 'react'
import {Route} from 'wouter'
import {useTranslation} from 'react-i18next'
import {
  Box,
  Container,
  ColorSchemeProvider,
  ColorSchemeProviderProps,
  Spinner,
} from 'gestalt'
import ThemeContext from './contexts/theme.context'
import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
import SignInPage from './pages/SignInPage'

const App: React.FC = () => {
  const {t} = useTranslation(['common'])
  const [theme, setTheme] =
    useState<ColorSchemeProviderProps['colorScheme']>('light')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('colorScheme', nextTheme)
    setTheme(nextTheme)
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
              </Suspense>
            </Container>
          </Box>
        </ColorSchemeProvider>
      </ThemeContext.Provider>
    </>
  )
}

export default App
