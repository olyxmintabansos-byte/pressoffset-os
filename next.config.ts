import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/pressoffset-os',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;