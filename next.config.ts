import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Story photos, logos, and the wordmark are on Supabase Storage.
    // (`configure-remote-image-domains`: whitelist, never allow-all.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "olegixjqnmghjskciikm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
