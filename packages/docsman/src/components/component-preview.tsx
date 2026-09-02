"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Card } from "../ui/card"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "../lib/utils"
import { formatCode } from "../lib/format-code"
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard"
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react"
import { Button } from "../ui/button"

const MAX_VISIBLE_CODE_LINES = 10

interface ComponentCodePreviewProps {
  children: ReactNode
}

interface ComponentProps {
  children: ReactNode
  className?: string
  flexCol?: boolean
  "flex-col"?: boolean
}

interface CodePreviewProps {
  lang?: string
  title?: string
  children: ReactNode
}

export function ComponentCodePreview({ children }: ComponentCodePreviewProps) {
  return (
    <Card className="w-full gap-0 overflow-hidden py-0 shadow-none">
      {children}
    </Card>
  )
}

/**
 * Merender area demo komponen dan mendukung variasi layout sederhana
 * agar preview MDX seperti heading bertingkat bisa ditampilkan vertikal.
 */
export function Component({
  children,
  className,
  flexCol,
  "flex-col": flexColAttribute,
}: ComponentProps) {
  const useColumnLayout = Boolean(flexCol || flexColAttribute)

  return (
    <div
      data-toc-exclude="true"
      className={cn(
        "flex border-b bg-muted/30 p-6",
        useColumnLayout
          ? "w-full flex-col items-start justify-start gap-4 text-left"
          : "items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CodePreview({
  lang = "tsx",
  title,
  children,
}: CodePreviewProps) {
  const code = extractTextContent(children)
  const [isDark, setIsDark] = useState(false)
  const [formattedCode, setFormattedCode] = useState("")
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    formatCode(code, lang).then(setFormattedCode)
  }, [code, lang])

  const syntaxTheme = isDark ? oneDark : oneLight
  const previewKey = `${lang}:${code}`
  const codeLines = formattedCode.split("\n")
  const hasOverflow =
    formattedCode.length > 0 && codeLines.length > MAX_VISIBLE_CODE_LINES
  const isExpanded = expandedKey === previewKey
  const visibleCode =
    hasOverflow && !isExpanded
      ? codeLines.slice(0, MAX_VISIBLE_CODE_LINES).join("\n")
      : formattedCode

  return (
    <div className="relative bg-muted/30 dark:bg-muted/20">
      {title && (
        <div className="border-b border-border/50 bg-muted/50 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
      )}
      <div className="absolute top-2 right-2 z-10">
        <Button
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={() => copyToClipboard(formattedCode)}
          size="icon"
          variant="ghost"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={lang}
          style={syntaxTheme}
          showLineNumbers
          lineNumberStyle={{
            minWidth: "2rem",
            paddingRight: "0.75rem",
            textAlign: "right",
            userSelect: "none",
            opacity: 0.5,
          }}
          wrapLines
          customStyle={{
            margin: 0,
            padding: "1rem 0.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-mono, monospace)",
            },
          }}
        >
          {visibleCode}
        </SyntaxHighlighter>
        {hasOverflow && !isExpanded ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-muted/95 to-transparent dark:from-muted/90" />
        ) : null}
        {hasOverflow ? (
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
            <Button
              className="h-8 gap-2 rounded-full border border-border/60 bg-background/75 px-3 text-xs text-foreground shadow-sm backdrop-blur-md hover:bg-background/90"
              onClick={() =>
                setExpandedKey((currentKey) =>
                  currentKey === previewKey ? null : previewKey
                )
              }
              variant="outline"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Sembunyikan sebagian code
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Tampilkan semua code
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Mengekstrak teks mentah dari children preview agar bisa diformat sebagai source code.
 * Fungsi ini menembus wrapper React sederhana yang umum muncul dari hasil kompilasi MDX.
 */
function extractTextContent(children: ReactNode): string {
  if (typeof children === "string") {
    return children.trim()
  }

  if (typeof children === "number") {
    return String(children)
  }

  if (children && typeof children === "object" && "props" in children) {
    const element = children as { props: { children?: ReactNode } }
    if (element.props.children) {
      return extractTextContent(element.props.children)
    }
  }

  if (Array.isArray(children)) {
    const texts = children
      .map((child) => extractTextContent(child))
      .filter(Boolean)
    if (texts.length > 0) {
      return texts.join("")
    }
  }

  return ""
}
