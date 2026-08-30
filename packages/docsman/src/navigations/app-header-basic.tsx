"use client"

import { SearchForm } from "./search-form"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useSidebar } from "../ui/sidebar"
import { PanelLeftIcon } from "lucide-react"
import { AppLogo } from "./app-logo"
import { AppHeaderProps } from "../types/header"
import { AppTheme } from "./app-theme"

export function AppHeader({ icon, title }: AppHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex h-12 w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center md:hidden data-vertical:h-4 data-vertical:self-auto">
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
            <AppLogo icon={icon} title={title} />
          </div>
          <div className="flex items-center gap-2">
            <SearchForm className="hidden w-full sm:ml-auto sm:w-auto md:block" />
            <AppTheme />
          </div>
        </div>
      </div>
    </header>
  )
}
