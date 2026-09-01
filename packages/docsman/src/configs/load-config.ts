import path from "node:path"
import { pathToFileURL } from "node:url"

export async function loadDocsmanConfig() {
  const configPath = path.join(process.cwd(), "docsman.config.ts")

  try {
    const config = await import(pathToFileURL(configPath).href)

    return config.default
  } catch {
    return {}
  }
}
