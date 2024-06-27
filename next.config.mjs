/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@langchain/langgraph"],
  },
};

export default nextConfig;
