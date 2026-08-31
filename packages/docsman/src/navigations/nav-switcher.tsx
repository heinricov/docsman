"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { cn } from "../lib/utils"

export function NavSwitcher({
  versions,
  selectedVersion,
  onSelect,
  className
}: {
  versions: string[]
  selectedVersion: string
  onSelect: (version: string) => void
  className?: string
}) {

  return (
    <SidebarMenu className={cn("hover:bg-none",className)}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full rounded-md border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span className="">v{selectedVersion}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onClick={() => onSelect(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
