import { AppSosmedProps } from "../types/menus"
import Link from "next/link"
import { cn } from "../lib/utils"
import { FaGithub } from "react-icons/fa"

const sosmedsdata = [
  {
    title: "Github",
    icon: <FaGithub className="h-5 w-5 text-muted-foreground" />,
    href: "/",
  },
]

export function AppSosmed({
  className,
  sosmeds = sosmedsdata,
}: AppSosmedProps) {
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
