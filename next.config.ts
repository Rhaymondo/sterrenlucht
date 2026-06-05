import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'

const csp = [
  "default-src 'self'",
  isProd
    ? "script-src 'self' 'unsafe-inline' https://js.stripe.com https://vercel.live"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://d1twnm33rljaon.cloudfront.net https://8seg8ryhgti0sudl.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com https:",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "media-src 'self' blob:",
  "frame-ancestors 'none'",
].join('; ')

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/pages/over-ons',        destination: '/over-ons',   permanent: true },
      { source: '/blogs/blog',             destination: '/',           permanent: true },
      { source: '/collections/frontpage', destination: '/',           permanent: true },
      { source: '/pages/contact',         destination: '/contact',    permanent: true },
      { source: '/products/poster',       destination: '/configureer', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy',    value: csp },
        ],
      },
    ]
  },
};

export default nextConfig;
