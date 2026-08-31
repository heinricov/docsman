import { AppLogoProps } from "./logo"

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

export type MenusProps = {
  title: string
  href: string
}

export type SosmedProps = {
  title: string
  href: string
  icon: React.ReactNode
}
