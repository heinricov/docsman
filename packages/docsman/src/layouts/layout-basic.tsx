"use client"

import { AppSidebar } from "../navigations/app-sidebar-basic"
import { AppHeader } from "../navigations/app-header-basic"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { LayoutBasicProps } from "../types/layouts"
import { SquareText } from "lucide-react"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export function LayoutBasic({
  children,
  icon = <SquareText className="size-5! text-primary" />,
  title = "Acme Inc.",
  theme = true,
  search = true,
  Header = (
    <AppHeader icon={icon} title={title} theme={theme} search={search} />
  ),
}: LayoutBasicProps) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        {Header}
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
