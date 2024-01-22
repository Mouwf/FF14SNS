const productionConfig = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverModuleFormat: "esm",
}

const developmentConfig = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
}

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...(process.env.NODE_ENV === 'development' ? developmentConfig : productionConfig),
}
