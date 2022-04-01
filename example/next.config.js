/** @type {import('next').NextConfig} */

const { withBannerOptions } = require("next-banner");

module.exports = withBannerOptions({
  nextBanner: {
    domain: "example.com",
  },
});
