import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Enable React Strict Mode for highlighting potential problems.
   * https://react.dev/reference/react/StrictMode
   */
  reactStrictMode: true,

  /**
   * Opt-in to the App Router if not already the default.
   * (Default in Next.js 14+, kept explicit for clarity.)
   */
  experimental: {},
};

export default nextConfig;
