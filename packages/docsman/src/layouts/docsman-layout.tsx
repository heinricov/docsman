"use client"

import { usePathname } from "next/navigation"
import { LayoutFloating } from "./layout-floating"
import { LayoutBasic } from "./layout-basic"
import { LayoutProps } from "../types/layouts"
import { SquareText } from "lucide-react"
import { AppHeader } from "../navigations/app-header"
import { AppFooter } from "../navigations/app-footer"

type DocsManLayoutProps = LayoutProps

function matchPath(pathname: string, show: string | string[]) {
  const allowed = Array.isArray(show) ? show : [show]
  return allowed.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function DocsmanLayout({
  variant = "basic",
  children,
  title,
  icon = <SquareText className="size-5! text-primary" />,
  theme = true,
  search = true,
  HeaderMenus,
  FooterMenus,
  logo = {
    icon,
    title,
    description: "Version Beta",
  },
  sosmeds,
  sideMenus,
  grup,
  ShowSidebar,
  Header,
  Footer,
}: DocsManLayoutProps) {
  const pathname = usePathname()
  const sidebarDesktopHidden =
    ShowSidebar !== undefined && !matchPath(pathname, ShowSidebar)

  const resolvedHeaderMenus =
    HeaderMenus ??
    (sideMenus ?? [])
      .filter((section) => section.type === "Header" && !section.hidden)
      .flatMap((section) =>
        section.menus.map((menu) => ({
          title: menu.title,
          href: menu.href ?? "#",
        }))
      )
  const resolvedFooterMenus =
    FooterMenus ??
    (sideMenus ?? [])
      .filter((section) => section.type === "Footer" && !section.hidden)
      .flatMap((section) =>
        section.menus.map((menu) => ({
          title: menu.title,
          href: menu.href ?? "#",
        }))
      )

  const resolvedHeader =
    Header ??
    (
      <AppHeader
        logo={logo}
        theme={theme}
        search={search}
        className={variant === "basic" ? "" : "md:block"}
        menus={resolvedHeaderMenus}
        sosmeds={sosmeds}
        sidebarHidden={sidebarDesktopHidden}
      />
    )

  const resolvedFooter =
    Footer ??
    (
      <AppFooter
        logo={logo}
        title={title}
        menus={resolvedFooterMenus}
        sosmeds={sosmeds}
      />
    )

  const layoutProps = {
    Header: resolvedHeader,
    HeaderMenus: resolvedHeaderMenus,
    Footer: resolvedFooter,
    FooterMenus: resolvedFooterMenus,
    icon,
    title,
    theme,
    search,
    children,
    sosmeds,
    sideMenus,
    grup,
    sidebarDesktopHidden,
  }
  switch (variant) {
    case "floating":
      return <LayoutFloating {...layoutProps} />

    case "basic":
    default:
      return <LayoutBasic {...layoutProps} />
  }
}
