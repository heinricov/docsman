"use client"

import {
  type ReactNode,
  useEffect,
  useSyncExternalStore,
  useState,
} from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { Check, Copy, Terminal } from "lucide-react"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard"
import { cn } from "../lib/utils"

interface PackageManager {
  name: string
  value: string
  install: string
  execute: string
  color: string
}

const packageManagers: PackageManager[] = [
  {
    name: "pnpm",
    value: "pnpm",
    install: "pnpm add",
    execute: "pnpm dlx",
    color: "text-amber-500",
  },
  {
    name: "npm",
    value: "npm",
    install: "npm install",
    execute: "npx",
    color: "text-red-500",
  },
  {
    name: "yarn",
    value: "yarn",
    install: "yarn add",
    execute: "yarn dlx",
    color: "text-blue-500",
  },
  {
    name: "bun",
    value: "bun",
    install: "bun add",
    execute: "bunx --bun",
    color: "text-amber-400",
  },
]

const customLightTheme = {
  'code[class*="language-"]': {
    color: "#1e293b",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  'pre[class*="language-"]': {
    color: "#1e293b",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "13px",
    lineHeight: "1.5",
    background: "transparent",
    margin: 0,
    padding: 0,
  },
  comment: { color: "#94a3b8" },
  prolog: { color: "#94a3b8" },
  doctype: { color: "#94a3b8" },
  cdata: { color: "#94a3b8" },
  punctuation: { color: "#64748b" },
  property: { color: "#0ea5e9" },
  tag: { color: "#0ea5e9" },
  boolean: { color: "#8b5cf6" },
  number: { color: "#f59e0b" },
  constant: { color: "#f59e0b" },
  symbol: { color: "#10b981" },
  selector: { color: "#10b981" },
  "attr-name": { color: "#f59e0b" },
  string: { color: "#10b981" },
  char: { color: "#10b981" },
  builtin: { color: "#06b6d4" },
  inserted: { color: "#10b981" },
  operator: { color: "#f43f5e" },
  entity: { color: "#f43f5e" },
  url: { color: "#0ea5e9" },
  atrule: { color: "#8b5cf6" },
  "attr-value": { color: "#10b981" },
  keyword: { color: "#8b5cf6" },
  function: { color: "#3b82f6" },
  "class-name": { color: "#06b6d4" },
  regex: { color: "#f59e0b" },
  important: { color: "#f43f5e" },
  variable: { color: "#f43f5e" },
}

const customDarkTheme = {
  'code[class*="language-"]': {
    color: "#e2e8f0",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  'pre[class*="language-"]': {
    color: "#e2e8f0",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "13px",
    lineHeight: "1.5",
    background: "transparent",
    margin: 0,
    padding: 0,
  },
  comment: { color: "#64748b" },
  prolog: { color: "#64748b" },
  doctype: { color: "#64748b" },
  cdata: { color: "#64748b" },
  punctuation: { color: "#94a3b8" },
  property: { color: "#38bdf8" },
  tag: { color: "#38bdf8" },
  boolean: { color: "#a78bfa" },
  number: { color: "#fbbf24" },
  constant: { color: "#fbbf24" },
  symbol: { color: "#34d399" },
  selector: { color: "#34d399" },
  "attr-name": { color: "#fbbf24" },
  string: { color: "#34d399" },
  char: { color: "#34d399" },
  builtin: { color: "#22d3ee" },
  inserted: { color: "#34d399" },
  operator: { color: "#fb7185" },
  entity: { color: "#fb7185" },
  url: { color: "#38bdf8" },
  atrule: { color: "#a78bfa" },
  "attr-value": { color: "#34d399" },
  keyword: { color: "#a78bfa" },
  function: { color: "#60a5fa" },
  "class-name": { color: "#22d3ee" },
  regex: { color: "#fbbf24" },
  important: { color: "#fb7185" },
  variable: { color: "#fb7185" },
}

interface CodeCommandProps {
  children: ReactNode
  defaultTab?: string
  execute?: boolean
}

export default function CodeCommand({
  children,
  defaultTab = "pnpm",
  execute = false,
}: CodeCommandProps) {
  const packageName = typeof children === "string" ? children.trim() : ""
  const [isDark, setIsDark] = useState(false)

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

  return (
    <div
      className={cn(
        "group/command overflow-hidden rounded-xl border transition-all",
        isDark
          ? "border-white/10 bg-zinc-950 shadow-lg shadow-black/20"
          : "border-zinc-200 bg-white shadow-md shadow-zinc-200/50"
      )}
    >
      <Tabs defaultValue={defaultTab}>
        {/* Header with tabs */}
        <div
          className={cn(
            "flex items-center justify-between border-b px-3 py-1",
            isDark
              ? "border-white/10 bg-zinc-900/50"
              : "border-zinc-200 bg-zinc-50"
          )}
        >
          <div className="flex items-center gap-2">
            <Terminal
              className={cn(
                "h-4 w-4",
                isDark ? "text-zinc-400" : "text-zinc-500"
              )}
            />
            <TabsList className="h-auto gap-1 bg-transparent p-0">
              {packageManagers.map((pm) => (
                <TabsTrigger
                  className={cn(
                    "h-7 rounded-md px-3 text-xs font-medium transition-all",
                    "data-[state=active]:shadow-sm",
                    isDark
                      ? "text-zinc-400 hover:text-zinc-200 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm"
                  )}
                  key={pm.value}
                  value={pm.value}
                >
                  {pm.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Command content */}
        <div className="relative">
          {packageManagers.map((pm) => (
            <TabsContent key={pm.value} value={pm.value} className="m-0">
              <CommandRow
                command={`${execute ? pm.execute : pm.install} ${packageName}`}
                isDark={isDark}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

function CommandRow({ command, isDark }: { command: string; isDark: boolean }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const syntaxTheme = isDark ? customDarkTheme : customLightTheme

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-1 font-mono text-sm",
          isDark ? "bg-zinc-950" : "bg-white"
        )}
      >
        <span
          className={cn(
            "font-semibold select-none",
            isDark ? "text-emerald-400" : "text-emerald-600"
          )}
        >
          $
        </span>
        <div className="min-w-0 flex-1 scrollbar-none overflow-x-auto">
          <pre
            style={{
              margin: 0,
              padding: 0,
              fontSize: "13px",
              lineHeight: "1.6",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <code>{command}</code>
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-1 font-mono text-sm",
        isDark ? "bg-zinc-950" : "bg-white"
      )}
    >
      {/* Prompt symbol */}
      <span
        className={cn(
          "font-semibold select-none",
          isDark ? "text-emerald-400" : "text-emerald-600"
        )}
      >
        $
      </span>

      {/* Command with syntax highlighting */}
      <div className="min-w-0 flex-1 scrollbar-none overflow-x-auto">
        <SyntaxHighlighter
          language="bash"
          style={syntaxTheme}
          wrapLines={false}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-mono, monospace)",
            },
          }}
        >
          {command}
        </SyntaxHighlighter>
      </div>

      {/* Inline copy button */}
      <Button
        className={cn(
          "h-6 w-6 shrink-0 rounded-md transition-all",
          isDark
            ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
        )}
        size="icon"
        variant="ghost"
        onClick={() => copyToClipboard(command)}
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  )
}
