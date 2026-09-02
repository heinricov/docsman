"use client"

import { ReactNode, useState } from "react"
import { FileIcon } from "lucide-react"
import { FaFolder, FaFolderOpen } from "react-icons/fa"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

interface FileTreeProps {
  children: ReactNode
}

interface FolderProps {
  title: string
  open?: boolean
  children: ReactNode
}

interface FileProps {
  title: string
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <div className="w-full rounded-lg bg-accent p-4">
      <div className="-ml-4 w-full">{children}</div>
    </div>
  )
}

export function Folder({ title, open = false, children }: FolderProps) {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pl-3">
      <CollapsibleTrigger className="group flex w-full items-center gap-2 py-1">
        <span className="flex items-center gap-2">
          {isOpen ? (
            <FaFolderOpen className="h-4 w-4" />
          ) : (
            <FaFolder className="h-4 w-4" />
          )}
          {title}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-l border-muted-foreground/30 pl-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function File({ title }: FileProps) {
  return (
    <div className="flex items-center gap-2 py-1 pl-3">
      <FileIcon className="h-4 w-4" /> {title}
    </div>
  )
}
