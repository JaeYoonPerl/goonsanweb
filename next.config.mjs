/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
  },
  // 성능 최적화 설정
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // 컴파일러 최적화
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
  },
  // 번들 최적화 및 분석기
  webpack: (config, { dev, isServer }) => {
    // 프로덕션에서 불필요한 코드 제거
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }

    // 번들 분석기 (개발 시에만)
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: './bundle-analyzer.html',
        })
      )
    }

    return config
  },
  // 압축 설정
  compress: true,
  // 정적 파일 최적화
  poweredByHeader: false,
  // 캐시 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
