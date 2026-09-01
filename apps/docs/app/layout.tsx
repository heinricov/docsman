import "./globals.css"
import { fontMono, oxanium } from "@/components/providers/font-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { DocsmanLayout, MenuSectionProps } from "docsman"
import { cn } from "@/lib/utils"

import { BsArrowUpRightSquareFill } from "react-icons/bs"
import { Component } from "lucide-react"

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
    type: "NavCombine",
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
