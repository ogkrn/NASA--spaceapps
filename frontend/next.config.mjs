/** Same-origin browser API: server-side environment selects the backend. */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [{ source: '/api/backend/:path*', destination: `${backend}/api/v1/:path*` }];
  },
};
export default nextConfig;
