import { LayoutFloating } from "./layout-floating"
import { LayoutBasic } from "./layout-basic"
import { LayoutProps } from "../types/layouts"

type DocsManLayoutProps = LayoutProps

export function DocsmanLayout({
  variant = "basic",
  Header,
  Footer,
  icon,
  title,
  theme,
  search,
  children,
}: DocsManLayoutProps) {
  const layoutProps = {
    Header,
    Footer,
    icon,
    title,
    theme,
    search,
    children,
  }
  switch (variant) {
    case "floating":
      return <LayoutFloating {...layoutProps} />

    case "basic":
    default:
      return <LayoutBasic {...layoutProps} />
  }
}
