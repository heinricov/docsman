import { BreadcrumbSection } from "./breadcrumb"
import { CopySection } from "./copy-section"

interface HeaderSectionProps {
  title?: string
  description?: string
}

export function HeaderSection({
  title = "The Great Joke Tax",
  description = "In a kingdom far away, where laughter once flowed freely, a peculiar tale unfolded about a king who decided to tax the very essence of joy itself - jokes and jest.",
}: HeaderSectionProps) {
  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="mb-8">
      <BreadcrumbSection />

      <div className="flex items-center justify-between">
        <h1 className="mt-3 text-3xl font-extrabold">{title}</h1>
      </div>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      )}
      <p className="mt-4 text-xs text-muted-foreground tabular-nums">
        Last updated {formattedDate}
      </p>
    </div>
  )
}
