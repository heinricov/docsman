import { logoProps } from "./logo"
import { SosmedProps } from "./menus"

export type LayoutProps = {
  Header?: React.ReactNode
  Footer?: React.ReactNode
  children: React.ReactNode
  icon?: React.ReactNode
  title?: string
  theme?: boolean
  search?: boolean
  variant?: "sidebar" | "floating" | "inset" | "basic"
  description?: string
  logo?: logoProps
  sosmeds?: SosmedProps[]
}
