import { type ReactNode, type ComponentType } from "react"
import { cn } from "../lib/utils"

// Re-export icons agar bisa dipakai di MDX
export {
  RiNextjsFill,
  RiReactjsLine,
  RiVuejsLine,
  RiSvelteLine,
  RiAngularjsFill,
  RiNpmjsLine,
  RiGithubFill,
  RiTailwindCssFill,
} from "react-icons/ri"

export {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiTailwindcss,
  SiShadcnui,
  SiMdx,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiPrisma,
  SiGraphql,
  SiNodedotjs,
  SiVercel,
  SiSupabase,
  SiFirebase,
  SiRedis,
  SiGit,
  SiFigma,
  SiStorybook,
  SiVite,
  SiWebpack,
  SiAstro,
} from "react-icons/si"

import {
  RiNextjsFill,
  RiReactjsLine,
  RiVuejsLine,
  RiSvelteLine,
  RiAngularjsFill,
  RiNpmjsLine,
  RiGithubFill,
  RiTailwindCssFill,
} from "react-icons/ri"

import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiTailwindcss,
  SiShadcnui,
  SiMdx,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiPrisma,
  SiGraphql,
  SiNodedotjs,
  SiVercel,
  SiSupabase,
  SiFirebase,
  SiRedis,
  SiGit,
  SiFigma,
  SiStorybook,
  SiVite,
  SiWebpack,
  SiAstro,
} from "react-icons/si"

// Icon map - key string -> component
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  // React Icons - Ri
  RiNextjsFill,
  RiReactjsLine,
  RiVuejsLine,
  RiSvelteLine,
  RiAngularjsFill,
  RiNpmjsLine,
  RiGithubFill,
  RiTailwindCssFill,

  // Simple Icons - Si
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiTailwindcss,
  SiShadcnui,
  SiMdx,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiPrisma,
  SiGraphql,
  SiNodedotjs,
  SiVercel,
  SiSupabase,
  SiFirebase,
  SiRedis,
  SiGit,
  SiFigma,
  SiStorybook,
  SiVite,
  SiWebpack,
  SiAstro,
}

interface LogoProps {
  icon: string
  title: string
}

interface LogoSectionProps {
  children: ReactNode
  className?: string
  columns?: 2 | 3 | 4 | 5 | 6
}

export function Logo({ icon, title }: LogoProps) {
  const IconComponent = iconMap[icon]

  if (!IconComponent) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted px-3 py-7 grayscale transition-all hover:grayscale-0">
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted px-3 py-7 grayscale transition-all hover:grayscale-0">
      <IconComponent className="h-6 w-6" />
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
  )
}

export function LogoSection({
  children,
  className,
  columns = 4,
}: LogoSectionProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
  }

  return (
    <div className={cn("px-6 py-2", className)}>
      <div
        className={cn(
          "mx-auto grid max-w-5xl grid-cols-2 place-items-center gap-x-4 gap-y-4 sm:grid-cols-3",
          gridCols[columns]
        )}
      >
        {children}
      </div>
    </div>
  )
}
