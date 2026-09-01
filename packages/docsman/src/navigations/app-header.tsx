"use client"

import { SearchForm } from "./search-form"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useSidebar } from "../ui/sidebar"
import { PanelLeftIcon } from "lucide-react"
import { AppLogo } from "./app-logo"
import { AppHeaderProps } from "../types/header"
import { AppTheme } from "./app-theme"
import { cn } from "../lib/utils"
import { AppSosmed } from "./app-sosmed"
import Link from "next/link"

export function AppHeader({
  logo,
  theme,
  search,
  menus,
  sosmeds,
}: AppHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex h-12 w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center md:hidden data-vertical:h-4 data-vertical:self-auto"
              )}
            >
              <Button
                className="h-8 w-8"
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
              >
                <PanelLeftIcon />
              </Button>
              <Separator orientation="vertical" className="mx-2" />
            </div>
            <AppLogo {...logo} />
            <nav className="ml-5 hidden items-center gap-6 md:flex">
              {menus?.map((menu) => (
                <Link
                  key={menu.title}
                  href={menu.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {menu.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {search === true ? (
              <SearchForm className="hidden w-full sm:ml-auto sm:w-auto md:block" />
            ) : null}
            <AppSosmed sosmeds={sosmeds} />
            {theme === true ? <AppTheme /> : null}
          </div>
        </div>
      </div>
    </header>
  )
}
