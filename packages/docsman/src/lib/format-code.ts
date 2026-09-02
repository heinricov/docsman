import { format as prettierFormat } from "prettier/standalone"
import * as prettierPluginBabel from "prettier/plugins/babel"
import * as prettierPluginEstree from "prettier/plugins/estree"
import * as prettierPluginTypescript from "prettier/plugins/typescript"
import * as prettierPluginHtml from "prettier/plugins/html"
import * as prettierPluginPostcss from "prettier/plugins/postcss"
import * as prettierPluginMarkdown from "prettier/plugins/markdown"

type PrettierOptions = {
  semi?: boolean
  singleQuote?: boolean
  tabWidth?: number
  trailingComma?: "none" | "all" | "es5"
  printWidth?: number
  bracketSpacing?: boolean
  arrowParens?: "always" | "avoid"
  parser?: string
  plugins?: unknown[]
}

type ParserEntry = {
  parser: string
  plugins: unknown[]
}

const defaultOptions: PrettierOptions = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: "always",
}

const parserMap: Record<string, ParserEntry> = {
  javascript: {
    parser: "babel",
    plugins: [prettierPluginBabel, prettierPluginEstree],
  },
  js: {
    parser: "babel",
    plugins: [prettierPluginBabel, prettierPluginEstree],
  },
  jsx: {
    parser: "babel",
    plugins: [prettierPluginBabel, prettierPluginEstree],
  },
  typescript: {
    parser: "typescript",
    plugins: [prettierPluginTypescript, prettierPluginEstree],
  },
  ts: {
    parser: "typescript",
    plugins: [prettierPluginTypescript, prettierPluginEstree],
  },
  tsx: {
    parser: "typescript",
    plugins: [prettierPluginTypescript, prettierPluginEstree],
  },
  json: {
    parser: "json",
    plugins: [prettierPluginEstree],
  },
  json5: {
    parser: "json",
    plugins: [prettierPluginEstree],
  },
  css: {
    parser: "css",
    plugins: [prettierPluginPostcss],
  },
  scss: {
    parser: "css",
    plugins: [prettierPluginPostcss],
  },
  html: {
    parser: "html",
    plugins: [prettierPluginHtml],
  },
  markdown: {
    parser: "markdown",
    plugins: [prettierPluginMarkdown],
  },
  mdx: {
    parser: "markdown",
    plugins: [prettierPluginMarkdown],
  },
}

/**
 * Memilih parser yang lebih cocok untuk snippet MDX.
 * Jika isinya berupa JSX/HTML-like block, parser HTML memberi indentasi atribut
 * yang lebih rapi daripada parser markdown biasa.
 */
function resolveMdxEntry(code: string): ParserEntry {
  const trimmedCode = code.trim()

  if (trimmedCode.startsWith("<") && trimmedCode.includes(">")) {
    return {
      parser: "html",
      plugins: [prettierPluginHtml],
    }
  }

  return parserMap.mdx as ParserEntry
}

export async function formatCode(
  code: string,
  lang: string,
  options?: Partial<PrettierOptions>
): Promise<string> {
  const normalizedLang = lang.toLowerCase()
  const entry =
    normalizedLang === "mdx" ? resolveMdxEntry(code) : parserMap[normalizedLang]

  if (!entry) {
    return code.trim()
  }

  try {
    const formatted = await prettierFormat(code.trim(), {
      ...defaultOptions,
      ...options,
      parser: entry.parser,
      plugins: entry.plugins as never[],
    })
    return formatted
  } catch {
    return code.trim()
  }
}
