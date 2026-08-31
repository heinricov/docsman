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

export type MenuSectionProps = {
  type: "MainNavMenus" | "NavMenus" | "NavCollaps"
  label: string
  grup?: string
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
