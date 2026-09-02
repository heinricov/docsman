# Contributing to docsman

**docsman** adalah kit komponen React (layout & sidebar) di atas Base UI, bergaya shadcn, dan Tailwind CSS v4 — plus situs dokumentasi yang menampilkannya. Panduan ini menjelaskan cara kerja repo dan langkah yang diikuti saat menambahkan atau mengubah sesuatu.

> Baca `AGENTS.md` di root untuk konteks singkat + peringatan (NOTA pnpm, rebuild `dist/`, dsb.). Alasan di balik keputusan teknis ada di `docs/decisions/`.

## Struktur

```
apps/web     situs showcase utama (dokumentasi "asli", served di port 3000)
apps/docs    situs dokumentasi kedua
packages/docsman   kit komponen yang di-publish ke npm
docs/decisions/    catatan keputusan arsitektur (ADR-style)
```

## Tooling — TUJUAN

- **Turborepo di atas npm workspaces** (`"packageManager": "npm@11.19.0"`). **Jangan pakai `pnpm`.**
- Instalasi: `npm install` di akar.
- Perintah di akar dijalankan oleh turbo ke semua workspace:
  - `npm run build`, `npm run dev`, `npm run lint`, `npm run format`, `npm run typecheck`
  - Per-package: `npm run <task> -w docsman` (atau `-w web`, `-w docs`), atau jalankan di dalam direktori package.

## Lingkaran pengembangan (komponen di `packages/docsman`)

Karena `apps/*` mengimpor docsman dari `dist/` (bukan `src/`), setiap edit pada `packages/docsman/src/*` **harus di-rebuild dulu** sebelum terlihat di aplikasi:

1. Edit source: `packages/docsman/src/components/<komponen>.tsx`
2. Rebuild `dist`:
   ```bash
   npm run build -w docsman      # atau dari akar: npm run build
   ```
3. Verifikasi build tidak error & typecheck bersih:
   ```bash
   npm run typecheck -w docsman
   ```
4. Jalankan dev server (lihat di bawah), periksa halaman yang terdampak.
5. Matikan dev server setelah selesai.

## Menjalankan dev server & mematikkannya

`apps/web` default di port **3000**:

```bash
cd apps/web && npm run dev
```

Verifikasi dengan `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/docs` (harapkan `200`).

**SELALU matikan setelah verifikasi** — jangan tinggalkan proses menggantung:

```bash
lsof -ti :3000 | xargs kill -9
```

Jika muncul "Another next dev server is already running", ada dev server lama:
```bash
lsof -ti :3000 :3001           # cek PID yang tersisa
pkill -f 'next dev'            # atau kill PID spesifik
```

## Menambahkan komponen/docs baru (contoh alur)

1. Buat komponen di `packages/docsman/src/components/` (ikuti gaya komponen yang ada: `"use client"` bila perlu interaksi, gunakan `cn` dari `../lib/utils`).
2. Daftarkan di `mdxComponents` pada `packages/docsman/src/render/docman-render.tsx` (perhatikan: typography hanya terdaftar lowercase — lihat `AGENTS.md`).
3. Rebuild `dist`: `npm run build -w docsman`.
4. Buat/update doc MDX di `apps/*/content/docs/...` menggunakan komponen via tag `<...>` (tidak perlu import — sudah auto-register). Gunakan **Markdown standar** untuk heading/paragraf.
5. Verifikasi halaman: jalankan dev server, cek `HTTP 200`, lalu matikan server.

## Menulis dokumen products (MDX)

- Typography pakai Markdown biasa (`#`, `##`, `**bold**`, list, dll.) — bukan tag kapital.
- Attribute string di JSX MDX **tidak** mendukung escape `\"`. Pakai single-quote, `value={'...'}`, atau hindari escape. Contoh valid: `value={'<TableProps props=\'[{"props":"slug"}]\' />'}` (lihat `AGENTS.md`).
- Block-style children pada client component (`use client`) di-serialize sebagai React lazy `_payload` — ekstraksi teks custom harus unwrap `_payload.value.props.children` (lihat `docs/decisions/0002-...`).

## Publish & rilis (WAJIB manual oleh pemilik)

- **Jangan** menjalankan `npm publish` / `npm pack` / `npm login` dari sisi kontributor otomatis — publish dilakukan manual oleh pemilik.
- Rilis: naikkan `version` di `packages/docsman/package.json`, lalu ikuti langkah `packages/docsman/publish.md`.
- Untuk uji coba lokal berupa simulasi `npm install docsman` ke app test: `npm run docsman` di akar (memanggil `scripts/npm-install-docsman.sh`). Jangan dimodifikasi tanpa konteks.

## Sebelum commit

- Jalankan lint & typecheck di workspace yang berubah:
  ```bash
  npm run lint -w docsman && npm run typecheck -w docsman
  ```
- Ikuti gaya commit repo (ringkas, konvensional). Hanya commit saat diminta.