/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/tck',
    output: 'export',
    // output: 'standalone',
    images: {
        unoptimized: true,
    },
    rewrites: () => {
        return [
            {
                source: '/magicvideo/:path*',
                destination: 'https://magictest.dinglitec.com/magicvideo/:path*',
                basePath: false,
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
