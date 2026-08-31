"use client"

import { AppSidebar } from "../navigations/app-sidebar"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { LayoutProps } from "../types/layouts"

export const iframeHeight = "800px"

export function LayoutFloating({
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
  sideMenus,
}: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar logo={logo} variant="floating" menus={sideMenus} />
      <SidebarInset>
        {Header}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        {Footer}
      </SidebarInset>
    </SidebarProvider>
  )
}
