"use client"

import {
  Children,
  isValidElement,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "../lib/utils"
import { formatCode } from "../lib/format-code"
import { extractTextContent } from "../lib/extract-text-content"

import { Check, Copy, Minus, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard"

// Icons
import {
  FaReact,
  FaJs,
  FaHtml5,
  FaPython,
  FaRust,
  FaSwift,
  FaJava,
  FaPhp,
} from "react-icons/fa"
import {
  SiTypescript,
  SiMdx,
  SiCss,
  SiSass,
  SiTailwindcss,
  SiPrisma,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiNodedotjs,
  SiAstro,
  SiSvelte,
  SiVuedotjs,
  SiAngular,
  SiNextdotjs,
  SiGraphql,
  SiMarkdown,
  SiYaml,
  SiToml,
  SiRuby,
  SiGo,
} from "react-icons/si"
import { BiSolidFileJson } from "react-icons/bi"
import { VscTerminal } from "react-icons/vsc"
type CodeBlockVariant = "default" | "header" | "tabs"

const langIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  // JavaScript & TypeScript
  javascript: FaJs,
  js: FaJs,
  jsx: FaReact,
  typescript: SiTypescript,
  ts: SiTypescript,
  tsx: FaReact,

  // Frameworks
  react: FaReact,
  nextjs: SiNextdotjs,
  next: SiNextdotjs,
  vue: SiVuedotjs,
  svelte: SiSvelte,
  angular: SiAngular,
  astro: SiAstro,

  // Styles
  css: SiCss,
  scss: SiSass,
  sass: SiSass,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,

  // Data formats
  json: BiSolidFileJson,
  yaml: SiYaml,
  yml: SiYaml,
  toml: SiToml,
  mdx: SiMdx,
  md: SiMarkdown,
  markdown: SiMarkdown,

  // Languages
  python: FaPython,
  py: FaPython,
  rust: FaRust,
  rs: FaRust,
  swift: FaSwift,
  java: FaJava,
  php: FaPhp,
  ruby: SiRuby,
  go: SiGo,

  // Databases & Tools
  graphql: SiGraphql,
  gql: SiGraphql,
  prisma: SiPrisma,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  redis: SiRedis,
  docker: SiDocker,

  // Other
  html: FaHtml5,
  xml: FaHtml5,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  bash: VscTerminal,
  shell: VscTerminal,
  sh: VscTerminal,
  zsh: VscTerminal,
}

interface DiffLine {
  type: "add" | "remove" | "normal"
  content: string
  oldLineNum?: number
  newLineNum?: number
}

interface TabItemProps {
  value: string
  lang?: string
  children: string
}

interface LineItemProps {
  value: string
}

interface CodeItemProps {
  value: string
}

interface CodeBlockProps {
  code?: string
  lang?: string
  variant?: CodeBlockVariant
  fileName?: string
  tabs?: string[] | string
  defaultTab?: string
  header?: ReactNode
  showLineNumbers?: boolean
  title?: string
  highlight?: number[] | string
  focus?: number[] | string
  diff?: {
    oldCode: string
    newCode: string
  }
  oldCode?: string
  newCode?: string
  children?: ReactNode
  autoFormat?: boolean
}

interface CodeBlockContextType {
  showLineNumbers: boolean
  highlight: number[]
  focus: number[]
  autoFormat: boolean
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  showLineNumbers: true,
  highlight: [],
  focus: [],
  autoFormat: true,
})

const lineNumberStyle: React.CSSProperties = {
  minWidth: "2rem",
  paddingRight: "0.75rem",
  textAlign: "right",
  userSelect: "none",
  opacity: 0.5,
}

const fallbackLangIcon = FaReact

/**
 * Mengambil nama komponen React dengan aman untuk konteks MDX dan RSC.
 * Display name diprioritaskan karena lebih stabil dibanding identity check.
 */
function getElementName(child: unknown): string | undefined {
  if (!isValidElement(child)) return undefined

  const type = child.type
  if (typeof type === "string") return type
  if (typeof type === "function") {
    return (
      (type as { displayName?: string }).displayName ||
      (type as { name?: string }).name ||
      undefined
    )
  }

  if (typeof type === "object" && type !== null) {
    return (
      (type as { displayName?: string; name?: string }).displayName ||
      (type as { displayName?: string; name?: string }).name ||
      undefined
    )
  }

  return undefined
}

/**
 * Meratakan seluruh elemen React valid dari tree children.
 * Ini membantu membaca komponen MDX yang terkadang dibungkus wrapper tambahan
 * saat melewati boundary Server Component ke Client Component.
 */
function flattenElementChildren(children: ReactNode): React.ReactElement[] {
  const elements: React.ReactElement[] = []

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue

    elements.push(child)

    const childChildren = (child.props as { children?: ReactNode }).children
    if (childChildren != null) {
      elements.push(...flattenElementChildren(childChildren))
    }
  }

  return elements
}

/**
 * Menentukan judul yang akan ditampilkan pada header code block.
 * `title` diprioritaskan sebagai label tampilan, lalu fallback ke `fileName`.
 */
function resolveCodeBlockTitle({
  title,
  fileName,
}: {
  title?: string
  fileName?: string
}): string | undefined {
  return title ?? fileName
}

/**
 * Menormalkan string code dari atribut MDX yang memakai escape sequence literal.
 * Ini memungkinkan penggunaan `code="line1\nline2"` tanpa expression JSX.
 */
function decodeEscapedCodeText(value: string): string {
  return value
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\\t", "\t")
    .replaceAll("\\r", "\r")
}

/**
 * Menentukan isi kode final yang aman untuk dirender.
 * Tidak lagi jatuh ke demo code internal agar output tidak menyesatkan
 * saat MDX gagal meneruskan children expression.
 */
function resolveCodeBlockContent({
  code,
  children,
  lineChildrenCode,
}: {
  code?: string
  children?: ReactNode
  lineChildrenCode?: string
}): string {
  const extractedCode = extractTextContent(children)

  if (
    typeof lineChildrenCode === "string" &&
    lineChildrenCode.trim().length > 0
  ) {
    return lineChildrenCode
  }

  if (typeof code === "string" && code.trim().length > 0) {
    return decodeEscapedCodeText(code).trim()
  }

  if (typeof children === "string" && children.trim().length > 0) {
    return children.trim()
  }

  if (extractedCode && extractedCode.trim().length > 0) {
    return extractedCode.trim()
  }

  return ""
}

function computeDiff(oldCode: string, newCode: string): DiffLine[] {
  const oldLines = oldCode.split("\n")
  const newLines = newCode.split("\n")
  const result: DiffLine[] = []
  let oldLineNum = 1
  let newLineNum = 1

  const maxLen = Math.max(oldLines.length, newLines.length)

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]

    if (oldLine === undefined) {
      result.push({
        type: "add",
        content: newLine ?? "",
        newLineNum: newLineNum++,
      })
    } else if (newLine === undefined) {
      result.push({
        type: "remove",
        content: oldLine ?? "",
        oldLineNum: oldLineNum++,
      })
    } else if (oldLine === newLine) {
      result.push({
        type: "normal",
        content: oldLine,
        oldLineNum: oldLineNum++,
        newLineNum: newLineNum++,
      })
    } else {
      result.push({
        type: "remove",
        content: oldLine,
        oldLineNum: oldLineNum++,
      })
      result.push({
        type: "add",
        content: newLine,
        newLineNum: newLineNum++,
      })
    }
  }

  return result
}

/**
 * Menormalkan prop daftar nomor baris dari berbagai format.
 * Mendukung array number, string CSV, atau string JSON array untuk MDX.
 */
function normalizeLineNumberList(
  value: number[] | string | undefined
): number[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is number => typeof item === "number")
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is number => typeof item === "number")
    }
  } catch {
    return value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item))
  }

  return []
}

/**
 * Menormalkan daftar tabs dari berbagai format agar aman dipakai di MDX.
 * Mendukung array string atau string JSON/CSV.
 */
function normalizeTabsList(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string")
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string")
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return []
}

/**
 * Menentukan konfigurasi diff final dari format object atau prop string terpisah.
 * Pendekatan string dipakai sebagai fallback yang lebih stabil di MDX.
 */
function resolveDiffConfig({
  diff,
  oldCode,
  newCode,
}: {
  diff?: { oldCode: string; newCode: string }
  oldCode?: string
  newCode?: string
}): { oldCode: string; newCode: string } | null {
  if (
    diff &&
    typeof diff.oldCode === "string" &&
    typeof diff.newCode === "string"
  ) {
    return diff
  }

  if (
    typeof oldCode === "string" &&
    oldCode.length > 0 &&
    typeof newCode === "string" &&
    newCode.length > 0
  ) {
    return {
      oldCode: decodeEscapedCodeText(oldCode),
      newCode: decodeEscapedCodeText(newCode),
    }
  }

  return null
}

function SyntaxCode({
  code,
  lang,
  autoFormat = true,
}: {
  code: string
  lang: string
  autoFormat?: boolean
}) {
  const [isDark, setIsDark] = useState(false)
  const [formattedCode, setFormattedCode] = useState(code)
  const { showLineNumbers, highlight, focus } = useContext(CodeBlockContext)

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

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
    let cancelled = false

    if (autoFormat) {
      formatCode(code, lang).then((nextCode) => {
        if (!cancelled) setFormattedCode(nextCode)
      })
    } else {
      Promise.resolve().then(() => {
        if (!cancelled) setFormattedCode(code)
      })
    }

    return () => {
      cancelled = true
    }
  }, [code, lang, autoFormat])

  const syntaxTheme = isDark ? oneDark : oneLight
  const hasFocus = focus.length > 0

  if (!mounted) {
    return (
      <div className="bg-muted/30 dark:bg-muted/20">
        <pre
          className="overflow-x-auto p-4"
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent",
          }}
        >
          <code
            style={{
              fontFamily: "var(--font-mono, monospace)",
              whiteSpace: "pre",
            }}
          >
            {formattedCode}
          </code>
        </pre>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 dark:bg-muted/20">
      <SyntaxHighlighter
        language={lang}
        style={syntaxTheme}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={lineNumberStyle}
        wrapLines
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: highlight.includes(lineNumber)
              ? "oklch(0.65 0.15 250 / 0.2)"
              : undefined,
            opacity: hasFocus && !focus.includes(lineNumber) ? 0.3 : 1,
            transition: "opacity 0.2s",
            display: "block",
            padding: "0 1.5rem 0 0.5rem",
          },
        })}
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
        {formattedCode}
      </SyntaxHighlighter>
    </div>
  )
}

export function CodeBlockTabItem(props: TabItemProps) {
  void props
  return null
}
CodeBlockTabItem.displayName = "CodeBlock.Tab"

/**
 * Menyimpan satu baris kode untuk konteks MDX.
 * Pendekatan ini dipakai agar contoh kode bisa ditulis rapi tanpa string escape panjang.
 */
export function CodeBlockLine(props: LineItemProps) {
  void props
  return null
}
CodeBlockLine.displayName = "CodeBlock.Line"

/**
 * Menyimpan seluruh source code dalam satu child untuk konteks MDX.
 * Cocok dipakai saat penulisan multi-line string lebih nyaman daripada banyak baris terpisah.
 */
export function CodeBlockCode(props: CodeItemProps) {
  void props
  return null
}
CodeBlockCode.displayName = "CodeBlock.Code"

function CodeBlockTab({ value, lang = "tsx", children }: TabItemProps) {
  const { autoFormat } = useContext(CodeBlockContext)
  const resolvedTabCode = typeof children === "string" ? children.trim() : ""
  return (
    <TabsContent value={value}>
      <div className="group relative">
        <SyntaxCode
          code={resolvedTabCode}
          lang={lang}
          autoFormat={autoFormat}
        />
        <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton content={resolvedTabCode} />
        </div>
      </div>
    </TabsContent>
  )
}

function extractTabsFromChildren(children: ReactNode): TabItemProps[] {
  const tabs: TabItemProps[] = []
  const childArray = flattenElementChildren(children)

  for (const child of childArray) {
    if (getElementName(child) === "CodeBlock.Tab") {
      tabs.push(child.props as TabItemProps)
    }
  }

  return tabs
}

/**
 * Mengambil source code dari children `<CodeBlock.Code />`.
 * Format ini diprioritaskan karena lebih ringkas untuk dokumentasi MDX.
 */
function extractCodeValueFromChildren(children: ReactNode): string | undefined {
  const childArray = flattenElementChildren(children)

  for (const child of childArray) {
    const elementName = getElementName(child)
    const childProps = child.props as CodeItemProps & { children?: ReactNode }

    if (elementName === "CodeBlock.Code") {
      const { value } = childProps
      if (typeof value === "string" && value.length > 0) {
        return value
      }
    }

    // Fallback untuk node MDX yang kehilangan displayName tetapi tetap membawa value string.
    if (
      typeof childProps.value === "string" &&
      childProps.value.length > 0 &&
      childProps.children == null
    ) {
      return childProps.value
    }
  }

  return undefined
}

/**
 * Mengambil daftar baris kode dari children `<CodeBlock.Line />`.
 * Setiap line dijoin dengan newline agar menghasilkan source code final.
 */
function extractLinesFromChildren(children: ReactNode): string[] {
  const lines: string[] = []
  const childArray = flattenElementChildren(children)

  for (const child of childArray) {
    if (getElementName(child) === "CodeBlock.Line") {
      const { value } = child.props as LineItemProps
      lines.push(value)
    }
  }

  return lines
}

export default function CodeBlock({
  code,
  lang,
  variant = "default",
  fileName,
  tabs: tabsProp,
  defaultTab,
  header,
  showLineNumbers = true,
  title,
  highlight = [],
  focus = [],
  diff,
  oldCode,
  newCode,
  children,
  autoFormat = true,
}: CodeBlockProps) {
  const codeValueFromChildren = extractCodeValueFromChildren(children)
  const childLines = extractLinesFromChildren(children)
  const lineChildrenCode =
    childLines.length > 0 ? childLines.join("\n") : undefined
  const extractedCode = extractTextContent(children)
  const isStringChildren = typeof children === "string"
  const childTabs =
    !isStringChildren && !extractedCode ? extractTabsFromChildren(children) : []

  const resolvedCode = resolveCodeBlockContent({
    code: code ?? codeValueFromChildren,
    children,
    lineChildrenCode,
  })
  const resolvedLang = lang ?? "tsx"
  const resolvedTitle = resolveCodeBlockTitle({ title, fileName })
  const resolvedHighlight = normalizeLineNumberList(highlight)
  const resolvedFocus = normalizeLineNumberList(focus)
  const resolvedTabsProp = normalizeTabsList(tabsProp)
  const tabs =
    resolvedTabsProp.length > 0
      ? resolvedTabsProp
      : childTabs.map((t) => t.value)
  const activeTab = defaultTab ?? tabs[0]
  const resolvedDiff = resolveDiffConfig({ diff, oldCode, newCode })

  const diffLines = useMemo(() => {
    if (!resolvedDiff) return null
    return computeDiff(resolvedDiff.oldCode, resolvedDiff.newCode)
  }, [resolvedDiff])

  const contextValue = useMemo(
    () => ({
      showLineNumbers,
      highlight: resolvedHighlight,
      focus: resolvedFocus,
      autoFormat,
    }),
    [showLineNumbers, resolvedHighlight, resolvedFocus, autoFormat]
  )

  if (diffLines) {
    const codeBlock = (
      <DiffView
        lines={diffLines}
        showLineNumbers={showLineNumbers}
        title={title}
      />
    )

    return (
      <div className="w-full py-2">
        <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
          {codeBlock}
        </div>
      </div>
    )
  }

  if (variant === "tabs" && childTabs.length > 0) {
    return (
      <CodeBlockContext.Provider value={contextValue}>
        <div className="w-full py-2">
          <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/50 bg-muted/50">
              <Tabs defaultValue={activeTab}>
                <TabsList
                  className={cn(
                    "h-10 items-end gap-1 rounded-none bg-transparent ps-3 pt-0 pb-0",
                    "*:rounded-t-md *:border-0 *:border-b-2 *:px-3 *:text-muted-foreground",
                    "*:data-[state=active]:border-primary *:data-[state=active]:bg-background *:data-[state=active]:text-foreground *:data-[state=active]:shadow-none!"
                  )}
                >
                  {tabs.map((tab) => {
                    const TabIcon = getLangIcon(
                      childTabs.find((t) => t.value === tab)?.lang
                    )
                    return (
                      <TabsTrigger key={tab} value={tab}>
                        <TabIcon className="mr-1.5 h-3.5 w-3.5" />
                        {tab}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                {childTabs.map((tab) => (
                  <CodeBlockTab key={tab.value} {...tab} />
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </CodeBlockContext.Provider>
    )
  }

  const codeBlock = (
    <div className="group relative">
      {resolvedTitle && variant !== "header" && (
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/50 px-4 py-2.5">
          {(() => {
            const TitleIcon = getLangIcon(resolvedLang)
            return <TitleIcon className="h-4 w-4 text-muted-foreground" />
          })()}
          <span className="text-sm font-medium text-foreground">
            {resolvedTitle}
          </span>
        </div>
      )}
      <div className="relative">
        <SyntaxCode
          code={resolvedCode}
          lang={resolvedLang}
          autoFormat={autoFormat}
        />
        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton content={resolvedCode} />
        </div>
      </div>
    </div>
  )

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <div className="w-full py-2">
        <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
          {variant === "header" && (
            <div className="border-b border-border/50 bg-muted/50">
              {header ?? (
                <CodeBlockHeader
                  fileName={resolvedTitle ?? "code"}
                  lang={resolvedLang}
                />
              )}
            </div>
          )}
          {variant === "tabs" && (
            <div className="border-b border-border/50 bg-muted/50">
              <Tabs defaultValue={activeTab}>
                <TabsList
                  className={cn(
                    "h-10 items-end gap-1 rounded-none bg-transparent ps-3 pt-0 pb-0",
                    "*:rounded-t-md *:border-0 *:border-b-2 *:px-3 *:text-muted-foreground",
                    "*:data-[state=active]:border-primary *:data-[state=active]:bg-background *:data-[state=active]:text-foreground *:data-[state=active]:shadow-none!"
                  )}
                >
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
          {codeBlock}
        </div>
      </div>
    </CodeBlockContext.Provider>
  )
}

interface DiffViewProps {
  lines: DiffLine[]
  showLineNumbers: boolean
  title?: string
}

function DiffView({ lines, showLineNumbers, title }: DiffViewProps) {
  return (
    <div className="group relative">
      {title && (
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/50 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto bg-muted/30 dark:bg-muted/20">
        <table className="w-full border-collapse font-mono text-sm">
          <tbody>
            {lines.map((line, index) => (
              <tr
                key={index}
                className={cn(
                  "border-l-2",
                  line.type === "add" &&
                    "border-l-emerald-500 bg-emerald-500/10",
                  line.type === "remove" && "border-l-red-500 bg-red-500/10",
                  line.type === "normal" && "border-l-transparent"
                )}
              >
                {showLineNumbers && (
                  <>
                    <td className="w-12 px-3 py-0.5 text-right text-muted-foreground/50 select-none">
                      {line.oldLineNum ?? ""}
                    </td>
                    <td className="w-12 px-3 py-0.5 text-right text-muted-foreground/50 select-none">
                      {line.newLineNum ?? ""}
                    </td>
                  </>
                )}
                <td className="w-8 px-2 py-0.5 text-center">
                  {line.type === "add" && (
                    <Plus className="inline h-4 w-4 text-emerald-500" />
                  )}
                  {line.type === "remove" && (
                    <Minus className="inline h-4 w-4 text-red-500" />
                  )}
                </td>
                <td className="px-4 py-0.5 whitespace-pre">{line.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function getLangIcon(
  lang?: string
): React.ComponentType<{ className?: string }> {
  if (!lang) return fallbackLangIcon
  return langIconMap[lang.toLowerCase()] ?? fallbackLangIcon
}

export function CodeBlockHeader({
  fileName = "profile-card.tsx",
  lang,
}: {
  fileName?: string
  lang?: string
}) {
  const iconKey = lang?.toLowerCase()
  const IconComponent =
    (iconKey ? langIconMap[iconKey] : undefined) ?? fallbackLangIcon

  return (
    <div className="flex items-center gap-2 px-4 py-2.5">
      <IconComponent className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{fileName}</span>
    </div>
  )
}

const CopyButton = ({ content }: { content: string }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Button
      className="size-8 rounded-md border border-border/50 bg-background/80 text-muted-foreground backdrop-blur-sm hover:bg-background hover:text-foreground"
      onClick={() => copyToClipboard(content)}
      size="icon"
      variant="ghost"
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

CodeBlock.Tab = CodeBlockTabItem
CodeBlock.Line = CodeBlockLine
CodeBlock.Code = CodeBlockCode
