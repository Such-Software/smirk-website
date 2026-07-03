import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the Nostr feed at the feed.smirk.cash subdomain root (one app, two
  // hosts). smirk.cash/feed keeps working directly.
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "feed.smirk.cash" }],
        destination: "/feed",
      },
    ];
  },
};

export default nextConfig;
