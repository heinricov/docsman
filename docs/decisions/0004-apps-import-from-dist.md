# ADR-0004 — Aplikasi mengimpor dari `dist/`, bukan `src/`

**Status:** Accepted
**Tanggal:** 2026-09-02

## Konteks

`apps/web` dan `apps/docs` mengimpor docsman lewat subpath seperti `docsman/render`, `docsman/layouts`, dan `docsman/ui/*`. Peta `exports` di `packages/docsman/package.json` mengarahkan subpath tersebut ke **`dist/*.js`**; keduanya tidak mengonsumsi `src/` secara langsung.

Akibatnya: mengedit `packages/docsman/src/*` tidak langsung terlihat di aplikasi. Tanpa rebuild, browser tetap mendapat bundle lama dan debugging jadi menyesatkan (mis. kode yang diubah tidak berefek).

## Keputusan

Setelah mengubah `packages/docsman/src/*`, **wajib rebuild `dist/`** sebelum menguji aplikasi:

```bash
npm run build -w docsman        # atau: npm run build di akar (turbo)
```

## Alternatif

- Membiarkan aplikasi mengonsumsi `src/` (mis. alias) — meniadakan langkah rebuild, tetapi menyimpang dari kontrak package yang di-publish (`main`/`exports` → `dist`) dan bisa berbeda perilaku dengan apa yang user install.
- Hot-reload via Turbopack ke `src/` — mengganggu konsistensi dengan package terpublish.

## Konsekuensi

- Ada langkah build eksplisit dalam lingkaran pengembangan (didokumentasikan di `AGENTS.md` & `CONTRIBUTING.md`).
- Verifikasi harus dilakukan terhadap hasil rebuild, bukan asumsi source.