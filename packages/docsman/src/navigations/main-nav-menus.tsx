"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { MenuItemProps } from "../types/menus"

export function MainNavMenus({
  label,
  menus,
}: {
  label: string
  menus: MenuItemProps[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-lg md:text-sm">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((menu) => (
          <SidebarMenuItem key={menu.title}>
            <SidebarMenuButton
              className="text-lg md:text-sm"
              render={<a href={menu.href} />}
            >
              {menu.icon}
              <span>{menu.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
