import { cn } from "../lib/utils"
import { AppLogoProps } from "../types/logo"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { TerminalIcon } from "lucide-react"

export function AppLogoSidebar({ className }: { className?: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn("hover:bg-none", className)}
          size="lg"
          render={<a href="#" />}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <TerminalIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Acme Inc</span>
            <span className="truncate text-xs">Enterprise</span>
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
