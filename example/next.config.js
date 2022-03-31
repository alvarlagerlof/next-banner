/** @type {import('next').NextConfig} */

const { withBannerOptions } = require("next-banner");

module.exports = withBannerOptions({
  domain: "example.com",
  concurrency: 1,
});
