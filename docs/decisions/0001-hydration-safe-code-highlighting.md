# ADR-0001 — Hydration-safe syntax highlighting

**Status:** Accepted
**Tanggal:** 2026-09-02

## Konteks

Komponen `CodeCommand` dan `CodeBlock` menggunakan `react-syntax-highlighter` (Prism) untuk menampilkan kode. Saat `SyntaxHighlighter` di-render selama SSR dengan `wrapLines` + `lineProps` (yang menyuntikkan inline `style` per baris pada `<span>`), output HTML server tidak cocok dengan output klien → error React `Hydration failed because the server rendered HTML didn't match the client` (mis. `Encountered a script tag` / `Hydration failed`).

## Keputusan

Gunakan **mounted-guard berbasis `useSyncExternalStore`**:

```ts
const mounted = useSyncExternalStore(
  () => () => {},
  () => true,    // snapshot klien
  () => false,   // snapshot server
)
```

Selama belum ter-mount (SSR dan paint pertama), render **`<pre><code>` polos**. Setelah hydration/klien siap, baru mount `SyntaxHighlighter`. Pola ini dipakai konsisten di `CodeCommand.CommandRow` dan `SyntaxCode` (di dalam `CodeBlock`).

## Alternatif

- `suppressHydrationWarning` / `dangerouslySetInnerHTML` — menekan peringatan tanpa memperbaiki ketidakcocokan DOM.
- CSS-only approach (tanpa syntax highlighting) — kehilangan fitur highlight.
- SSR `SyntaxHighlighter` dengan `wrapLines={false}` — bisa aman, tapi pola mounted-guard lebih seragam dan mudah diikuti di semua komponen.

## Konsekuensi

- Konten samar/plain muncul sesaat hingga klien mount — dapat diterima, dan lebih aman daripada hydration error.
- Pola ini harus **tetap diikuti** saat menambahkan komponen highlight baru.