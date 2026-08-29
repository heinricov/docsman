import { AppSidebar } from "../navigations/app-sidebar-basic"
import { AppHeader } from "../navigations/app-header-basic"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export function LayoutBasic({
  children,
  Header = <AppHeader />,
}: {
  Header?: React.ReactNode
  children: React.ReactNode
}) {
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
