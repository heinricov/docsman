import { Children, isValidElement, type ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

type TablePropsItem = {
  props: string
  type: string
  default: string
  description: string
}

type TablePropsProps = {
  props?: TablePropsItem[] | string | unknown[]
  children?: ReactNode
  [key: string]: unknown
}

type PropItemProps = TablePropsItem

/**
 * Menormalkan data props tabel dari berbagai bentuk input MDX.
 * Mendukung array langsung, string JSON, atau fallback dari prop array lain.
 */
function normalizeTablePropsData(
  input: unknown,
  fallbackProps: TablePropsProps
) {
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

  if (Array.isArray(input)) {
    return input.filter(isValidItem)
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input)
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidItem)
      }
    } catch {
      return []
    }
  }

  const otherPropArrays = Object.values(fallbackProps).filter(
    (value): value is unknown[] => Array.isArray(value) && value !== input
  )

  for (const value of otherPropArrays) {
    const normalized = value.filter(isValidItem)
    if (normalized.length > 0) return normalized
  }

  return []
}

/**
 * Mengambil data rows dari children `<PropItem />` untuk konteks MDX.
 * Pendekatan children dipakai karena compiler MDX sering membuang prop array/object.
 */
function extractTablePropsFromChildren(children: ReactNode): TablePropsItem[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return []

    const childProps = child.props as Partial<TablePropsItem>
    if (
      typeof childProps.props === "string" &&
      typeof childProps.type === "string" &&
      typeof childProps.default === "string" &&
      typeof childProps.description === "string"
    ) {
      return [
        {
          props: childProps.props,
          type: childProps.type,
          default: childProps.default,
          description: childProps.description,
        },
      ]
    }

    return []
  })
}

/**
 * Komponen child untuk mendefinisikan satu baris props table di dalam MDX.
 * Komponen ini tidak merender apapun dan hanya bertindak sebagai carrier data.
 */
export function PropItem(props: PropItemProps) {
  void props
  return null
}

/**
 * Menampilkan tabel daftar props untuk dokumentasi komponen di MDX.
 * Data tabel dapat diterima dari prop `props` atau dari children `<PropItem />`.
 */
export default function TableProps(componentProps: TablePropsProps) {
  const rowsFromChildren = extractTablePropsFromChildren(
    componentProps.children
  )
  const rows =
    rowsFromChildren.length > 0
      ? rowsFromChildren
      : normalizeTablePropsData(componentProps.props, componentProps)

  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead>Props</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Default</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((item) => (
          <TableRow className="odd:bg-muted/50" key={item.props}>
            <TableCell>{item.props}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.default}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
