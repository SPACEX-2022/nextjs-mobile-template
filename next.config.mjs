/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    rewrites: () => {
        return [
            {
                source: '/api/:path*',
                destination: 'https://magictest.dinglitec.com/magicvideo/:path*',
            }
        ]
    }
};

export default nextConfig;
