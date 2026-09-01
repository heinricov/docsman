import "./globals.css"
import { fontMono, oxanium } from "@/components/providers/font-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { DocsmanLayout, MenuSectionProps } from "docsman"
import { cn } from "@/lib/utils"

import { BsArrowUpRightSquareFill } from "react-icons/bs"
import {
  Book,
  BookOpenIcon,
  BotIcon,
  Home,
  Settings2Icon,
  TerminalSquareIcon,
} from "lucide-react"

export const menus = [
  {
    type: "Header",
    menus: [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "Docs",
        href: "/docs",
      },
    ],
  },

  {
    type: "MainNavMenus",
    label: "Menus",
    hidden: true,
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
  {
    type: "NavMenus",
    label: "Documentations",
    menus: [
      {
        title: "Installasi",
        href: "/docs/installasi",
      },
      {
        title: "Use Templates",
        href: "/docs/templates",
      },
    ],
  },
  {
    type: "NavCollaps",
    label: "Platform",
    menus: [
      {
        title: "Playground",
        url: "#",
        icon: <TerminalSquareIcon />,
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
    ],
  },

  {
    type: "NavCollaps",
    label: "Data",
    menus: [
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
] satisfies MenuSectionProps[]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        oxanium.variable
      )}
    >
      <body>
        <ThemeProvider>
          <DocsmanLayout
            ShowSidebar="/docs"
            icon={<BsArrowUpRightSquareFill className="text-primary" />}
            title="Docsman"
            sideMenus={menus}
          >
            {children}
          </DocsmanLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
