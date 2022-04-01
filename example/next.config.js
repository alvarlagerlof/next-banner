/** @type {import('next').NextConfig} */

const { withBannerConfig } = require("next-banner");

module.exports = withBannerConfig({
  nextBanner: {
    domain: "next-banner-alvarlagerlof.vercel.app",
  },
});
