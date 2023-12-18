import { config } from '@netlify/remix-edge-adapter'

const productionConfig = {
  ...config,
}

const developmentConfig = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
}

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...(process.env.NODE_ENV === 'development' ? developmentConfig : productionConfig),
}
