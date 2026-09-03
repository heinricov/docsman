import "./globals.css"
import { fontMono, oxanium } from "@/components/providers/font-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { DocsmanLayout } from "docsman"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { Metadata } from "next"
import { menus } from "@/components/menus"

export const metadata: Metadata = {
  title: {
    default: "Docsman",
    template: "%s | Docsman",
  },
  description:
    "Reusable React layouts and sidebar components for building documentation sites fast with Next.js, MDX, and Tailwind CSS.",
}

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
