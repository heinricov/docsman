"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { NavCollapsProps } from "../types/menus"

export function NavCollaps({ label, menus }: NavCollapsProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((menu) => (
          <Collapsible
            key={menu.title}
            defaultOpen={menu.isActive}
            render={<SidebarMenuItem />}
          >
            <SidebarMenuButton
              tooltip={menu.title}
              render={<CollapsibleTrigger />}
            >
              {menu.icon}
              <a href={menu.href}>
                <span>{menu.title}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuAction
              render={<CollapsibleTrigger />}
              className="aria-expanded:rotate-90"
            >
              <ChevronRightIcon />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
            {menu.items?.length ? (
              <>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {menu.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<a href={subItem.url} />}>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
