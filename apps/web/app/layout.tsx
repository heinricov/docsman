import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DocsmanLayout, MenuSectionProps } from "docsman/layouts"
import {
  Book,
  BookAIcon,
  BookOpenIcon,
  BotIcon,
  Home,
  MailIcon,
  PenBox,
  Settings2Icon,
  TerminalSquareIcon,
} from "lucide-react"
import Image from "next/image"

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
    type: "Footer",
    menus: [
      {
        title: "Policy",
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
    grup: "Nav Collaps",
    type: "NavCollaps",
    label: "Nav Collaps",
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
    ],
  },
  {
    grup: "Nav Menus",
    type: "NavMenus",
    label: "Nav Menus",
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
  {
    grup: "Nav Combine",
    type: "NavCombine",
    label: "Nav Combine",
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

const grupData = [
  {
    title: "Nav Collaps",
    description: "v 0.0.1",
    icon: <MailIcon />,
  },
  {
    title: "Nav Menus",
    description: "v 0.0.1",
    icon: <BookAIcon />,
  },
  {
    title: "Nav Combine",
    description: "v 0.0.1",
    icon: <PenBox />,
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <DocsmanLayout
            title="Web"
            icon={
              <>
                <Image
                  src="/docman.png"
                  width={22}
                  height={22}
                  alt="Docsman logo"
                />
              </>
            }
            sideMenus={menus}
            ShowSidebar="/docs"
            grup={grupData}
          >
            {children}
          </DocsmanLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
