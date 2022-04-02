/** @type {import('next').NextConfig} */

const { withNextBanner } = require("next-banner");

module.exports = withNextBanner({
  nextBanner: {
    domain: "next-banner-alvarlagerlof.vercel.app",
  },
});
