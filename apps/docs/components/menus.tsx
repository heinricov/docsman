import { MenuSectionProps } from "docsman"
import { Book, Home } from "lucide-react"

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
        href: "/docs/docsman-layout-render",
      },
      {
        title: "Deploy",
        href: "/docs/deploy",
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
        href: "/docs/components/typography",
      },
    ],
  },
] satisfies MenuSectionProps[]
