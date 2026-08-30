# docsman

Layout React & komponen sidebar siap pakai, dibangun di atas [Base UI](https://base-ui.com), bergaya shadcn, dan Tailwind CSS v4.

> Untuk panduan membangun/publish package ini ke npm, buka [`publish.md`](./publish.md).

## Langkah 1 — Install

```bash
npm install docsman
```

`react` dan `react-dom` adalah **peer dependencies** — pastikan React versi ^19 sudah terpasang di proyekmu sebelum lanjut.

## Langkah 2 — Setup Tailwind CSS (v4)

Package ini memakai Tailwind CSS v4. Pastikan kamu sudah menginstall dan mengaktifkan plugin `@tailwindcss/postcss` (diinstall otomatis sebagai dependency docsman).

1. Di file CSS utama aplikasimu (misal `app/globals.css`), import file CSS dari docsman:

   ```css
   @import "docsman/globals.css";
   ```

2. Tambahkan `@source` yang menunjuk ke file aplikasimu sendiri agar Tailwind memindai class yang kamu gunakan:

   ```css
   @source "../app/**/*.{ts,tsx}";
   ```

3. Pastikan selector `.dark` tersedia untuk mode gelap. Docsman mengekspos varian `dark` lewat:

   ```css
   @custom-variant dark (&:is(.dark *));
   ```

   Tambahkan baris tersebut di CSS-mu jika belum ada, lalu aktifkan mode gelap dengan menambahkan class `dark` pada elemen `<html>` (misal lewat `next-themes`).

## Langkah 3 — Gunakan layout

Import layout langsung dari subpath `docsman/layouts`:

```tsx
import { LayoutBasic, LayoutFloating } from "docsman/layouts"
```

Contoh di file `app/layout.tsx` (Next.js App Router):

```tsx
import { LayoutBasic } from "docsman/layouts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <LayoutBasic>{children}</LayoutBasic>
}
```

Dua layout tersedia:
- `LayoutBasic` — sidebar dengan header dan form pencarian.
- `LayoutFloating` — variant sidebar mengambang (floating) dengan switcher versi.

Layout menerima props:
- `children` — konten halaman (wajib).
- `Header` — elemen React untuk menggantikan header bawaan (opsional).

```tsx
<LayoutBasic Header={<CustomHeader />}>{children}</LayoutBasic>
```

## Langkah 4 — Pakai utilitas, hook, dan komponen UI (opsional)

```tsx
import { cn } from "docsman"
import { useIsMobile } from "docsman/hooks/use-mobile"
```

```tsx
import { Button } from "docsman/ui/button"
import { SidebarProvider, Sidebar } from "docsman/ui/sidebar"
```

## Catatan penting

- Package ini hanya menyediakan **komponen** — kamu tetap menyusun tata letak halaman sendiri di atas layout yang disediakan.
- Beberapa komponen memakai ikon `lucide-react`, animasi `tw-animate-css`, dan CSS variabel dari `@theme inline`. Pastikan file `docsman/globals.css` ter-import (lihat Langkah 2) agar semuanya tampil benar.
