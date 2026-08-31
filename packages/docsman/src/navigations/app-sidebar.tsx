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
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react"
import { logoProps } from "../types/logo"

const menus = {
  teams: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
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
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

type AppSidebarProps = {
  className?: string
  logo?: logoProps
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({
  className,
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
        <NavMenus projects={menus.projects} />
        <NavCollaps items={menus.navMain} />
      </SidebarContent>
      <SidebarFooter>{/* footer */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
