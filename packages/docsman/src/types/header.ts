import { AppLogoProps } from "./logo"
import { MenusProps, SosmedProps } from "./menus"

export type AppHeaderProps = {
  icon?: React.ReactNode
  title?: string
  theme?: boolean
  search?: boolean
  className?: string
  logo?: AppLogoProps
  menus?: MenusProps[]
  sosmeds?: SosmedProps[]
}
