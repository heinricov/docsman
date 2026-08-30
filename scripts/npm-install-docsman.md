# docsman — panduan penggunaan (LayoutBasic & LayoutFloating)

Panduan untuk **user nyata** yang memasang `docsman` dan ingin memakai `LayoutBasic` atau `LayoutFloating`. Bagian "Uji coba sebelum publish" menjelaskan cara men-simulasi `npm install docsman` di repo ini.

## Cara kerja styling docsman (penting dibaca dulu)

`docsman` **tidak** menyertakan full thema shadcn. Paket ini hanya menyumbang token khusus _sidebar_ yang di-scope (via `@theme inline` + `@theme default`), sehingga **tidak bentrok** dengan thema milik user:

- **User memegang thema dasarnya** sendiri: `--background`, `--foreground`, `--primary`, `--chart-*`, font, dst. (biasanya yang dihasilkan `shadcn init`).
- **docsman menyediakan nilai fallback** untuk `--sidebar*`. Jika user **tidak** mendefinisikan `--sidebar*`, nilai bawaan docsman otomatis terpakai. Jika user **mendefinisikan sendiri** (di `:root` / `.dark`), nilai user yang menang (karena `@theme default` berprioritas terendah).
- Karena Tailwind v4 mengabaikan `node_modules` secara default, user **wajib** menambahkan satu baris `@source "../node_modules/docsman"` agar class utility `bg-sidebar`, `text-sidebar-foreground`, dst. ikut digenerate.

## Instal

```bash
npm install docsman
# pastikan dependency peer tersedia:
#   react, react-dom, + tailwindcss v4 + shadcn (untuk @custom-variant dark & utility)
```

## 1. Setup CSS (di `app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "docsman/globals.css";   /* token sidebar docsman (scoped, non-clash) */

@custom-variant dark (&:is(.dark *));
@source "../app/**/*.{ts,tsx}";      /* scan file app user */
@source "../node_modules/docsman";   /* scan class docsman — WAJIB */

/* ====== thema dasar milik USER (contoh dari shadcn init) ====== */
@theme inline {
  /* --color-* bridge ke var --* user */
}

:root {
  /* --background, --primary, --muted, dst. SUDAH di-scope user */
}

.dark {
  /* versi dark */
}
```

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

## Kustomisasi warna sidebar

Untuk mengganti warna sidebar, definisikan token `--sidebar*` sendiri — nilai user mengalahkan bawaan docsman:

```css
:root {
  --sidebar: oklch(0.97 0 0);
  --sidebar-foreground: oklch(0.14 0.005 285);
  --sidebar-primary: oklch(0.45 0.12 260);      /* dll. */
}
.dark {
  --sidebar: oklch(0.2 0.01 285);
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

2. Proyek uji `__tests__/next` memakai `LayoutBasic` di `app/layout.tsx`. `app/globals.css`-nya sudah memuat setup CSS lengkap (base thema + `@import "docsman/globals.css"` + `@source "../node_modules/docsman"`).

3. Untuk mencoba `LayoutFloating`, ubah import & komponen di `app/layout.tsx`:

   ```tsx
   import { LayoutFloating } from "docsman/layouts"
   // ...
   <LayoutFloating>{children}</LayoutFloating>
   ```

4. Verifikasi tampilan:
   ```bash
   cd __tests__/next
   npm run dev     # atau: npm run build && npm start
   ```
