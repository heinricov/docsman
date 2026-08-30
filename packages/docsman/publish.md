# docsman

Kumpulan layout React & komponen sidebar yang bisa dipakai ulang, dibangun di atas [Base UI](https://base-ui.com), bergaya shadcn, dan Tailwind CSS v4.

## Instalasi

```bash
npm install docsman
```

`react` dan `react-dom` adalah **peer dependencies** — pastikan versi React ^19 sudah terpasang di proyekmu.

## Penggunaan

Import layout langsung dari subpath `docsman/layouts`:

```tsx
import { LayoutBasic } from "docsman/layouts"
import { LayoutFloating } from "docsman/layouts"
```

```tsx
import { LayoutBasic } from "docsman/layouts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <LayoutBasic>{children}</LayoutBasic>
}
```

Import utilitas & hook:

```tsx
import { cn } from "docsman"
import { useIsMobile } from "docsman/hooks/use-mobile"
```

Import komponen UI (subpath `docsman/ui/*`):

```tsx
import { Button } from "docsman/ui/button"
import { SidebarProvider } from "docsman/ui/sidebar"
```

## Setup Tailwind CSS (v4)

Agar variabel & tema sidebar tersedia, import file CSS-nya di CSS utama Tailwind konsumen:

```css
@import "docsman/globals.css";
```

Tambahkan `@source` yang menunjuk ke file aplikasimu sendiri agar Tailwind memindai class yang kamu pakai:

```css
@source "../app/**/*.{ts,tsx}";
```

Package ini berekspektasi konsumen memakai Tailwind CSS v4 dengan plugin `@tailwindcss/postcss` (dipasang otomatis sebagai dependency).

## Publish ke npm

Package ini sudah disiapkan untuk di-publish (`"private": false`, `files: ["dist", "postcss.config.mjs", "README.md"]`, `prepublishOnly` menjalankan `build`).

1. Login ke npm (sekali saja):

   ```bash
   npm login
   ```

2. (Opsional) cek isi paket yang akan dikirim, tanpa benar-benar publish:

   ```bash
   npm pack --dry-run
   ```

3. Publish:

   ```bash
   npm publish
   ```

   Untuk versi pra-rilis (beta):

   ```bash
   npm publish --tag beta
   ```

4. Untuk memperbarui versi, naikkan field `version` di `packages/docsman/package.json` (misal `0.1.0` → `0.1.1`), lalu `npm publish` lagi.
