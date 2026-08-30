# docsman — panduan uji coba instal

Simulasikan apa yang dialami user saat melakukan `npm install docsman`, tanpa benar-benar publish ke registry.

## Uji coba (sebelum publish)

1. Jalankan dari root repo:
   ```bash
   npm run docsman
   ```
   Script ini membangun paket `packages/docsman`, membuat tarball `docsman-<versi>.tgz`, memasangnya ke proyek uji `__tests__/next` (meniru `npm install docsman`), lalu mengecek tipe dengan `tsc --noEmit`.

2. Sebagai *user*, saya bisa meng-update `app/layout.tsx` di proyek uji secara manual, misalnya:
   ```ts
   import { LayoutBasic } from "docsman/layouts"
   import { ThemeProvider } from "@/components/theme-provider"
   ```
   - `LayoutBasic` adalah contoh import dari paket `docsman`.
   - `ThemeProvider` adalah komponen lokal user (`@/components/theme-provider.tsx`, membungkus `next-themes`), bukan ekspor dari docsman.

## Setelah publish

1. `npm install docsman`
2. User bisa meng-update root layout secara manual, misalnya:
   ```ts
   import { LayoutBasic } from "docsman/layouts"
   import { ThemeProvider } from "@/components/theme-provider"
   ```
