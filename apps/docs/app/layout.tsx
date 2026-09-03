import "./globals.css"
import { fontMono, oxanium } from "@/components/providers/font-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { DocsmanLayout, MenuSectionProps } from "docsman"
import { cn } from "@/lib/utils"

import { Book, Home } from "lucide-react"
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
        title: "Get Started",
        href: "/docs/getstarted",
      },
      {
        title: "Init",
        href: "/docs/init",
      },
      {
        title: "Use Templates",
        href: "/docs/templates",
      },
      {
        title: "DocsmanLayout",
        href: "/docs/docsman-layout",
      },
      {
        title: "DocmanLayoutRender",
        href: "/docsman-layout-render",
      },
      {
        title: "Deploy",
        href: "/docs/templates",
      },
    ],
  },
  {
    type: "NavMenus",
    label: "Components",
    menus: [
      {
        title: "Alert Section",
        href: "/docs/components/alert-section",
      },
      {
        title: "Card Section",
        href: "/docs/components/card-section",
      },
      {
        title: "Code Block",
        href: "/docs/components/code-block",
      },
      {
        title: "Command Code",
        href: "/docs/components/command-code",
      },
      {
        title: "Componen Preview",
        href: "/docs/components/component-preview",
      },
      {
        title: "File Tree",
        href: "/docs/components/file-tree",
      },
      {
        title: "Logo Section",
        href: "/docs/components/logo-section",
      },
      {
        title: "Steps Section",
        href: "/docs/components/steps-section",
      },
      {
        title: "Table Props",
        href: "/docs/components/table-props",
      },
      {
        title: "Terminal View",
        href: "/docs/components/terminal-view",
      },
      {
        title: "Typograpy",
        href: "/docs/components/typograpy",
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
