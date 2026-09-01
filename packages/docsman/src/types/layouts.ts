import { logoProps } from "./logo"
import { MenuSectionProps, MenusProps, SosmedProps } from "./menus"

export type LayoutProps = {
  Header?: React.ReactNode
  HeaderMenus?: MenusProps[]
  Footer?: React.ReactNode
  FooterMenus?: MenusProps[]
  children: React.ReactNode
  icon?: React.ReactNode
  title?: string
  theme?: boolean
  search?: boolean
  variant?: "sidebar" | "floating" | "inset" | "basic"
  description?: string
  logo?: logoProps
  sosmeds?: SosmedProps[]
  sideMenus?: MenuSectionProps[]
  ShowSidebar?: string | string[]
  sidebarDesktopHidden?: boolean
}
