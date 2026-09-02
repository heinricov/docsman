"use client"

import { useSyncExternalStore } from "react"

function getSnapshot() {
  return window.location.pathname
}

function getServerSnapshot() {
  return "/"
}

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
