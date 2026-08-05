import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No remote image hosts are needed: every image and video is served from
  // public/. `remotePatterns` previously whitelisted images.unsplash.com for the
  // placeholder stills — those are gone, so the entry is removed rather than
  // left open (`configure-remote-image-domains`: whitelist, never allow-all).
};

export default nextConfig;
