import { MenusProps, SosmedProps } from "./header"
import { AppLogoProps } from "./logo"

export type AppFooterProps = {
  logo?: AppLogoProps
  title?: string
  sosmeds?: SosmedProps[]
  menus?: MenusProps[]
}
