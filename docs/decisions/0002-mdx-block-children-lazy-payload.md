# ADR-0002 — MDX block children jadi lazy `_payload` di client component

**Status:** Accepted
**Tanggal:** 2026-09-02

## Konteks

Ketika sebuah komponen `"use client"` (mis. `CodeCommand`) menerima anak **block-style** dari MDX:

```mdx
<CodeCommand execute defaultTab="npm">
  shadcn@latest init --preset b1tMcUdYu --template next --pointer
</CodeCommand>
```

child tidak sampai sebagai string/array sederhana. Di lintasan RSC/SSR, `children` tergerak sebagai React **lazy element** dengan bentuk:

```json
{
  "_payload": {
    "status": "fulfilled",
    "value": { "props": { "children": "shadcn@latest init ..." } }
  }
}
```

Ekstraksi teks yang hanya memeriksa `typeof children === "string"` / objek ber-`props` / array, maka:
- di **server (SSR)** nilai yang di-unwrap kosong (`""`), karena lazy belum ter-resolve sebagai elemen ber-`props` langsung → `packageName` = `""`
- di **klien** lazy ter-resolve → teks penuh

→ **Hydration mismatch** (`server rendered `npx ` vs client `npx shadcn@latest ...``).

## Keputusan

Fungsi ekstraksi teks (mis. `extractTextContent` di `code-command.tsx`) harus menangani bentuk lazy: ketika objek punya `_payload`, baca `_payload.value?.props?.children` lalu rekursi. Urutan: `string`/`number` → elemen ber-`props` → lazy `_payload` → array.

## Alternatif

- Sebagai string saja dengan `.trim()` — gagal karena block children bukan string polos; keluaran `npx ` kosong.
- Menggunakan `Children.toArray` — tidak membongkar lazy `_payload` secara langsung.
- Memaksa child menjadi string via prop eksplisit (mis. `command=`) — mengubah API komponen; tidak dilakukan agar usage di MDX tetap ergonomis.

## Konsekuensi

- Setiap komponen client yang mengekstrak teks dari block-style children **harus** membongkar `_payload` agar hasil server sama dengan klien.
- Bila bentuk serialize React berubah di versi Next/React baru, fungsi ekstraksi perlu diaudit ulang.