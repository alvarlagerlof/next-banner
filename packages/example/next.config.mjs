/** @type {import('next').NextConfig} */

import { withNextBanner } from "next-banner";

module.exports = withNextBanner({
  nextBanner: {
    domain: "https://" + process.env.NEXT_PUBLIC_VERCEL_URL,
  },
});
