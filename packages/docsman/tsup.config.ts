import { defineConfig } from "tsup"
import { cpSync } from "node:fs"

export default defineConfig({
  splitting: false,
  entry: [
    "src/index.ts",
    "src/layouts/index.ts",
    "src/layouts/layout-basic.tsx",
    "src/layouts/layout-floating.tsx",
    "src/lib/utils.ts",
    "src/hooks/use-mobile.ts",
    "src/ui/button.tsx",
    "src/ui/input.tsx",
    "src/ui/label.tsx",
    "src/ui/separator.tsx",
    "src/ui/skeleton.tsx",
    "src/ui/card.tsx",
    "src/ui/avatar.tsx",
    "src/ui/breadcrumb.tsx",
    "src/ui/collapsible.tsx",
    "src/ui/dropdown-menu.tsx",
    "src/ui/sheet.tsx",
    "src/ui/sidebar.tsx",
    "src/ui/tooltip.tsx",
    "src/navigations/app-logo.tsx",
    "src/navigations/search-form.tsx",
    "src/navigations/app-header-basic.tsx",
    "src/navigations/app-header-floating.tsx",
    "src/navigations/app-sidebar-basic.tsx",
    "src/navigations/app-sidebar-floating.tsx",
    "src/navigations/nav-collaps.tsx",
    "src/navigations/nav-menus.tsx",
    "src/navigations/nav-switcher.tsx",
  ],
  format: ["esm"],
  dts: true,
  outDir: "dist",
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "@base-ui/react",
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "next-themes",
    "tw-animate-css",
    "shadcn",
    "zod",
  ],
  onSuccess: async () => {
    cpSync("src/styles/globals.css", "dist/globals.css")
    cpSync("src/styles/colors-styles.css", "dist/colors-styles.css")
    cpSync("src/styles/sidebar-styles.css", "dist/sidebar-styles.css")
  },
})
