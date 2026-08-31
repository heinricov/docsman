import { Geist_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "docsman/lib/utils"
import { DocsmanLayout } from "docsman/layouts"
import { Globe } from "lucide-react"

import { FaYoutube, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { RiTwitterXFill } from "react-icons/ri"

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
          <DocsmanLayout title="Web" icon={<Globe />} sosmeds={mysosmeds}>
            {children}
          </DocsmanLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
