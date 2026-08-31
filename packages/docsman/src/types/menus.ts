export type MenusProps = {
  title: string
  href: string
  icon?: React.ReactNode
}

export type NavMenusProps = {
  label: string
  menus: MenusProps[]
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
  menus: NavCollapsItemProps[]
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
