import { type ReactNode } from "react"
import {
  CheckCircle2Icon,
  InfoIcon,
  AlertTriangleIcon,
  CircleCheckBigIcon,
  CircleXIcon,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { cn } from "../lib/utils"

type AlertType = "default" | "success" | "warning" | "info" | "error"

interface AlertSectionProps {
  type?: AlertType
  title: string
  children: ReactNode
}

const alertConfig: Record<
  AlertType,
  {
    icon: React.ComponentType<{ className?: string }>
    className: string
    descriptionClassName: string
  }
> = {
  default: {
    icon: CheckCircle2Icon,
    className: "",
    descriptionClassName: "",
  },
  success: {
    icon: CircleCheckBigIcon,
    className:
      "border-emerald-600/50 text-emerald-600 dark:border-emerald-600 [&>svg]:text-emerald-600",
    descriptionClassName: "text-emerald-600",
  },
  warning: {
    icon: AlertTriangleIcon,
    className:
      "border-amber-500/50 text-amber-500 dark:border-amber-500 [&>svg]:text-amber-500",
    descriptionClassName: "text-amber-500 ",
  },
  info: {
    icon: InfoIcon,
    className:
      "border-cyan-600/50 text-cyan-600 dark:border-cyan-600 [&>svg]:text-cyan-600",
    descriptionClassName: "text-cyan-600",
  },
  error: {
    icon: CircleXIcon,
    className:
      "border-red-600/50 text-red-600 dark:border-red-600 [&>svg]:text-red-600",
    descriptionClassName: "text-red-600",
  },
}

export function AlertSection({
  type = "default",
  title,
  children,
}: AlertSectionProps) {
  const config = alertConfig[type]
  const Icon = config.icon

  return (
    <div className="flex w-full items-start">
      <Alert className={cn(config.className)}>
        <Icon className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className={cn(config.descriptionClassName)}>
          {children}
        </AlertDescription>
      </Alert>
    </div>
  )
}
