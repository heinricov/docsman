import path from "node:path"
import type { NextConfig } from "next"

const appsWebDir = path.dirname(new URL(import.meta.url).pathname)
const monorepoRoot = path.resolve(appsWebDir, "../..")

const nextConfig: NextConfig = {
  transpilePackages: ["docsman"],
  turbopack: {
    root: monorepoRoot,
  },
}

export default nextConfig
