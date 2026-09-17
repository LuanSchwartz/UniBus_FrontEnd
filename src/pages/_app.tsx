import type { AppProps } from "next/app";
import { ThemeProvider } from '@nexpy/design-system'
import { customTheme } from "../theme/theme";
import '@nexpy/design-system/dist/preflight.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
