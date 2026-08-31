import { MenusProps, SosmedProps } from "./menus"
import { AppLogoProps } from "./logo"

export type AppFooterProps = {
  logo?: AppLogoProps
  title?: string
  sosmeds?: SosmedProps[]
  menus?: MenusProps[]
}
