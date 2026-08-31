import React from "react"
import { AppSosmedProps } from "../types/menus"
import Link from "next/link"
import { cn } from "../lib/utils"

export function AppSosmed({ className, sosmeds }: AppSosmedProps) {
  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {sosmeds?.map((sosmed) => (
          <Link key={sosmed.title} href={sosmed.href}>
            {sosmed.icon}
          </Link>
        ))}
      </div>
    </>
  )
}
