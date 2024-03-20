/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    output: 'standalone',
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
    },
    plugins: [
        "postcss-flexbugs-fixes",
        [
            "postcss-preset-env",
            {
                "autoprefixer": {
                    "flexbox": "no-2009"
                },
                "stage": 3,
                "features": {
                    "custom-properties": false
                }
            }
        ]
    ]
};

export default nextConfig;
