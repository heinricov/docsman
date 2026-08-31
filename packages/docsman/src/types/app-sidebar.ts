import { Sidebar } from "../ui/sidebar"
import { logoProps } from "./logo"
import { MenuSectionProps, SosmedProps } from "./menus"

export type AppSidebarProps = {
  className?: string
  logo?: logoProps
  sosmeds?: SosmedProps[]
  menus?: MenuSectionProps[]
} & React.ComponentProps<typeof Sidebar>
