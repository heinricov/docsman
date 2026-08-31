"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { MenuItemProps } from "../types/menus"

export function MainNavMenus({ label, menus }: { label: string; menus: MenuItemProps[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((menu) => (
          <SidebarMenuItem key={menu.title}>
            <SidebarMenuButton render={<a href={menu.href} />}>
              {menu.icon}
              <span>{menu.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
