import { Sidebar } from "../ui/sidebar"
import { logoProps } from "./logo"
import { GrupProps, MenuSectionProps, SosmedProps } from "./menus"

export type AppSidebarProps = {
  className?: string
  logo?: logoProps
  sosmeds?: SosmedProps[]
  menus?: MenuSectionProps[]
  grup?: GrupProps[]
} & React.ComponentProps<typeof Sidebar>
