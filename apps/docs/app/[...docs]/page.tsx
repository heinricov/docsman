// docsman/render Package (server entry — MDX renderer)
import { DocmanLayoutRender } from "docsman/render"

export default async function DocsPage({
  params,
}: {
  params: Promise<{ docs?: string[] }>
}) {
  const { docs = [] } = await params
  const segments = docs[0] === "docs" ? docs.slice(1) : docs

  return <DocmanLayoutRender dir="/docs" slug={segments.join("/") || "index"} />
}
