import type { AppProps } from 'next/app'
import { ThemeProvider } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import MenuCard from '@/components/menuCard/MenuCard'
import { customTheme } from '../theme/theme'
import '@nexpy/design-system/dist/preflight.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <ThemeProvider theme={customTheme}>
      <Component {...pageProps} />
      {router.pathname !== '/' && router.pathname !== '/login' && router.pathname !== '/admin' && (
        <MenuCard />
      )}
    </ThemeProvider>
  )
}
