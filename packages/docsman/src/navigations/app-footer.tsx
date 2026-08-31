import Link from "next/link"
import { AppLogo } from "./app-logo"
import { AppFooterProps } from "../types/footer"
import { AppSosmed } from "./app-sosmed"

export const AppFooter = ({ sosmeds, menus, logo, title }: AppFooterProps) => {
  return (
    <footer className="border-t bg-background px-6 py-2">
      <div className="max-w-screen-3xl mx-auto w-full divide-y">
        <div className="flex flex-col items-center justify-between gap-4 px-2 pt-3 pb-5 sm:flex-row">
          <AppLogo {...logo} />

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
            {menus?.map((menu) => (
              <li key={menu.title}>
                <Link href={menu.href}>{menu.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col-reverse items-center justify-between gap-4 px-2 pt-4 pb-2 sm:flex-row">
          <p className="text-sm font-medium text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} {title}. All rights
            reserved.
          </p>

          <AppSosmed sosmeds={sosmeds} />
        </div>
      </div>
    </footer>
  )
}
