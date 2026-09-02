import React from "react"
import { cn } from "../lib/utils"

interface TypographyProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H1({ children, className, id }: TypographyProps) {
  return (
    <h1
      id={id}
      className={cn(
        "mt-8 mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className, id }: TypographyProps) {
  return (
    <h2
      id={id}
      className={cn(
        "mt-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className, id }: TypographyProps) {
  return (
    <h3
      id={id}
      className={cn(
        "mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className, id }: TypographyProps) {
  return (
    <h4
      id={id}
      className={cn(
        "mt-6 mb-2 scroll-m-20 text-xl font-semibold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h4>
  )
}

export function H5({ children, className, id }: TypographyProps) {
  return (
    <h5
      id={id}
      className={cn(
        "mt-4 mb-2 scroll-m-20 text-lg font-semibold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h5>
  )
}

export function H6({ children, className, id }: TypographyProps) {
  return (
    <h6
      id={id}
      className={cn(
        "mt-4 mb-2 scroll-m-20 text-base font-semibold tracking-tight text-foreground first:mt-0",
        className
      )}
    >
      {children}
    </h6>
  )
}

export function P({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "leading-7 text-muted-foreground not-first:mt-2",
        className
      )}
    >
      {children}
    </p>
  )
}

export function Blockquote({ children, className }: TypographyProps) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-primary/50 pl-6 text-muted-foreground italic",
        className
      )}
    >
      {children}
    </blockquote>
  )
}

// List Unordered
export function Ul({ children, className }: TypographyProps) {
  return (
    <ul
      className={cn(
        "my-6 ml-6 list-disc text-muted-foreground [&>li]:mt-2",
        className
      )}
    >
      {children}
    </ul>
  )
}

// List Ordered
export function Ol({ children, className }: TypographyProps) {
  return (
    <ol
      className={cn(
        "my-3 ml-6 list-decimal text-muted-foreground [&>li]:mt-2",
        className
      )}
    >
      {children}
    </ol>
  )
}

// List Item
export function Li({ children, className }: TypographyProps) {
  return <li className={cn("text-muted-foreground", className)}>{children}</li>
}

// Code
export function Code({ children, className }: TypographyProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground",
        className
      )}
    >
      {children}
    </code>
  )
}

// Preformatted Text
export function Pre({ children, className }: TypographyProps) {
  return (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm",
        className
      )}
    >
      {children}
    </pre>
  )
}

// Anchor
export function A({
  children,
  className,
  href,
}: TypographyProps & { href?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
        className
      )}
    >
      {children}
    </a>
  )
}

// Horizontal Rule
export function Hr({ className }: { className?: string }) {
  return <hr className={cn("my-12 border-border", className)} />
}

// Strong
export function Strong({ children, className }: TypographyProps) {
  return (
    <strong className={cn("font-semibold text-foreground", className)}>
      {children}
    </strong>
  )
}

// Emphasis
export function Em({ children, className }: TypographyProps) {
  return (
    <em className={cn("text-muted-foreground italic", className)}>
      {children}
    </em>
  )
}

// Typography component for mapping
export const typographyComponents = {
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
}
