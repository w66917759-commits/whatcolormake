import type { NextConfig } from "next";

const legacyColorRedirects = [
  {
    source: "/what-color-make-blue",
    destination: "/what-color-makes-it-blue",
    permanent: true,
  },
  {
    source: "/what-color-make-green",
    destination: "/what-color-makes-it-green",
    permanent: true,
  },
  {
    source: "/what-color-make-orange",
    destination: "/what-color-makes-it-orange",
    permanent: true,
  },
  {
    source: "/what-color-make-purple",
    destination: "/what-color-makes-it-purple",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.whatcolormake.com",
          },
        ],
        destination: "https://whatcolormake.com/:path*",
        permanent: true,
      },
      ...legacyColorRedirects,
    ];
  },
};

export default nextConfig;
