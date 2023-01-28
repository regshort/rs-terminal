/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["gutils"]);
const PerspectivePlugin = require("@finos/perspective-webpack-plugin");
const removeImports = require("next-remove-imports")();

const nextConfig = withTM({
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: { esmExternals: true },
  reactStrictMode: false,
  swcMinify: true,
  images:{
    domains:  [process.env.NEXT_PUBLIC_CDN]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  webpack(config) {
    config.plugins.push(
      new PerspectivePlugin()
    );
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
})

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

module.exports = removeImports(withPWA(nextConfig));