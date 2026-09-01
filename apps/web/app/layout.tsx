import { Geist_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "docsman/lib/utils"
import { DocsmanLayout, MenuSectionProps } from "docsman/layouts"
import {
  Book,
  BookOpenIcon,
  BotIcon,
  Globe,
  Home,
  Settings2Icon,
  TerminalSquareIcon,
} from "lucide-react"

import { FaYoutube, FaGithub } from "react-icons/fa"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const mysosmeds = [
  {
    title: "Youtube",
    icon: <FaYoutube className="h-5 w-5 text-muted-foreground" />,
    href: "/",
  },
  {
    title: "Github",
    icon: <FaGithub className="h-5 w-5 text-muted-foreground" />,
    href: "/",
  },
]

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
    grup: "1.0.1",
    type: "NavCollaps",
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
    ],
  },
  {
    grup: "1.2.1",
    type: "NavMenus",
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
  {
    grup: "1.3.3",
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
        roboto.variable
      )}
    >
      <body>
        <ThemeProvider>
          <DocsmanLayout
            title="Web"
            icon={<Globe />}
            sosmeds={mysosmeds}
            sideMenus={menus}
            ShowSidebar="/docs"
          >
            {children}
          </DocsmanLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
