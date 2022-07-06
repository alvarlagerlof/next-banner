/** @type {import('next').NextConfig} */

const { withNextBanner } = require("next-banner");

module.exports = withNextBanner({
  nextBanner: {
    domain: "https://" + process.env.NEXT_PUBLIC_VERCEL_URL,
  },
});
