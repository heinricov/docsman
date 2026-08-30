# docsman — panduan penggunaan (LayoutBasic & LayoutFloating)

Panduan untuk **user nyata** yang memasang `docsman` dan ingin memakai `LayoutBasic` atau `LayoutFloating`. Bagian "Uji coba sebelum publish" menjelaskan cara men-simulasi `npm install docsman` di repo ini.

## Cara kerja styling docsman (penting dibaca dulu)

`docsman` menyediakan **sistem warna default lengkap** yang di-scope dan **tidak bentrok** dengan thema milik user:

- **Warna base** (`--background`, `--foreground`, `--primary`, `--muted`, `--chart-*`, dst.) diambil dari `colors-styles.css`.
- **Warna sidebar** (`--sidebar*`) diambil dari `sidebar-styles.css`.

Keduanya ditulis memakai `:where()` (ber-specificity nol) di dalam `docsman/globals.css`. Akibatnya:
- **User mendefinisikan warna itu sendiri** (di `:root` / `.dark` mana pun) → **nilai user yang menang selalu**, apa pun urutannya.
- **User tidak mendefinisikan** → default **biru** docsman otomatis terpakai.
- **Font TIDAK disediakan docsman** — user mengatur sendiri (mis. `next/font`) via variabelnya.

> Karena Tailwind v4 mengabaikan `node_modules` secara default, user **wajib** menambahkan satu baris `@source "../node_modules/docsman"` agar class utility `bg-sidebar`, `bg-primary`, `text-foreground`, dst. ikut digenerate.

## Instal

```bash
npm install docsman
# pastikan dependency peer tersedia:
#   react, react-dom, + tailwindcss v4 + shadcn (untuk @custom-variant dark & utility)
```

## 1. Setup CSS (di `app/globals.css`)

Sekarang sangat ringkas — docsman sudah menyediakan warna base + sidebar:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "docsman/globals.css";   /* warna base + sidebar docsman (non-clash) */

@custom-variant dark (&:is(.dark *));
@source "../app/**/*.{ts,tsx}";      /* scan file app user */
@source "../node_modules/docsman";   /* scan class docsman — WAJIB */

/* (opsional) hubungkan font milikmu, contoh via next/font: */
@theme inline {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-heading: var(--font-serif);
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

Tidak perlu menulis blok `:root`/`.dark` untuk warna base — itu sudah dari docsman. Tambahkan saja jika ingin **meng-*override*** warna tertentu (lihat bagian "Kustomisasi warna").

> **Catatan non-`@import`:** bisa juga memuat CSS docsman lewat JS di `app/layout.tsx`:
>
> ```tsx
> import "docsman/globals.css"
> ```
>
> tetap harus ada `@source "../node_modules/docsman"` di CSS user-nya.

## 2. Root layout dengan `LayoutBasic`

```tsx
// app/layout.tsx
import type { Metadata } from "next"
import { LayoutBasic } from "docsman/layouts"

export const metadata: Metadata = { title: "My App" }

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LayoutBasic>{children}</LayoutBasic>
      </body>
    </html>
  )
}
```

## 3. Root layout dengan `LayoutFloating`

`LayoutFloating` — sidebar melayang (floating), dengan header, tanpa search form. Cukup ganti import & nama komponen:

```tsx
import { LayoutFloating } from "docsman/layouts"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LayoutFloating>{children}</LayoutFloating>
      </body>
    </html>
  )
}
```

Kedua layout sudah **Client Component** (`"use client"` ditandai di dalam paket), jadi user **tidak perlu** menulis `"use client"` di root layout.

## 4. (Opsional) ganti header

Kedua layout menerima prop `Header`:

```tsx
<LayoutBasic Header={<MyCustomHeader />}>{children}</LayoutBasic>
```

## 5. (Opsional) provider tema

```tsx
import { ThemeProvider } from "@/components/theme-provider"
// ...
<body>
  <ThemeProvider>
    <LayoutBasic>{children}</LayoutBasic>
  </ThemeProvider>
</body>
```

> `ThemeProvider` adalah komponen **lokal** user (membungkus `next-themes`), bukan ekspor docsman.

## Kustomisasi warna

docsman memakai `:where()` (specificity nol) untuk semua default-nya, jadi definisimu di `:root`/`.dark` **selalu menang**. Ganti warna base dengan override `--primary`, `--background`, dst.:

```css
:root {
  --primary: oklch(0.6 0.15 200);
  --background: oklch(0.98 0.01 240);
}
.dark {
  --primary: oklch(0.5 0.12 200);
}
```

Dan untuk warna sidebar, override token `--sidebar*`:

```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.5 0.134 242.749);
  --sidebar-primary-foreground: oklch(0.977 0.013 236.62);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.705 0.015 286.067);
}
```

Referensi lengkap token: `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`.

## Catatan setup workspace (monorepo)

Jika `docsman` diinstal sebagai workspace (symlink di-root, mis. `node_modules/docsman -> ../packages/docsman`), `@source "../node_modules/docsman"` di `app/globals.css` bisa tidak ketemu (symlink ter-hoist ke root). Arahkan langsung ke direktori source paket, contoh dari `apps/web/app/globals.css`:

```css
@source "../../../packages/docsman";
```

(Atau gunakan `transpilePackages: ["docsman"]` di `next.config.ts` dan arahkan `@source` ke lokasi paket yang sesuai.)

---

## Uji coba sebelum publish (simulasi `npm install docsman`)

1. Jalankan dari root repo:

   ```bash
   npm run docsman
   ```

   Script ini: build `packages/docsman` → buat tarball `docsman-<versi>.tgz` → pasang ke proyek uji `__tests__/next` (meniru `npm install docsman`) → cek tipe `tsc --noEmit` → hapus tarball.

2. Jalankan dari root proyek uji coba

   kita bisa tambahkan script docsman di **tests**/next/package.json:

   ```json
   "scripts": {
     "docsman": "bash ../../scripts/npm-install-docsman.sh"
   }
   ```

   Setelah itu, npm run docsman bisa dijalankan dari dalam **tests**/next/ pun.

3. Proyek uji `__tests__/next` memakai `LayoutBasic` di `app/layout.tsx`. `app/globals.css`-nya sudah memuat setup CSS lengkap (base thema + `@import "docsman/globals.css"` + `@source "../node_modules/docsman"`).

4. Untuk mencoba `LayoutFloating`, ubah import & komponen di `app/layout.tsx`:

   ```tsx
   import { LayoutFloating } from "docsman/layouts"
   // ...
   <LayoutFloating>{children}</LayoutFloating>
   ```

5. Verifikasi tampilan:
   ```bash
   cd __tests__/next
   npm run dev     # atau: npm run build && npm start
   ```
