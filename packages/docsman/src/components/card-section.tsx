import { type ReactNode } from "react"
import { Card as CardPrimitive, CardHeader, CardContent } from "../ui/card"
import { cn } from "../lib/utils"

interface CardItemProps {
  title: string
  description: string
  className?: string
}

interface CardSectionProps {
  children: ReactNode
  className?: string
  columns?: 2 | 3 | 4
}

export function Card({ title, description, className }: CardItemProps) {
  return (
    <CardPrimitive
      className={cn(
        "relative w-full gap-0 border border-border/50 bg-card pt-0 pb-4 shadow-sm",
        className
      )}
    >
      <CardHeader className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] leading-none font-semibold text-foreground">
              {title}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </CardPrimitive>
  )
}

export function CardSection({
  children,
  className,
  columns = 3,
}: CardSectionProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  }

  return (
    <div className={cn("my-0", className)}>
      <div
        className={cn(
          "grid w-full grid-cols-1 place-items-center gap-4",
          gridCols[columns]
        )}
      >
        {children}
      </div>
    </div>
  )
}
