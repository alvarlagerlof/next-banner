/** @type {import('next').NextConfig} */

const { withBannerOptions } = require("next-banner");

module.exports = withBannerOptions({
  domain: "example.com",
  width: 1200,
  height: 630,
});
