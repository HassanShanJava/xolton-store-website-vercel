/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  trailingSlash: true,

  reactStrictMode: true,

  images: {
    unoptimized: true,

    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      "images.unsplash.com",
      "gateway.pinata.cloud",
      "dfmin6ewnkm30.cloudfront.net",
    ],
  },
};
export default config;
