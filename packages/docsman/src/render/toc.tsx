"use client"
import { useEffect, useState } from "react"
import { AlignLeft } from "lucide-react"
import { cn } from "../lib/utils"

type TocItem = {
  id: string
  text: string
  level: 2 | 3 | 4
}

const HEADING_SELECTOR = "h2, h3, h4"
const TOC_EXCLUDE_SELECTOR = "[data-toc-exclude='true'], pre, code"
const HEADING_SCROLL_OFFSET = 112

/**
 * Mengubah teks heading menjadi id yang stabil agar bisa dipakai
 * sebagai anchor link dan target active state pada TOC.
 */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

/**
 * Menentukan apakah heading berada di dalam area yang harus dikecualikan
 * dari TOC, misalnya heading milik wrapper komponen, card demo, atau code.
 */
function shouldExcludeHeading(heading: HTMLElement): boolean {
  return heading.closest(TOC_EXCLUDE_SELECTOR) !== null
}

export function Toc() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)

  /**
   * Mengumpulkan heading h2 sampai h4 dari dokumen, lalu memastikan
   * setiap heading memiliki id agar bisa dipakai oleh anchor TOC.
   */
  useEffect(() => {
    const syncHeadings = () => {
      const headingElements = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR)
      )

      const slugCount = new Map<string, number>()

      const nextItems = headingElements
        .map((heading) => {
          if (shouldExcludeHeading(heading)) {
            return null
          }

          const text = heading.textContent?.trim()
          if (!text) {
            return null
          }

          const baseId = heading.id || slugifyHeading(text)
          const seenCount = slugCount.get(baseId) ?? 0
          const nextId = seenCount === 0 ? baseId : `${baseId}-${seenCount}`

          slugCount.set(baseId, seenCount + 1)

          if (!heading.id) {
            heading.id = nextId
          }

          heading.style.scrollMarginTop = `${HEADING_SCROLL_OFFSET}px`

          const level = Number(heading.tagName.replace("H", "")) as 2 | 3 | 4

          return {
            id: heading.id,
            text,
            level,
          }
        })
        .filter((item): item is TocItem => item !== null)

      setItems(nextItems)
      setActiveSection(nextItems[0]?.id ?? null)
    }

    const frameId = window.requestAnimationFrame(syncHeadings)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  /**
   * Memantau heading yang sedang masuk viewport untuk mengubah
   * active state TOC secara otomatis saat pengguna scroll.
   */
  useEffect(() => {
    if (items.length === 0) {
      return
    }

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    /**
     * Menentukan heading aktif berdasarkan heading terakhir yang sudah
     * melewati offset scroll, sehingga sinkron dengan header sticky.
     */
    const updateActiveSection = () => {
      const currentScrollY = window.scrollY + HEADING_SCROLL_OFFSET

      const nextActiveHeading =
        headingElements.find((element) => {
          const nextSibling =
            headingElements[headingElements.indexOf(element) + 1]
          const currentTop = element.offsetTop
          const nextTop = nextSibling?.offsetTop ?? Number.POSITIVE_INFINITY

          return currentScrollY >= currentTop && currentScrollY < nextTop
        }) ?? headingElements[0]

      if (nextActiveHeading) {
        setActiveSection((previousActiveSection) =>
          previousActiveSection === nextActiveHeading.id
            ? previousActiveSection
            : nextActiveHeading.id
        )
      }
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] self-start lg:ml-20 lg:block">
      <span className="flex items-center gap-2 text-sm">
        <AlignLeft className="h-4 w-4" />
        On this page
      </span>
      <nav className="mt-3 h-full overflow-y-auto pr-2 text-sm">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-1 transition-colors duration-200",
                  item.level === 2 && "pl-0",
                  item.level === 3 && "pl-3",
                  item.level === 4 && "pl-6",
                  activeSection === item.id
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
