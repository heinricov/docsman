"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { Button } from "../ui/button"

export const AppTheme = () => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Prevent SSR flicker and hydration mismatch
  if (!mounted) {
    return <Button className="rounded-full" size="icon" />
  }

  return (
    <Button className="rounded-full" onClick={toggleTheme} size="icon">
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
