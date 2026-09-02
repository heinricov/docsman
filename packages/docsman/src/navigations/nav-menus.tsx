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
      {label && { label } ? (
        <SidebarGroupLabel className="text-lg md:text-sm">
          {label}
        </SidebarGroupLabel>
      ) : (
        ""
      )}
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
