import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      ssr: true,
      topLevelImportPaths: [
        '@xstyled/styled-components',
        '@xstyled/styled-components/no-tags',
        '@xstyled/styled-components/native',
        '@xstyled/styled-components/primitives',
      ],
    },
    ...(process.env.NODE_ENV !== 'production'
      ? {}
      : {
          removeConsole: {
            exclude: ['error', 'warn', 'info'],
          },
        }),
  },
}

export default nextConfig
