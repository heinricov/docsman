import { cn } from "../lib/utils"
import { AppLogoSidebarProps, AppLogoProps } from "../types/logo"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

export function AppLogoSidebar({ logo = {} }: AppLogoSidebarProps) {
  return (
    <SidebarMenu className="md:hidden">
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn("hover:bg-none", logo.className)}
          size="lg"
          render={<a href="#" />}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {logo.icon}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{logo.title}</span>
            <span className="truncate text-xs">{logo.description}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppLogo({ icon, title }: AppLogoProps) {
  return (
    <a href="#" className="flex items-center gap-2">
      {icon}
      <span className="text-base font-semibold">{title}</span>
    </a>
  )
}
