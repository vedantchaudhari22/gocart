/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true
    },
    experimental: {
    turbo: false, // force webpack
  },
};

export default nextConfig;
