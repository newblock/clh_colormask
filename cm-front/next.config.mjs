/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        "@ant-design",
        "antd",
        "rc-util",
        "rc-pagination",
        "rc-picker",
    ],
    reactStrictMode: false,
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            net: false,
            dns: false,
            child_process: false,
            tls: false,
        };
        return config;
    },
};

export default nextConfig;
