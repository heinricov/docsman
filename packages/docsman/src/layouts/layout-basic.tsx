"use client"

import { AppSidebar } from "../navigations/app-sidebar"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { LayoutProps } from "../types/layouts"

export const iframeHeight = "800px"
export const description = "A sidebar with a header and a search form."

export function LayoutBasic({
  children,
  icon,
  title,
  logo = {
    icon,
    title,
    description: "Version Beta",
  },
  Header,
  Footer,
}: LayoutProps) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        {Header}
        <div className="flex flex-1">
          <AppSidebar
            logo={logo}
            className="top-[calc(var(--header-height)-0.5rem)] h-[calc(100svh-var(--header-height))]!"
          />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      {Footer}
    </div>
  )
}
