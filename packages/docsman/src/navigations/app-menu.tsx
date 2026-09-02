"use client"

import { NavMenus } from "./nav-menus"
import { NavCollaps } from "./nav-collaps"
import { NavCombine } from "./nav-combine"
import { MainNavMenus } from "./main-nav-menus"
import { AppMenuProps, MenuSectionProps } from "../types/menus"

function renderSection(section: MenuSectionProps) {
  const label = section.label ?? ""
  switch (section.type) {
    case "MainNavMenus":
      return <MainNavMenus label={label} menus={section.menus} />
    case "NavMenus":
      return <NavMenus label={label} menus={section.menus} />
    case "NavCollaps":
      return <NavCollaps label={label} menus={section.menus} />
    case "NavCombine":
      return <NavCombine label={label} menus={section.menus} />
  }
}

export function AppMenu({ menu, selectedVersion }: AppMenuProps) {
  const mainNav = menu.filter((section) => section.type === "MainNavMenus")
  const others = menu.filter(
    (section) =>
      section.type !== "MainNavMenus" &&
      section.type !== "Header" &&
      section.type !== "Footer" &&
      !section.hidden
  )

  const visible = others.filter(
    (section) =>
      !("grup" in section) || !section.grup || section.grup === selectedVersion
  )

  return (
    <>
      {mainNav.map((section) => (
        <div
          key={`${section.type}-${section.label}`}
          className={section.hidden ? "md:hidden" : ""}
        >
          {renderSection(section)}
        </div>
      ))}
      {visible.map((section) => (
        <div
          key={`${section.type}-${section.label}-${"grup" in section ? (section.grup ?? "ungrouped") : "ungrouped"}`}
        >
          {renderSection(section)}
        </div>
      ))}
    </>
  )
}
