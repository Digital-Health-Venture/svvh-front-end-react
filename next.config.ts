const path = require("path");

const nextConfig = {
  // Disable server-side rendering for pages
  output: "standalone",

  // Set environment variables
  env: {
    BUILD_ENV: process.env.BUILD_ENV,
    API_URL:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_API_URL
        : process.env.PROD_API_URL,
    COMMUNICATION_SERVICES_CONNECTION_STRING:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_COMMUNICATION_SERVICES_CONNECTION_STRING
        : process.env.PROD_COMMUNICATION_SERVICES_CONNECTION_STRING,
    BASE_URL:
      process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
        ? "https://203.154.48.241/service/api"
        : "https://virtual.samitivejhospitals.com/webservice/api",
    BASE_URL_V2:
      process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
        ? "https://203.154.48.241/service/v2"
        : "https://virtual.samitivejhospitals.com/webservice/v2",
    WELLSUPERAPP_CUSTOMER_UPDATE_URL:
      process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
        ? "https://totalsol-uat-dhv.samitivejhospitals.com/total-health-solution/customer/update"
        : "https://totalsol-dhv.samitivejhospitals.com/total-health-solution/customer/update",
    WELLSUPERAPP_GUARDIAN_UPDATE_URL:
      process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
        ? "https://totalsol-uat-dhv.samitivejhospitals.com/total-health-solution/customer/guardian/update"
        : "https://totalsol-dhv.samitivejhospitals.com/total-health-solution/customer/guardian/update",
    WEB_PAYMENT_URL:
      process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
        ? "https://203.154.48.241/service/webpayment/index.html"
        : "https://virtual.samitivejhospitals.com/webpayment/index.html",
    WEB_PAYMENT_SUCCESS_URL:
      process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
        ? "https://203.154.48.241/service/webpayment/success.html"
        : "https://virtual.samitivejhospitals.com/webpayment/success.html",
    PRECALL_ENABLED: "true",
  },

  // Webpack configuration
  webpack: (
    config: import("webpack").Configuration,
    { isServer }: { isServer: boolean }
  ): import("webpack").Configuration => {
    if (!isServer) {
      if (config.resolve) {
        config.resolve.fallback = { fs: false };
      }
    }

    // Ensure proper module resolution
    config.module?.rules?.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false, // Prevent Webpack from misinterpreting ESM modules
      },
    });
    return config;
  },

  // Base path for routing
  basePath:
    process.env.BUILD_ENV === "dev" || process.env.BUILD_ENV === "uat"
      ? "/v2"
      : "/webview/v2",

  // Custom headers and scripts injection via _document.js
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },

  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
