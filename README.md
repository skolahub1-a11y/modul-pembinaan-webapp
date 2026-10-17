# Modul Pembinaan WebApp

Laman modul latihan guru: bina web app sekolah sendiri tanpa pelayan dan tanpa kos.

**Stack:** Gemini Canvas (frontend) → Google Apps Script (backend) → Google Sheets (database) → hosting percuma (Google Sites / Cloudflare Pages / Netlify / GitHub Pages).

## Isi kandungan

| Modul | Topik |
|---|---|
| Peta besar | Empat bahagian web app: frontend, backend, database, hosting |
| 1 | Frontend dengan Gemini Canvas (prompt siap guna) |
| 2 | Backend Google Apps Script (`Code.gs`, deploy `/exec`, CORS 403) |
| 3 | Database Google Sheets (struktur, had, ujian) |
| 4 | Bila Sheet tak cukup: Supabase, Firebase, MongoDB Atlas, MariaDB |
| 5 | Hosting percuma + langkah GitHub Pages |
| 6 | Keselamatan & amalan baik |
| Amali | Latihan 30 minit + senarai semak |
| Bantuan | Masalah biasa & penyelesaian, soalan lazim |

## Ciri laman

- **Mod Bentang** — paparan slaid penuh (12 slaid). Kekunci `←` `→` untuk tukar slaid, `Esc` untuk keluar, `P` untuk buka.
- **Dua tema** — "studio" (gelap) dan "kertas" (krem) melalui butang tema; pilihan disimpan dalam pelayar.
- Butang salin untuk prompt Canvas, `Code.gs` dan kod ujian.
- Senarai semak amali dengan bar kemajuan (disimpan dalam pelayar).
- Tiada rangka kerja luar — HTML + CSS + JS sahaja, boleh disimpan sebagai fail dan digunakan tanpa internet.

## Struktur

```
site/
  index.html   # struktur + kandungan modul
  style.css    # sistem reka bentuk (2 tema)
  app.js       # nav, tab, salin, senarai semak, mod bentang
```

## Hos

- GitHub Pages (lama ini sendiri), atau
- Cloudflare Pages / Netlify (drag & drop folder `site/`), atau
- Google Sites (embed URL app Apps Script `/exec`).
