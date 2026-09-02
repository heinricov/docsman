import { getAllMdxSlugs, getMdxFile } from "../lib/mdx"
import { Separator } from "../ui/separator"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PaginationSectionProps {
  dir?: string
  slug?: string
}

interface PaginationItem {
  href: string
  label: string
}

/**
 * Mengubah slug menjadi href final untuk navigasi docs.
 */
function resolvePageHref(dir: string, slug: string): string {
  if (slug === "index") {
    return dir
  }

  return `${dir}/${slug}`.replace(/\/+/g, "/")
}

/**
 * Mengubah slug menjadi label fallback jika title frontmatter tidak tersedia.
 */
function formatSlugLabel(slug: string): string {
  const lastSegment = slug.split("/").pop() || slug

  return lastSegment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/**
 * Mengambil title dari frontmatter MDX bila tersedia, lalu memakai
 * slug sebagai fallback agar label pagination tetap terbentuk.
 */
function getPageLabel(dir: string, slug: string): string {
  const file = getMdxFile(dir, slug)
  if (!file) {
    return formatSlugLabel(slug)
  }

  const frontmatterMatch = file.raw.match(/^---\s*\n([\s\S]*?)\n---/)
  const titleMatch = frontmatterMatch?.[1]?.match(/^title:\s*(.+)$/m)
  const rawTitle = titleMatch?.[1]?.trim()

  if (!rawTitle) {
    return formatSlugLabel(slug)
  }

  return rawTitle.replace(/^['"]|['"]$/g, "")
}

/**
 * Mengelompokkan slug berdasarkan root route saat ini.
 * - top-level docs hanya bernavigasi ke slug tanpa subfolder
 * - subfolder seperti `components/*` hanya bernavigasi ke sibling dalam folder itu
 */
function getSiblingSlugs(dir: string, currentSlug: string): string[] {
  const allSlugs = getAllMdxSlugs(dir).sort((left, right) =>
    left.localeCompare(right)
  )

  const currentRoot = currentSlug.includes("/") ? currentSlug.split("/")[0] : ""

  return allSlugs.filter((slug) => {
    const slugRoot = slug.includes("/") ? slug.split("/")[0] : ""
    return slugRoot === currentRoot
  })
}

/**
 * Menyusun item previous dan next berdasarkan posisi halaman aktif
 * di dalam root route yang sama.
 */
function getPaginationItems(
  dir: string,
  slug: string
): {
  previousPage?: PaginationItem
  nextPage?: PaginationItem
} {
  const siblingSlugs = getSiblingSlugs(dir, slug)
  const currentIndex = siblingSlugs.indexOf(slug)

  if (currentIndex === -1) {
    return {}
  }

  const previousSlug = siblingSlugs[currentIndex - 1]
  const nextSlug = siblingSlugs[currentIndex + 1]

  return {
    previousPage: previousSlug
      ? {
          href: resolvePageHref(dir, previousSlug),
          label: getPageLabel(dir, previousSlug),
        }
      : undefined,
    nextPage: nextSlug
      ? {
          href: resolvePageHref(dir, nextSlug),
          label: getPageLabel(dir, nextSlug),
        }
      : undefined,
  }
}

/**
 * Merender navigasi previous/next antar halaman dokumentasi
 * dengan cakupan hanya di root route yang sama.
 */
export function PaginationSection({
  dir = "/docs",
  slug = "index",
}: PaginationSectionProps) {
  const { previousPage, nextPage } = getPaginationItems(dir, slug)

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className="flex w-full flex-col justify-center">
      <Separator className="my-8" />

      <nav aria-label="Pagination" className="grid gap-3 sm:grid-cols-2">
        {previousPage ? (
          <a
            href={previousPage.href}
            className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-muted-foreground/40"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3.5" />
              Previous
            </span>
            <span className="text-sm font-medium">{previousPage.label}</span>
          </a>
        ) : (
          <div className="hidden sm:block" />
        )}
        {nextPage ? (
          <a
            href={nextPage.href}
            className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-muted-foreground/40"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Next
              <ArrowRight className="size-3.5" />
            </span>
            <span className="text-sm font-medium">{nextPage.label}</span>
          </a>
        ) : null}
      </nav>
    </div>
  )
}
