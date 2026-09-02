import { ReactNode } from "react"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import { cn } from "../lib/utils"
import { getMdxFile } from "../lib/mdx"
import { PaginationSection } from "./pagination"
import {
  HeaderSection,
  Toc,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Blockquote,
  Ul,
  Ol,
  Li,
  Code,
  Pre,
  A,
  Hr,
  Strong,
  Em,
  AlertSection,
  LogoSection,
  Logo,
  CodeCommand,
  CardSection,
  Card,
  CodeBlock,
  CodeBlockCode,
  CodeBlockLine,
  CodeBlockTabItem,
  StepsSection,
  Step,
  FileTree,
  Folder,
  File,
  TablePropsBase,
  PropItem,
  ComponentCodePreview,
  Component,
  CodePreview,
  TerminalView,
  Command,
  Question,
  Process,
  SelectItemBase,
  Option,
  Resault,
  ResaultItem,
  Massage,
} from "docsman/render-client"

const MdxCodeBlock = Object.assign(CodeBlock, {
  Code: CodeBlockCode,
  Line: CodeBlockLine,
  Tab: CodeBlockTabItem,
})

/**
 * Helper untuk mengkonversi options dari berbagai format menjadi array string
 * (khusus untuk konteks MDX compile-time, di mana props bisa ditransformasi).
 * Berjalan di Server Component (tanpa hook), jadi eksekusi sinkron biasa.
 */
function normalizeMdxOptions(
  options: unknown,
  fallbackProps: Record<string, unknown>
): string[] | undefined {
  const processArr = (arr: unknown[]): string[] =>
    arr
      .map((o) => (typeof o === "number" ? String(o) : o))
      .filter((o): o is string => typeof o === "string" && o.length > 0)

  if (Array.isArray(options)) {
    const processed = processArr(options)
    if (processed.length > 0) return processed
  }

  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options)
      if (Array.isArray(parsed)) {
        const processed = processArr(parsed)
        if (processed.length > 0) return processed
      }
    } catch {
      const splitArr = options
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
      if (splitArr.length > 0) return splitArr
    }
  }

  const otherArrays = Object.values(fallbackProps).filter(
    (v): v is unknown[] => Array.isArray(v) && v.length > 0 && v !== options
  )
  for (const arr of otherArrays) {
    const processed = processArr(arr)
    if (processed.length > 0) return processed
  }

  return undefined
}

/**
 * Wrapper SelectItem khusus untuk MDX (Server Component friendly):
 * - Menormalisasi props options sebelum meneruskannya ke komponen asli.
 * - Menangani kasus di mana MDX compiler mengubah format array props.
 * - Berjalan di server (compile-time render MDX), tidak pakai hook.
 * - MENERUSKAN SEMUA props (termasuk props tidak dikenal) via spread,
 *   agar attribute MDX / custom props lain tidak hilang.
 * - Menambahkan data-mdx-wrapper="true" untuk memverifikasi wrapper ini dieksekusi.
 */
function SelectItem(
  props: Readonly<{
    command: string
    select?: string
    options?: string[] | string | number[] | unknown[]
    interactive?: number
    children?: ReactNode
    [key: string]: unknown
  }>
) {
  const normalizedOptions = normalizeMdxOptions(
    props.options,
    props as Record<string, unknown>
  )

  const finalOptions =
    normalizedOptions && normalizedOptions.length > 0
      ? normalizedOptions
      : props.options

  return (
    <SelectItemBase
      {...props}
      options={finalOptions}
      data-mdx-wrapper="true"
      data-mdx-options-normalized={
        normalizedOptions && normalizedOptions.length > 0 ? "true" : "false"
      }
    />
  )
}

type TablePropsItem = {
  props: string
  type: string
  default: string
  description: string
}

/**
 * Helper untuk menormalkan data `TableProps` dari berbagai format MDX.
 * Mendukung array langsung, string JSON, object berisi numeric keys,
 * dan fallback dari props lain yang mungkin diubah oleh compiler MDX.
 */
function normalizeMdxTableProps(
  input: unknown,
  fallbackProps: Record<string, unknown>
): TablePropsItem[] | undefined {
  const isValidItem = (item: unknown): item is TablePropsItem => {
    if (typeof item !== "object" || item === null) return false

    const candidate = item as Record<string, unknown>
    return (
      typeof candidate.props === "string" &&
      typeof candidate.type === "string" &&
      typeof candidate.default === "string" &&
      typeof candidate.description === "string"
    )
  }

  const processArr = (arr: unknown[]): TablePropsItem[] =>
    arr.filter(isValidItem)

  if (Array.isArray(input)) {
    const processed = processArr(input)
    if (processed.length > 0) return processed
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input)
      if (Array.isArray(parsed)) {
        const processed = processArr(parsed)
        if (processed.length > 0) return processed
      }
    } catch {
      // Abaikan string yang bukan JSON valid.
    }
  }

  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    const processed = processArr(Object.values(input))
    if (processed.length > 0) return processed
  }

  const otherPropArrays = Object.values(fallbackProps).filter(
    (value): value is unknown[] => Array.isArray(value) && value !== input
  )
  for (const arr of otherPropArrays) {
    const processed = processArr(arr)
    if (processed.length > 0) return processed
  }

  const otherPropObjects = Object.values(fallbackProps).filter(
    (value): value is Record<string, unknown> =>
      typeof value === "object" && value !== null && !Array.isArray(value)
  )
  for (const obj of otherPropObjects) {
    const processed = processArr(Object.values(obj))
    if (processed.length > 0) return processed
  }

  return undefined
}

/**
 * Wrapper `TableProps` khusus MDX:
 * - Menormalkan array/object props dari compiler MDX
 * - Meneruskan seluruh props lain agar tidak hilang
 */
function TableProps(
  props: Readonly<{
    props?: TablePropsItem[] | string | unknown[] | Record<string, unknown>
    [key: string]: unknown
  }>
) {
  const normalizedProps = normalizeMdxTableProps(
    props.props,
    props as Record<string, unknown>
  )

  return (
    <TablePropsBase
      {...props}
      props={normalizedProps ?? []}
      data-mdx-wrapper="true"
      data-mdx-props-normalized={normalizedProps ? "true" : "false"}
      data-mdx-props-count={normalizedProps?.length ?? 0}
    />
  )
}

const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  li: Li,
  code: Code,
  pre: Pre,
  a: A,
  hr: Hr,
  strong: Strong,
  em: Em,
  AlertSection,
  LogoSection,
  Logo,
  CodeCommand,
  CardSection,
  Card,
  CodeBlock: MdxCodeBlock,
  "CodeBlock.Code": CodeBlockCode,
  "CodeBlock.Line": CodeBlockLine,
  "CodeBlock.Tab": CodeBlockTabItem,
  StepsSection,
  Step,
  FileTree,
  Folder,
  File,
  TableProps,
  PropItem,
  ComponentCodePreview,
  Component,
  CodePreview,
  TerminalView,
  Command,
  Question,
  Process,
  SelectItem,
  Option,
  Resault,
  ResaultItem,
  Massage,
}

interface DocmanLayoutRenderProps {
  children?: ReactNode
  className?: string
  slug?: string
  dir?: string
}

interface FrontmatterData {
  title: string
  description?: string
  [key: string]: unknown
}

export async function DocmanLayoutRender({
  children,
  className,
  slug: slugProp,
  dir,
}: DocmanLayoutRenderProps) {
  const slug = slugProp || "index"
  // If dir is provided, read and compile MDX from filesystem
  if (dir) {
    const mdxFile = getMdxFile(dir, slug)

    if (mdxFile) {
      const { content, frontmatter } = await compileMDX<FrontmatterData>({
        source: mdxFile.raw,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: { light: "github-light", dark: "github-dark" },
                  keepBackground: false,
                },
              ],
            ],
          },
        },
        components: mdxComponents,
      })

      const fm = frontmatter as FrontmatterData

      return (
        <section className={cn("py-15 md:py-10", className)}>
          <div className="container mx-auto flex w-full max-w-6xl overflow-visible px-4">
            <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-20">
              <div className="lg:col-span-2">
                <HeaderSection title={fm.title} description={fm.description} />
                <div className="flex flex-col gap-4 text-[15px]/relaxed text-foreground/80">
                  {content}
                </div>
                <PaginationSection dir={dir} slug={slug} />
              </div>
              <Toc />
            </div>
          </div>
        </section>
      )
    }

    // File not found
    return (
      <section className={cn("py-5 md:py-10", className)}>
        <div className="container mx-auto flex w-full max-w-6xl overflow-visible px-4">
          <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-20">
            <div className="lg:col-span-2">
              <HeaderSection
                title="Not Found"
                description="The requested content could not be found."
              />
              <PaginationSection dir={dir} slug={slug} />
            </div>
            <Toc />
          </div>
        </div>
      </section>
    )
  }

  // Fallback: show children or empty state
  return (
    <section className={cn("py-5 md:py-10", className)}>
      <div className="container mx-auto flex w-full max-w-6xl overflow-visible px-4">
        <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-20">
          <div className="lg:col-span-2">
            <HeaderSection />
            {children || (
              <p className="text-muted-foreground">No content available.</p>
            )}
            <PaginationSection dir={dir} slug={slug} />
          </div>
          <Toc />
        </div>
      </div>
    </section>
  )
}

export default DocmanLayoutRender
