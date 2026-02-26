import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/example',
        destination: '/conversation/meeting-new-people',
        permanent: false,
      },
      {
        source: '/example/conversation/:conversationId',
        destination: '/conversation/:conversationId',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
