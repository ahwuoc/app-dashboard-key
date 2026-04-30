import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['146.190.88.68'],
  experimental: {
    proxyClientMaxBodySize: 500 * 1024 * 1024,
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },

  async rewrites() {
    return [
      {
        source: '/generate-client',
        destination: '/api/generate-client',
      },
      {
        source: '/verify',
        destination: '/api/verify',
      },
      {
        source: '/check-update',
        destination: '/api/check-update',
      },
      {
        source: '/download/latest.yml',
        destination: '/api/latest-yml',
      },
      {
        source: '/download/:filename',
        destination: '/api/download/:filename',
      }

    ];
  },
};

export default nextConfig;
