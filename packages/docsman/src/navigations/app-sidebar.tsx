"use client"

import * as React from "react"

import { NavSwitcher } from "./nav-switcher"
import { AppLogoSidebar } from "./app-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"
import { AppSosmed } from "./app-sosmed"
import { AppMenu } from "./app-menu"
import { AppSidebarProps } from "../types/app-sidebar"
import { GrupProps } from "../types/menus"

export function AppSidebar({
  className,
  sosmeds,
  logo,
  menus = [],
  grup,
  ...props
}: AppSidebarProps) {
  const groups = React.useMemo<GrupProps[]>(() => {
    if (grup && grup.length > 0) return grup
    return Array.from(
      new Set(
        menus
          .filter((section) => "grup" in section && section.grup)
          .map((section) => ("grup" in section ? section.grup : undefined))
          .filter(Boolean) as string[]
      )
    ).map((title) => ({ title }))
  }, [grup, menus])

  const [selectedGroup, setSelectedGroup] = React.useState<GrupProps | null>(
    groups[0] ?? null
  )
  const selectedVersion = selectedGroup?.title ?? ""

  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader>
        <AppLogoSidebar logo={logo} />
        {selectedGroup && (
          <NavSwitcher
            className="mt-4"
            options={groups}
            selected={selectedGroup}
            onSelect={setSelectedGroup}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <AppMenu menu={menus} selectedVersion={selectedVersion} />
      </SidebarContent>
      <SidebarFooter>
        <AppSosmed className="md:hidden" sosmeds={sosmeds} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
