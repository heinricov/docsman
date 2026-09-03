import type { ReactNode } from "react"

/**
 * Meratakan seluruh node children MDX menjadi teks, termasuk unwrapping
 * elemen React lazy `_payload` yang dihasilkan React Server Components saat
 * children block-style (triple backticks) diserialize melintasi boundary
 * Server Component -> Client Component.
 *
 * Urutan penanganan:
 *   string/number -> React element (props) -> lazy `_payload` -> array
 */
export function extractTextContent(children: ReactNode): string | null {
  if (typeof children === "string") {
    return children
  }

  if (typeof children === "number") {
    return String(children)
  }

  // Handle React element (e.g., MDX code/pre element)
  if (children && typeof children === "object" && "props" in children) {
    const element = children as { props: { children?: ReactNode } }
    if (element.props.children) {
      const innerText = extractTextContent(element.props.children)
      if (innerText) {
        return innerText
      }
    }
  }

  // Handle React lazy/_payload element (RSC serialized MDX block-style children)
  if (
    children &&
    typeof children === "object" &&
    "_payload" in children &&
    (children as Record<string, unknown>)._payload
  ) {
    const payload = (children as Record<string, unknown>)._payload as {
      status?: string
      value?: { props?: { children?: ReactNode } }
    }
    if (payload.value?.props?.children) {
      const inner = extractTextContent(payload.value.props.children)
      if (inner) return inner
    }
  }

  // Handle arrays (e.g., multiple elements)
  if (Array.isArray(children)) {
    const texts = children
      .map((child) => extractTextContent(child))
      .filter(Boolean)
    if (texts.length > 0) {
      return texts.join("")
    }
  }

  return null
}
