/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: [/^~/],
  future: {
    unstable_clientSideHydration: true,
    unstable_vanillaExtract: true,
  },
  // Add this to handle .client suffix
  ignoredRouteFiles: ["**/.*", "**/*.client.*"],
  tailwind: true,
  postcss: true,
  appDirectory: "app",
}