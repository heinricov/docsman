export type MenusProps = {
  title: string
  href: string
  icon?: React.ReactNode
}

export type NavMenusProps = {
  label: string
  menus: MenuItemProps[]
}

export type NavCollapsItemProps = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export type NavCollapsProps = {
  label: string
  menus: MenuItemProps[]
}

export type MenuItemProps = {
  title: string
  href?: string
  url?: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export type NavCombineProps = {
  label: string
  menus: MenuItemProps[]
}

export type MenuSectionProps = {
  type:
    | "MainNavMenus"
    | "NavMenus"
    | "NavCollaps"
    | "NavCombine"
    | "Header"
    | "Footer"
  label?: string
  grup?: string
  hidden?: boolean
  menus: MenuItemProps[]
}

export type AppMenuProps = {
  menu: MenuSectionProps[]
  selectedVersion?: string
}

export type SosmedProps = {
  title: string
  href: string
  icon: React.ReactNode
}

export type AppSosmedProps = {
  sosmeds?: SosmedProps[]
  className?: string
}

export type GrupProps = {
  title: string
  description?: string
  icon?: React.ReactNode
}
