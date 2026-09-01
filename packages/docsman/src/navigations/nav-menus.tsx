"use client"

import { NavMenusProps } from "../types/menus"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

export function NavMenus({ label, menus }: NavMenusProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {label && { label } ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : ""}
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
