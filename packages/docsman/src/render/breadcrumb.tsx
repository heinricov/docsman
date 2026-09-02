"use client"

import { Fragment, useMemo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { usePathname } from "../hooks/use-pathname"

/**
 * Mengubah segmen URL menjadi label yang lebih ramah dibaca
 * untuk ditampilkan pada breadcrumb.
 */
function formatBreadcrumbLabel(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function BreadcrumbSection() {
  const pathname = usePathname()

  /**
   * Menyusun daftar breadcrumb berdasarkan pathname aktif agar
   * setiap level route dapat dinavigasi oleh pengguna.
   */
  const items = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)

    return [
      {
        href: "/",
        label: "Home",
      },
      ...segments.map((segment: string, index: number) => ({
        href: `/${segments.slice(0, index + 1).join("/")}`,
        label: formatBreadcrumbLabel(segment),
      })),
    ]
  }, [pathname])

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1

          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
