"use client"
import { createContext, useContext } from "react"
import type { ReactNode } from "react"

const StepIndexContext = createContext(0)

interface StepProps {
  title: string
  children: ReactNode
}

interface StepsSectionProps {
  children: ReactNode
}

/**
 * Merender satu langkah pada timeline dokumentasi dengan nomor otomatis
 * dari context, lalu menyesuaikan spacing untuk mobile hingga desktop.
 */
export function Step({ title, children }: StepProps) {
  const index = useContext(StepIndexContext)

  return (
    <div className="relative pb-8 pl-8 last:pb-0 sm:pb-10 sm:pl-10 md:pl-12">
      <div className="absolute top-0 left-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-muted-foreground/40 bg-accent ring-4 ring-background sm:h-9 sm:w-9 sm:ring-6 md:h-10 md:w-10 md:ring-8">
        <span className="text-sm font-medium sm:text-base md:text-lg">
          {index + 1}
        </span>
      </div>
      <div className="min-w-0 space-y-2 pt-0.5 sm:space-y-3 sm:pt-1">
        <h3 className="text-lg font-medium tracking-[-0.01em] sm:text-xl">
          {title}
        </h3>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

/**
 * Menyusun daftar Step menjadi timeline vertikal dan membungkus setiap
 * langkah dengan index context agar penomorannya selalu konsisten.
 */
export function StepsSection({ children }: StepsSectionProps) {
  let stepCount = 0

  const childArray = Array.isArray(children) ? children : [children]

  const numberedChildren = childArray.map((child, i) => {
    if (
      child &&
      typeof child === "object" &&
      "props" in child &&
      "title" in child.props
    ) {
      const index = stepCount++
      return (
        <StepIndexContext.Provider key={i} value={index}>
          {child}
        </StepIndexContext.Provider>
      )
    }
    return child
  })

  return (
    <div className="relative ml-4 sm:ml-5 md:ml-6" data-toc-exclude="true">
      <div className="absolute inset-y-0 left-0 border-l border-border" />
      {numberedChildren}
    </div>
  )
}
