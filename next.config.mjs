/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "30mb",
        },
    },
    output: "standalone",
};

export default nextConfig;
