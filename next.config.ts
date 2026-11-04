import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // O back não habilita CORS: as chamadas passam por este proxy.
  async rewrites() {
    const apiUrl = process.env.API_URL ?? 'http://localhost:3000'
    return [{ source: '/api/v1/:path*', destination: `${apiUrl}/api/v1/:path*` }]
  },
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