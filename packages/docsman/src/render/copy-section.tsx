"use client"

// icon
import { ChevronDownIcon, Copy } from "lucide-react"
import { FaMarkdown } from "react-icons/fa"
import { SiV0 } from "react-icons/si"
import { LuBot } from "react-icons/lu"

import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function CopySection() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Copy />
        Copy
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="pl-2!">
              <ChevronDownIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FaMarkdown />
              View Markdown
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SiV0 />
              Open In V0
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LuBot />
              Open In ChatGPT
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
