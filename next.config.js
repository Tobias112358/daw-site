/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        console.log(options.webpack.version); // Should be webpack v5 now
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };
        return config;
    },
}

module.exports = nextConfig
