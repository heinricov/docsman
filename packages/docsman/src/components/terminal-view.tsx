/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  Children,
  isValidElement,
} from "react"
// ✅ Import type TERPISAH (paling aman untuk semua konfigurasi TS,
//    kompatibel 100% dengan verbatimModuleSyntax maupun tanpa-nya)
import type { ReactNode, ReactElement } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import * as icons from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { LiaSpinnerSolid } from "react-icons/lia"
import {
  MdAttachMoney,
  MdOutlineCheck,
  MdOutlineChevronRight,
} from "react-icons/md"
import { TbQuestionMark, TbReload } from "react-icons/tb"

interface TerminalContextType {
  currentStep: number
  totalSteps: number
  advance: () => void
  reset: () => void
  process: boolean
}

const TerminalContext = createContext<TerminalContextType>({
  currentStep: -1,
  totalSteps: 0,
  advance: () => {},
  reset: () => {},
  process: false,
})

interface StepIndexContextType {
  stepIndex: number
}

const StepIndexContext = createContext<StepIndexContextType>({ stepIndex: -1 })

/**
 * Mendapatkan nama elemen React (function displayName/name atau tag DOM string).
 * Digunakan untuk mengklasifikasikan elemen tanpa bergantung Function.name
 * yang tidak stabil di lingkungan MDX / production minify.
 *
 * @param child Elemen React yang valid (isValidElement = true)
 * @returns Nama elemen (string) atau undefined jika tidak bisa dideteksi
 */
function getElementName(child: ReactElement): string | undefined {
  const type = child.type
  if (typeof type === "string") return type
  if (typeof type === "function") {
    return (
      (type as { displayName?: string }).displayName ||
      (type as { name?: string }).name ||
      undefined
    )
  }
  return undefined
}

/**
 * Mengecek apakah sebuah elemen adalah STEP COMPONENT terminal
 * (Command, Question, SelectItem, dll) yang harus dirender per-step.
 * Deteksi menggunakan DUA LAYER: (a) nama fungsi/displayName, (b) adanya
 * props khas (seperti `command`, `options`, `answer`, `success`).
 * Fallback props ini SANGAT PENTING jika Function.name di-minify MDX.
 *
 * @param child Elemen React yang valid
 * @returns true jika dia adalah step component yang harus di-push
 */
function isTerminalStepComponent(child: ReactElement): boolean {
  const name = getElementName(child)
  if (name) {
    const upper = name.toLowerCase()
    const stepNames = [
      "command",
      "process",
      "resault",
      "question",
      "selectitem",
      "massage",
      "terminalview",
      "codecommand",
    ]
    if (stepNames.includes(upper)) return true
  }
  const props = child.props as Record<string, unknown>
  if (typeof props.command === "string") return true
  if (Array.isArray(props.options)) return true
  if (typeof props.options === "string" && props.options.length > 0) return true
  if (typeof props.answer === "string") return true
  if (typeof props.success === "boolean") return true
  if (typeof props.title === "string" && typeof props.done !== "undefined")
    return true
  return false
}

/**
 * Mengecek apakah elemen adalah WRAPPER TYPOGRAPHY / DOM CONTAINER
 * yang harus di-unwrap (children-nya diekstrak, dirinya TIDAK di-push).
 * Mencakup DOM string (p, div, blockquote, pre, code, ul, ol, li, span, section)
 * dan wrapper function custom (P, Blockquote, Ul, Ol, Li, Strong, Em, Pre, Code).
 *
 * @param child Elemen React yang valid
 * @returns true jika dia adalah wrapper yang harus di-unwrap
 */
function isWrapperElement(child: ReactElement): boolean {
  const name = getElementName(child)
  if (!name) return false
  const lower = name.toLowerCase()
  const domWrappers = new Set([
    "p",
    "div",
    "blockquote",
    "pre",
    "code",
    "ul",
    "ol",
    "li",
    "span",
    "section",
    "article",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "small",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ])
  if (domWrappers.has(lower)) return true
  const fnWrappers = new Set([
    "P",
    "Blockquote",
    "Ul",
    "Ol",
    "Li",
    "Strong",
    "Em",
    "Pre",
    "Code",
    "A",
    "Hr",
  ])
  return fnWrappers.has(name)
}

/**
 * Meratakan children React secara rekursif dengan STRATEGI EXCLUSIVE.
 * TIGA KASUS EKSLUSIF (IF-ELIF-ELSE):
 *   (1) SKIP  TOTAL   → elemen adalah `Option` (hanya child internal SelectItem)
 *   (2) PUSH LANGSUNG → elemen adalah STEP COMPONENT (Command/Question/SelectItem/dll)
 *                       → JANGAN rekursi (step component punya render sendiri)
 *   (3) UNWRAP SAJA   → elemen adalah WRAPPER typography / DOM container
 *                       → HANYA extract children; dirinya SENDIRI TIDAK di-push
 *
 * Strategi ini MENGHINDARI DUPLIKASI (wrapper + children keduanya dirender)
 * yang menyebabkan error React duplicate key `.0` / `.1`.
 * Juga MENGECUALIKAN `Option` dari step list atas (Option bukan step terminal).
 *
 * @param node Node React apa saja (tree berapapun kedalamannya)
 * @returns Array step component valid dalam urutan appearance (tanpa duplikat)
 */
function flattenChildren(node: ReactNode): ReactNode[] {
  const result: ReactNode[] = []
  const arr = Children.toArray(node)

  for (const child of arr) {
    if (!isValidElement(child)) {
      continue
    }

    const name = getElementName(child)

    if (name === "Option") {
      continue
    }

    const childProps = child.props as { children?: ReactNode }
    const grandChildren = childProps.children
    const hasGrandChildren =
      grandChildren != null && Children.count(grandChildren) > 0

    if (isTerminalStepComponent(child)) {
      result.push(child)
      continue
    }

    if (isWrapperElement(child)) {
      if (hasGrandChildren) {
        result.push(...flattenChildren(grandChildren))
      }
      continue
    }

    if (hasGrandChildren) {
      result.push(...flattenChildren(grandChildren))
    }
    result.push(child)
  }

  return result
}

export function TerminalView({
  title,
  children,
  process = false,
}: Readonly<{
  title?: string
  children: ReactNode
  process?: boolean
}>) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [key, setKey] = useState(0)

  const advance = useCallback(() => {
    setCurrentStep((prev) => prev + 1)
  }, [])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setKey((k) => k + 1)
  }, [])

  // ✅ Hapus key dari dependency (children sudah cukup; key cuma untuk remount inner div)
  const childArray = useMemo(() => {
    return flattenChildren(children)
  }, [children])

  // ✅ HAPUS: useEffect + setState di dalamnya menyebabkan cascading render
  //    (logic process sudah di-handle oleh initial useState(-1) + key reset)

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps: childArray.length,
      advance,
      reset,
      process,
    }),
    [currentStep, childArray.length, advance, reset, process]
  )

  return (
    <TerminalContext.Provider value={value}>
      <div
        className="my-4 w-full rounded-md border"
        data-terminal-view="true"
        data-steps-count={childArray.length}
        data-process={process ? "true" : "false"}
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex">
            <GoDotFill className="m-0 size-6 p-0 text-orange-500" />
            <GoDotFill className="m-0 size-6 p-0 text-yellow-500" />
            <GoDotFill className="m-0 size-6 p-0 text-green-500" />
          </div>
          <p className="text-sm font-light">
            {title || "my-folder/my-project"}
          </p>
          <Button variant="ghost" className="rounded" onClick={reset}>
            <TbReload size={16} />
          </Button>
        </div>
        {/* ✅ Tailwind arbitrary value: pakai [] bukan () */}
        <div className="-mb-[--card-spacing]">
          <div
            key={key}
            className="max-h-64 space-y-0.5 overflow-y-scroll border-t bg-muted/50 p-3 text-sm leading-relaxed"
          >
            {process
              ? childArray.map((child, index) => {
                  if (index > currentStep) return null
                  return (
                    <StepIndexContext.Provider
                      key={`${key}-${index}`}
                      value={{ stepIndex: index }}
                    >
                      {child}
                    </StepIndexContext.Provider>
                  )
                })
              : childArray}
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 text-xs">
          Navigate
          <icons.MoveUp className="size-3" />,{" "}
          <icons.MoveDown className="size-3" />,{" "}
          <Badge variant="outline">
            Enter <icons.CornerDownLeft />
          </Badge>
        </div>
      </div>
    </TerminalContext.Provider>
  )
}

/**
 * Timer hook untuk mengatur kapan sebuah step otomatis lanjut ke step berikutnya.
 * Hanya berjalan saat `process=true` dan giliran step ini (currentStep === stepIndex).
 * Jika `interactive > 0` maka akan menunggu selama `interactive` detik sebelum advance.
 *
 * @param interactive Jumlah detik penundaan (opsional, default=langsung advance)
 */
function useStepTimer(interactive?: number) {
  const { currentStep, advance, process } = useContext(TerminalContext)
  const { stepIndex } = useContext(StepIndexContext)
  const doneRef = useRef(false)
  const isMyTurn = process && currentStep === stepIndex

  // ✅ TAMBAHKAN dependency array (sebelumnya TIDAK ADA → infinite loop!)
  useEffect(() => {
    if (!isMyTurn || doneRef.current) return
    if (interactive && interactive > 0) {
      const t = setTimeout(() => {
        doneRef.current = true
        advance()
      }, interactive * 1000)
      return () => clearTimeout(t)
    }
    doneRef.current = true
    advance()
  }, [isMyTurn, interactive, advance])
}

export function Command({
  command,
  interactive,
}: {
  command: string
  interactive?: number
}) {
  useStepTimer(interactive)
  return (
    <div className="flex items-center gap-2">
      <MdAttachMoney className="text-blue-500" />
      <p>{command}</p>
    </div>
  )
}

export function Process({
  command,
  done: doneProp,
  interactive,
}: {
  command: string
  done?: boolean | string
  answer?: string
  interactive?: number
}) {
  const { currentStep } = useContext(TerminalContext)
  const { stepIndex } = useContext(StepIndexContext)
  useStepTimer(interactive)

  // ✅ Derived value SAJA (hapus useState + useEffect yang memanggil setState)
  const isDone = currentStep >= stepIndex
  const showDone = interactive ? isDone : !!doneProp
  const doneMessage = typeof doneProp === "string" ? doneProp : command

  return (
    <div className="flex items-center gap-2">
      {showDone ? (
        <>
          <MdOutlineCheck className="text-green-400" />
          <p>{doneMessage}</p>
        </>
      ) : (
        <>
          <span className="animate-spin text-yellow-400">
            <LiaSpinnerSolid />
          </span>
          <p>{command}</p> <span>...</span>
        </>
      )}
    </div>
  )
}

export function Resault({
  command,
  children,
}: {
  command: string
  children?: ReactNode
}) {
  useStepTimer()

  return (
    <div className="flex flex-col">
      <div className="ml-5 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{command}</span>
      </div>
      {children && <div className="mt-1 ml-6 space-y-1">{children}</div>}
    </div>
  )
}

export function ResaultItem({ children }: { children: ReactNode }) {
  return (
    <div className="ml-5 flex items-center gap-2">
      -<span className="text-muted-foreground">{children}</span>
    </div>
  )
}

export function Question({
  command,
  done,
  answer,
  interactive,
}: {
  command: string
  done?: boolean
  answer?: string
  interactive?: number
}) {
  useStepTimer(interactive)

  return (
    <div className="flex gap-2">
      {done ? (
        <div className="flex items-center gap-2">
          <MdOutlineCheck className="text-green-400" />
          <p>{command}</p> <span className="text-green-400">{answer}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <TbQuestionMark className="text-yellow-400" />
          <p>{command}</p> <span>...</span>
        </div>
      )}
    </div>
  )
}

/**
 * Komponen `<Option>` untuk digunakan SEBAGAI CHILDREN dari `<SelectItem>`.
 *
 * CARA PAKAI (REKOMENDASI KHUSUS MDX — menghindari masalah array literal props):
 * ```mdx
 * <SelectItem command="Pilih framework">
 *   <Option value="next" />
 *   <Option value="astro" />
 *   <Option value="svelte" />
 * </SelectItem>
 * ```
 *
 * Pendekatan ini 100% stabil di MDX karena menggunakan struktur JSX children
 * yang tidak ditransformasikan formatnya oleh MDX compiler,
 * berbeda dengan array literal `options={["a","b"]}` pada JSX props.
 */
export function Option(_props: { value?: string; children?: ReactNode }) {
  return null
}

/**
 * Menampilkan pertanyaan dengan daftar pilihan (select options).
 *
 * MENERIMA DUA FORMAT INPUT (PRIORITAS TERATAS = CHILDREN DAHULU):
 *
 * 1. ✅ REKOMENDASI (via children `<Option>`):
 *    <SelectItem command="...">
 *      <Option value="next" />
 *      <Option value="astro" />
 *    </SelectItem>
 *
 * 2. Via prop `options` (cocok untuk TSX / non-MDX):
 *    <SelectItem command="..." options={["next", "astro"]} />
 *    <SelectItem command="..." options="next,astro" />
 *    <SelectItem command="..." options='["vue","angular"]' />
 *
 * Format prop `options` mendukung: array string, string CSV (dipisah koma),
 * atau string JSON array.
 *
 * MENYERTAKAN DATA-ATTRIBUT DEBUG:
 * - data-selftest="OK" jika komponen berjalan
 * - data-options-source="children" / "props" / "none"
 * - data-options-count=N jumlah options berhasil di-parse
 *
 * Untuk melihatnya: klik kanan SelectItem di browser → Inspect → lihat attributes
 */
export function SelectItem(
  props: Readonly<{
    command: string
    select?: string
    options?: string[] | string | number[] | unknown[]
    interactive?: number
    children?: ReactNode
    [key: string]: unknown
  }>
) {
  const { command, select, options, interactive, children } = props
  useStepTimer(interactive)
  const hasSelected = select != null && select !== ""

  const opts = useMemo<string[]>(() => {
    const processArr = (arr: unknown[]): string[] =>
      arr
        .map((o) => (typeof o === "number" ? String(o) : o))
        .filter((o): o is string => typeof o === "string" && o.length > 0)

    const childNodes = Children.toArray(children)
    const childOpts: string[] = []
    for (const n of childNodes) {
      if (isValidElement(n)) {
        const p = n.props as { value?: string; children?: ReactNode }
        const v = p.value
        if (typeof v === "string" && v.length > 0) {
          childOpts.push(v)
        } else if (p.children) {
          const textChild = Children.toArray(p.children)
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
            .trim()
          if (textChild.length > 0) childOpts.push(textChild)
        }
      }
    }
    if (childOpts.length > 0) return childOpts

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
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
        if (splitArr.length > 0) return splitArr
      }
    }

    const otherPropArrays = Object.values(props).filter(
      (v): v is unknown[] => Array.isArray(v) && v.length > 0 && v !== options
    )
    for (const arr of otherPropArrays) {
      const processed = processArr(arr)
      if (processed.length > 0) return processed
    }

    const objectValues = Object.values(props).filter(
      (v): v is Record<string, unknown> =>
        typeof v === "object" && v !== null && !Array.isArray(v)
    )
    for (const obj of objectValues) {
      const arr = Object.values(obj)
      if (arr.length > 0) {
        const processed = processArr(arr)
        if (processed.length > 0) return processed
      }
    }

    return []
  }, [options, props, children])

  const childNodes = Children.toArray(children)
  const hasChildOptions = childNodes.some(
    (n) =>
      isValidElement(n) &&
      (n.type as unknown as { name?: string }).name === "Option"
  )

  const optionsSource = hasChildOptions
    ? "children"
    : Array.isArray(options) || typeof options === "string"
      ? "props"
      : "none"

  const optionsType = Array.isArray(options)
    ? "array"
    : typeof options === "string"
      ? "string"
      : options == null
        ? "nullish"
        : typeof options
  let rawSerialized = ""
  try {
    rawSerialized = JSON.stringify(options).slice(0, 200)
  } catch {
    rawSerialized = "[unserializable]"
  }

  return (
    <div
      className="flex flex-col"
      data-selftest="OK"
      data-command={command}
      data-has-selected={hasSelected ? "true" : "false"}
      data-options-source={optionsSource}
      data-options-type={optionsType}
      data-options-count={opts.length}
      data-options-raw={rawSerialized}
    >
      <div className="flex items-center gap-2">
        {hasSelected ? (
          <MdOutlineCheck className="text-green-400" />
        ) : (
          <TbQuestionMark className="text-yellow-400" />
        )}
        <p>{command}</p>{" "}
        {hasSelected ? (
          <span className="text-green-400">{select}</span>
        ) : (
          <span>...</span>
        )}
      </div>
      {!hasSelected && opts.length > 0 ? (
        <div className="mt-1 ml-6 space-y-1">
          {opts.map((option, index) => (
            <div
              key={`${String(option)}-${index}`}
              className="flex items-center gap-2"
            >
              {index === 0 ? (
                <>
                  <MdOutlineChevronRight className="text-gray-300" />
                  <span className="text-gray-300">{option}</span>
                </>
              ) : (
                <span className="ml-5 text-muted-foreground">{option}</span>
              )}
            </div>
          ))}
        </div>
      ) : null}
      {!hasSelected && opts.length === 0 ? (
        <div
          className="mt-1 ml-6 rounded border border-dashed border-destructive/40 p-2 text-xs text-destructive/70"
          data-debug-only="true"
        >
          [debug: options tidak ditemukan. source={optionsSource}; type=
          {optionsType}; raw=&quot;{rawSerialized}&quot;]
        </div>
      ) : null}
    </div>
  )
}

/**
 * Menampilkan pesan info dengan ikon di terminal.
 *
 * @param icon Nama ikon lucide-react (default: "Coffee")
 * @param description Teks pesan yang ditampilkan (default: "Setup Success !")
 */
export function Massage({
  icon = "Coffee",
  description = "Setup Success !",
}: {
  icon?: string
  description?: string
}) {
  const IconComponent = icons[
    icon as keyof typeof icons
  ] as React.ComponentType<{ className?: string }>
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {IconComponent && <IconComponent className="size-3" />}
      <span>{description}</span>
    </div>
  )
}
