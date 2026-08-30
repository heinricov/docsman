import { Geist_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "docsman/lib/utils"
import { LayoutBasic } from "docsman/layouts"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
          <LayoutBasic>{children}</LayoutBasic>
        </ThemeProvider>
      </body>
    </html>
  )
}
