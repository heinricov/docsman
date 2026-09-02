import fs from "fs"
import path from "path"

export interface MdxFile {
  slug: string
  raw: string
}

function findContentDir(): string {
  const cwd = process.cwd()

  // Walk up from cwd looking for content/ directory
  let dir = cwd
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, "content")
    if (fs.existsSync(candidate)) {
      // Verify it has an 'docs' or 'blogs' subdirectory (mdx content)
      const entries = fs.readdirSync(candidate)
      if (entries.includes("docs") || entries.includes("blogs")) {
        return candidate
      }
    }
    dir = path.dirname(dir)
  }

  return path.join(cwd, "content")
}

export function getMdxFiles(dir: string = "/"): MdxFile[] {
  const contentDir = findContentDir()
  const targetDir = path.join(contentDir, dir)

  if (!fs.existsSync(targetDir)) {
    return []
  }

  const files: MdxFile[] = []

  function readDir(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        readDir(fullPath)
      } else if (entry.name.endsWith(".mdx")) {
        const raw = fs.readFileSync(fullPath, "utf-8")

        const relativePath = path.relative(targetDir, fullPath)
        const slug = relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/")

        files.push({
          slug: slug || "index",
          raw,
        })
      }
    }
  }

  readDir(targetDir)
  return files
}

export function getMdxFile(dir: string, slug: string): MdxFile | null {
  const contentDir = findContentDir()
  const targetDir = path.join(contentDir, dir)
  const filePath = path.join(targetDir, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, "utf-8")
  return { slug, raw }
}

export function getAllMdxSlugs(dir: string = "/"): string[] {
  const files = getMdxFiles(dir)
  return files.map((file) => file.slug)
}
