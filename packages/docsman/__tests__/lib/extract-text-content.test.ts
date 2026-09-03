import { describe, expect, it } from "vitest"
import type { ReactNode } from "react"
import { extractTextContent } from "../../src/lib/extract-text-content"
import { createElement } from "react"

/**
 * Membantu membentuk elemen lazy `_payload` seperti yang dikirim React Server
 * Components ketika children block-style MDX (triple backticks) diserialize
 * melintasi boundary Server Component -> Client Component.
 * RSC menyandikan elemen lazy dengan objek `_payload`, sehingga di-cast ke
 * `ReactNode` agar selaras dengan tipe ekspektasi fungsi.
 */
function lazyPayload(payloadValue: unknown): ReactNode {
  return {
    _payload: { status: "fulfilled", value: payloadValue },
  } as unknown as ReactNode
}

describe("extractTextContent", () => {
  it("returns the string as-is", () => {
    expect(extractTextContent("const a = 1")).toBe("const a = 1")
  })

  it("returns an empty string for null/undefined", () => {
    expect(extractTextContent(null)).toBeNull()
    expect(extractTextContent(undefined)).toBeNull()
  })

  it("converts numbers to string", () => {
    expect(extractTextContent(42)).toBe("42")
  })

  it("extracts text from a plain React element", () => {
    const element = createElement("code", null, "import { x } from 'y'")
    expect(extractTextContent(element)).toBe("import { x } from 'y'")
  })

  it("descends into nested pre/code elements from MDX", () => {
    const element = createElement(
      "pre",
      null,
      createElement("code", { className: "language-tsx" }, "const a = 1")
    )
    expect(extractTextContent(element)).toBe("const a = 1")
  })

  it("joins arrays of strings and elements", () => {
    expect(extractTextContent(["a", "b", "c"])).toBe("abc")
  })

  // --- The core regression: RSC lazy `_payload` unwrapping ---
  it("unwraps a lazy _payload element produced by RSC for MDX block children", () => {
    const childrenPayload = lazyPayload({
      props: {
        children: "import { DocmanLayoutRender } from 'docsman/render'",
      },
    })
    expect(extractTextContent(childrenPayload)).toBe(
      "import { DocmanLayoutRender } from 'docsman/render'"
    )
  })

  it("unwraps a nested _payload inside a pre/code element (the reported bug)", () => {
    const codeElement = lazyPayload({
      props: {
        children: createElement(
          "code",
          { className: "language-tsx" },
          "export default async function DocsPage() { return null }"
        ),
      },
    })
    expect(extractTextContent(codeElement)).toBe(
      "export default async function DocsPage() { return null }"
    )
  })

  it("unwraps _payload nested inside arrays", () => {
    const payloadChild = lazyPayload({ props: { children: "line-1" } })
    const arrayChild = lazyPayload({ props: { children: "line-2" } })
    expect(extractTextContent([payloadChild, arrayChild])).toBe(
      "line-1line-2"
    )
  })

  it("unwraps _payload whose value is a full lazy element tree", () => {
    const nestedPayload = lazyPayload({
      props: { children: "shadcn@latest init" },
    })
    expect(extractTextContent(lazyPayload({ props: { children: nestedPayload } }))).toBe(
      "shadcn@latest init"
    )
  })

  it("ignores a fulfilled _payload with no resolvable children", () => {
    expect(extractTextContent(lazyPayload({}))).toBeNull()
  })
})
