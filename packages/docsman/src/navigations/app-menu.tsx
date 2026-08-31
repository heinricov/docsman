"use client"

import { NavMenus } from "./nav-menus"
import { NavCollaps } from "./nav-collaps"
import { MainNavMenus } from "./main-nav-menus"
import { AppMenuProps, MenuSectionProps } from "../types/menus"

function renderSection(section: MenuSectionProps, selectedVersion?: string) {
  switch (section.type) {
    case "MainNavMenus":
      return <MainNavMenus label={section.label} menus={section.menus} />
    case "NavMenus":
      return <NavMenus label={section.label} menus={section.menus} />
    case "NavCollaps":
      return <NavCollaps label={section.label} menus={section.menus} />
  }
}

export function AppMenu({ menu, selectedVersion }: AppMenuProps) {
  const mainNav = menu.filter((section) => section.type === "MainNavMenus")
  const others = menu.filter((section) => section.type !== "MainNavMenus")

  const visible = others.filter(
    (section) =>
      !("grup" in section) || !section.grup || section.grup === selectedVersion
  )

  return (
    <>
      {mainNav.map((section) => (
        <div key={`${section.type}-${section.label}`}>
          {renderSection(section, selectedVersion)}
        </div>
      ))}
      {visible.map((section) => (
        <div
          key={`${section.type}-${section.label}-${"grup" in section ? (section.grup ?? "ungrouped") : "ungrouped"}`}
        >
          {renderSection(section, selectedVersion)}
        </div>
      ))}
    </>
  )
}
