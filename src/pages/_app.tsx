import type { AppProps } from 'next/app'
import { ThemeProvider } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import MenuCard from '@/components/menuCard/MenuCard'
import { getToken } from '@/services/api'
import { customTheme } from '../theme/theme'
import '@nexpy/design-system/dist/preflight.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isPublic = router.pathname === '/' || router.pathname === '/login'

  useEffect(() => {
    if (!isPublic && !getToken()) router.replace('/login')
  }, [isPublic, router])

  return (
    <ThemeProvider theme={customTheme}>
      <Component {...pageProps} />
      {!isPublic && (
        <MenuCard />
      )}
    </ThemeProvider>
  )
}
