import { AppSidebar } from "../navigations/app-sidebar-floating"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { AppHeader } from "../navigations/app-header-floating"

export function LayoutFloating({
  children,
  Header = <AppHeader />,
}: {
  Header?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {Header}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
