import { LayoutFloating } from "./layout-floating"
import { LayoutBasic } from "./layout-basic"
import { LayoutProps } from "../types/layouts"
import { SquareText } from "lucide-react"
import { AppHeader } from "../navigations/app-header"
import { AppFooter } from "../navigations/app-footer"

import { FaYoutube, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { RiTwitterXFill } from "react-icons/ri"

type DocsManLayoutProps = LayoutProps

export function DocsmanLayout({
  variant = "basic",
  children,
  title = "Acme",
  icon = <SquareText className="size-5! text-primary" />,
  theme = true,
  search = true,
  logo = {
    icon,
    title,
    description: "Version Beta",
  },
  Header = (
    <AppHeader
      logo={logo}
      theme={theme}
      search={search}
      className={variant === "basic" ? "" : "md:block"}
      menus={[
        {
          title: "Home",
          href: "/",
        },
      ]}
      sosmeds={[
        {
          title: "Linkedin",
          icon: <FaLinkedin className="h-5 w-5 text-muted-foreground" />,
          href: "/",
        },
        {
          title: "Instagram",
          icon: <FaInstagram className="h-5 w-5 text-muted-foreground" />,
          href: "/",
        },
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
        {
          title: "Twitter",
          icon: <RiTwitterXFill className="h-5 w-5 text-muted-foreground" />,
          href: "/",
        },
      ]}
    />
  ),
  Footer = (
    <AppFooter
      logo={logo}
      title={title}
      menus={[
        {
          title: "About",
          href: "/#about",
        },
        {
          title: "Contact",
          href: "/#contact",
        },
        {
          title: "Privacy Policy",
          href: "/#privacy",
        },
      ]}
      sosmeds={[
        {
          title: "Linkedin",
          icon: <FaLinkedin className="h-5 w-5 text-muted-foreground" />,
          href: "/",
        },
        {
          title: "Instagram",
          icon: <FaInstagram className="h-5 w-5 text-muted-foreground" />,
          href: "/",
        },
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
        {
          title: "Twitter",
          icon: <RiTwitterXFill className="h-5 w-5 text-muted-foreground" />,
          href: "/",
        },
      ]}
    />
  ),
}: DocsManLayoutProps) {
  const layoutProps = {
    Header,
    Footer,
    icon,
    title,
    theme,
    search,
    children,
  }
  switch (variant) {
    case "floating":
      return <LayoutFloating {...layoutProps} />

    case "basic":
    default:
      return <LayoutBasic {...layoutProps} />
  }
}
