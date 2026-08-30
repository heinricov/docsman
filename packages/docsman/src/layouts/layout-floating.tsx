"use client"

import { AppSidebar } from "../navigations/app-sidebar-floating"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { AppHeader } from "../navigations/app-header"
import { AppFooter } from "../navigations/app-footer"
import { SquareText } from "lucide-react"
import { LayoutBasicProps } from "../types/layouts"

export function LayoutFloating({
  children,
  icon = <SquareText className="size-5! text-primary" />,
  title = "Acme Inc.",
  theme = true,
  search = true,
  Header = (
    <AppHeader
      icon={icon}
      title={title}
      theme={theme}
      search={search}
      className="md:flex"
    />
  ),
  Footer = <AppFooter icon={icon} title={title} />,
}: LayoutBasicProps) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {Header}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
          {Footer}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
