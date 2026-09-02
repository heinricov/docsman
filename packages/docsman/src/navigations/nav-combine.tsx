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
import { NavCombineProps } from "../types/menus"

export function NavCombine({ label, menus }: NavCombineProps) {
  return (
    <SidebarGroup>
      {label && { label } ? (
        <SidebarGroupLabel className="text-lg md:text-sm">
          {label}
        </SidebarGroupLabel>
      ) : (
        ""
      )}
      <SidebarMenu>
        {menus.map((menu) =>
          menu.items?.length ? (
            <Collapsible
              key={menu.title}
              defaultOpen={menu.isActive}
              render={<SidebarMenuItem />}
            >
              <SidebarMenuButton
                tooltip={menu.title}
                render={<CollapsibleTrigger />}
                className="text-lg md:text-sm"
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
              <CollapsibleContent>
                <SidebarMenuSub>
                  {menu.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        className="text-lg md:text-sm"
                        render={<a href={subItem.url} />}
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={menu.title}>
              <SidebarMenuButton
                className="text-lg md:text-sm"
                render={<a href={menu.href} />}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
