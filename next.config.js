/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — Next.js writes the full site into ./out for upload to
  // any static host (Hostinger, Netlify, S3, …).
  output: "export",

  // The Image optimization pipeline needs a Node.js server, which a static host
  // cannot run. Disabling it ships the original asset bytes from /public/assets/
  // straight through. All <Image> components keep working.
  images: { unoptimized: true },

  // Append a trailing slash to every route so Hostinger's Apache resolves
  // /kontakt/index.html correctly without rewrites.
  trailingSlash: true,

  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

module.exports = nextConfig;
