import "./globals.css"
import { fontMono, oxanium } from "@/components/providers/font-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { DocsmanLayout, MenuSectionProps } from "docsman"
import { cn } from "@/lib/utils"

import { Book, Component, Home } from "lucide-react"
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
    label: "Documentation",
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
    menus: [
      {
        title: "Components",
        url: "#",
        icon: <Component />,
        isActive: true,
        items: [
          {
            title: "Alert",
            url: "#",
          },
          {
            title: "Card Section",
            url: "#",
          },
          {
            title: "Code Block",
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
