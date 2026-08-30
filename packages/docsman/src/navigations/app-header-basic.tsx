"use client"

import { SearchForm } from "./search-form"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useSidebar } from "../ui/sidebar"
import { PanelLeftIcon } from "lucide-react"
import { AppLogo } from "./app-logo"

export function AppHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <div className="flex items-center data-vertical:h-4 data-vertical:self-auto md:hidden">
          <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 "
        />
        </div>
        <AppLogo/>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  )
}
