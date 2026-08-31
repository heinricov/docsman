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

export function AppSidebar({
  className,
  sosmeds,
  logo,
  menus = [],
  ...props
}: AppSidebarProps) {
  const versions = React.useMemo(
    () =>
      Array.from(
        new Set(
          menus
            .filter((section) => "grup" in section && section.grup)
            .map((section) => ("grup" in section ? section.grup : undefined))
            .filter(Boolean) as string[]
        )
      ),
    [menus]
  )
  const [selectedVersion, setSelectedVersion] = React.useState(
    versions[0] ?? ""
  )

  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader>
        <AppLogoSidebar logo={logo} />
        {versions.length > 0 && (
          <NavSwitcher
            className="mt-4"
            versions={versions}
            selectedVersion={selectedVersion}
            onSelect={setSelectedVersion}
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
