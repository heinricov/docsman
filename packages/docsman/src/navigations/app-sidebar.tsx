"use client"

import * as React from "react"

import { NavCollaps } from "./nav-collaps"
import { NavMenus } from "./nav-menus"
import { NavSwitcher } from "./nav-switcher"
import { AppLogoSidebar } from "./app-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  Home,
  Book,
} from "lucide-react"
import { logoProps } from "../types/logo"
import { AppSosmed } from "./app-sosmed"
import { SosmedProps } from "../types/menus"

const menus = {
  teams: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  menus: {
    label: "Menus",
    menus: [
      {
        title: "Home",
        href: "/",
        icon: <Home />,
      },
      {
        title: "Docs",
        href: "/docs",
        icon: <Book />,
      },
    ],
  },
  navMain: {
    label: "Platform",
    menus: [
      {
        title: "Playground",
        url: "#",
        icon: <TerminalSquareIcon />,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: <BotIcon />,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: <BookOpenIcon />,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: <Settings2Icon />,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
  },
  projects: {
    label: "Projects",
    menus: [
      {
        title: "Design Engineering",
        href: "#",
      },
      {
        title: "Sales & Marketing",
        href: "#",
      },
      {
        title: "Travel",
        href: "#",
      },
    ],
  },
}

type AppSidebarProps = {
  className?: string
  logo?: logoProps
  sosmeds?: SosmedProps[]
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({
  className,
  sosmeds,
  logo = {},
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader>
        <AppLogoSidebar logo={logo} />
        <NavSwitcher
          className="mt-4"
          versions={menus.teams}
          defaultVersion={menus.teams[0]!}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMenus {...menus.menus} />
        <NavMenus {...menus.projects} />
        <NavCollaps {...menus.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <AppSosmed className="md:hidden" sosmeds={sosmeds} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
