import { config } from '@netlify/remix-edge-adapter'
import { resolve } from 'node:path'

const productionConfig = {
  ...config,
  server: './app/entry.server.netlify.tsx',
}

const developmentConfig = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
}

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...(process.env.NODE_ENV === 'development' ? developmentConfig : productionConfig),
}
