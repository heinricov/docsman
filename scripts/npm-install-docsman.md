# docsman — panduan uji coba instal

Simulasikan apa yang dialami user saat melakukan `npm install docsman`, tanpa benar-benar publish ke registry.

## Ringkasan

Paket `docsman` menyediakan dua layout siap pakai:

- `LayoutBasic` — sidebar penuh + header (search form)
- `LayoutFloating` — sidebar melayang (floating) + header

Keduanya diimpor dari subpath `docsman/layouts`. Karena sudah ditandai sebagai **Client Component** (`"use client"`) di dalam paket, user **tidak perlu** menulis `"use client"` sendiri di root layout.

## Uji coba (sebelum publish)

1. Jalankan dari root repo:
   ```bash
   npm run docsman
   ```
   Script ini membangun paket `packages/docsman`, membuat tarball `docsman-<versi>.tgz`, memasangnya ke proyek uji `__tests__/next` (meniru `npm install docsman`), lalu mengecek tipe dengan `tsc --noEmit`.

2. Sebagai *user*, update `app/layout.tsx` di proyek uji secara manual. Contoh memakai `LayoutBasic`:

   ```tsx
   import type { Metadata } from "next"
   import { LayoutBasic } from "docsman/layouts"

   export const metadata: Metadata = {
     title: "My App",
   }

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

   Contoh memakai `LayoutFloating` — cukup ganti import dan komponennya:

   ```tsx
   import { LayoutFloating } from "docsman/layouts"
   // ...
   <body>
     <LayoutFloating>{children}</LayoutFloating>
   </body>
   ```

3. Opsional — tambahkan provider tema user sendiri (mis. `next-themes`):
   ```tsx
   import { ThemeProvider } from "@/components/theme-provider"
   // ...
   <body>
     <ThemeProvider>
       <LayoutBasic>{children}</LayoutBasic>
     </ThemeProvider>
   </body>
   ```
   > `ThemeProvider` adalah komponen **lokal** user (`@/components/theme-provider.tsx`, membungkus `next-themes`), **bukan** ekspor dari docsman.

4. Jalankan dev untuk verifikasi tampilan/eror:
   ```bash
   npm run dev
   ```

## Setelah publish

Untuk user baru:

1. `npm install docsman`
2. Update root layout:
   ```tsx
   import { LayoutBasic } from "docsman/layouts"

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
   Untuk `LayoutFloating`, ganti `LayoutBasic` dengan `LayoutFloating`.

## Catatan styling

CSS dashboard docsman dimuat lewat impor CSS. Pada setup monorepo/uji coba, pastikan `globals.css` user mengimport `docsman/globals.css` dan Tailwind men-scan paket:

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@source "../node_modules/docsman";
```

atau cukup `import "docsman/globals.css"` di `app/layout.tsx`.
