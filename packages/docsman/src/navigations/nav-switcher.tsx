"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { cn } from "../lib/utils"
import { GrupProps } from "../types/menus"

export function NavSwitcher({
  options,
  selected,
  onSelect,
  className,
}: {
  options: GrupProps[]
  selected: GrupProps
  onSelect: (group: GrupProps) => void
  className?: string
}) {
  return (
    <SidebarMenu className={cn("hover:bg-none", className)}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full rounded-md border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {selected.icon ?? <ChevronsUpDown className="size-4" />}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{selected.title}</span>
                  <span className="">{selected.description}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
          >
            {options.map((option) => (
              <DropdownMenuItem
                key={option.title}
                onClick={() => onSelect(option)}
              >
                {option.icon}
                {option.title}{" "}
                {option.title === selected.title && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
