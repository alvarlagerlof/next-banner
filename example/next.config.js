/** @type {import('next').NextConfig} */

const { withBannerOptions } = require("next-banner");

module.exports = withBannerOptions({
  domain: "example.com",
  banner: {
    width: 1200,
    height: 2,
  },
  reactStrictMode: true,
});
