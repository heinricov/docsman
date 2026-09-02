# ADR-0003 — Typography MDX hanya terdaftar lowercase

**Status:** Accepted
**Tanggal:** 2026-09-02

## Konteks

`mdxComponents` di `packages/docsman/src/render/docman-render.tsx` (≈ baris 252) memetakan tag element hasil MDX ke komponen React. Untuk tipografi, komponen hanya terdaftar di bawah **kunci lowercase**: `h1`–`h6`, `p`, `blockquote`, `ul`, `ol`, `li`, `code`, `pre`, `a`, `hr`, `strong`, `em`.

Tag kapital (`<H1>`, `<P>`, `<A>`) **tidak** terdaftar, sehingga konten yang memakainya gagal dengan `HTTP 500` — `Expected component ... to be defined`.

## Keputusan

- Gunakan **Markdown standar** (heading `#`, `##`, paragraf, list, `**bold**`, dst.) untuk konten dokumentasi, bukan tag JSX kapital.
- Komponen penampil kode/expose bisa dipakai via JSX ketika memang didaftarkan, tetapi konten tipografi sebaiknya Markdown asli.

## Alternatif

- Mendaftarkan varian kapital juga — menaikkan permukaan API dan bisa menciptakan hasil ganda/ambigu.
- Menulis artikel tanpa heading — tidak realistis untuk dokumentasi.

## Konsekuensi

- Penulis konten perlu menulis Markdown alih-alih `<H1>`; hal ini sudah terdokumentasi di `AGENTS.md` dan `CONTRIBUTING.md`.
- Tidak perlu memperbaiki renderer untuk tag kapital selama konten ikut konvensi.