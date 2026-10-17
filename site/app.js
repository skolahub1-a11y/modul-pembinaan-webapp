/* ============================================================
   Modul Pembinaan WebApp — app.js
   Semua logik dibalut dalam IIFE untuk elak pertembungan nama
   dengan global pelayar (top, name, status, length...).
   ============================================================ */
(function () {
  "use strict";

  var doc = document;

  /* ---------------- tema ---------------- */
  var THEME_KEY = "mpw:theme";
  var themeBtn = doc.getElementById("themeBtn");

  function applyTheme(mode) {
    doc.documentElement.setAttribute("data-theme", mode === "kertas" ? "kertas" : "studio");
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
  }
  var savedTheme = "studio";
  try { savedTheme = localStorage.getItem(THEME_KEY) || "studio"; } catch (e) {}
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var now = doc.documentElement.getAttribute("data-theme");
      applyTheme(now === "kertas" ? "studio" : "kertas");
    });
  }

  /* ---------------- tarikh ---------------- */
  var bulan = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
  var tgl = doc.getElementById("tarikhKemas");
  if (tgl) {
    var d = new Date();
    tgl.textContent = bulan[d.getMonth()] + " " + d.getFullYear();
  }

  /* ---------------- bar nav: progress + scrollspy ---------------- */
  var topbar = doc.getElementById("topbar");
  var barProgress = doc.getElementById("barProgress");
  var navAnchors = Array.prototype.slice.call(doc.querySelectorAll("#navlinks a"));
  var navTargets = navAnchors
    .map(function (a) { return doc.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function onScroll() {
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 8);
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    if (barProgress) barProgress.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";

    var best = -1, bestTop = -1e9;
    navTargets.forEach(function (sec, i) {
      var t = sec.getBoundingClientRect().top;
      if (t < window.innerHeight * 0.42 && t > bestTop) { bestTop = t; best = i; }
    });
    navAnchors.forEach(function (a, i) { a.classList.toggle("active", i === best); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------------- reveal on scroll ---------------- */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "-40px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------------- tab zon peta ---------------- */
  var zoneTabs = doc.getElementById("zoneTabs");
  if (zoneTabs) {
    var zButtons = Array.prototype.slice.call(zoneTabs.querySelectorAll("button"));
    var zPanels = Array.prototype.slice.call(doc.querySelectorAll(".zone-panel"));
    zoneTabs.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-t]");
      if (!btn) return;
      var key = btn.getAttribute("data-t");
      zButtons.forEach(function (b) { b.setAttribute("aria-selected", String(b === btn)); });
      zPanels.forEach(function (p) { p.setAttribute("data-open", String(p.getAttribute("data-g") === key)); });
    });
  }

  /* ---------------- butang salin ---------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand("copy") ? resolve() : reject(new Error("execCommand gagal")); }
      catch (err) { reject(err); }
      finally { doc.body.removeChild(ta); }
    });
  }

  Array.prototype.slice.call(doc.querySelectorAll(".codeblock")).forEach(function (block) {
    var btn = block.querySelector(".copy");
    var code = block.querySelector("pre code");
    if (!btn || !code) return;
    btn.addEventListener("click", function () {
      copyText(code.innerText).then(function () {
        btn.classList.add("done");
        btn.setAttribute("title", "Sudah disalin");
        setTimeout(function () { btn.classList.remove("done"); btn.setAttribute("title", "Salin"); }, 1600);
      }).catch(function () {
        btn.setAttribute("title", "Salin gagal — pilih manual");
      });
    });
  });

  /* ---------------- senarai semak ---------------- */
  var boxes = Array.prototype.slice.call(doc.querySelectorAll(".check"));
  function saveChecks() {
    var state = {};
    boxes.forEach(function (b) { state[b.getAttribute("data-key")] = b.checked; });
    try { localStorage.setItem("mpw:checks", JSON.stringify(state)); } catch (e) {}
  }
  function refreshProgress() {
    var all = boxes, done = boxes.filter(function (b) { return b.checked; }).length;
    var prog = doc.getElementById("progAmali");
    if (prog) prog.style.width = (all.length ? (done / all.length) * 100 : 0) + "%";
  }
  try {
    var stored = JSON.parse(localStorage.getItem("mpw:checks") || "{}");
    boxes.forEach(function (b) { if (stored[b.getAttribute("data-key")]) b.checked = true; });
  } catch (e) {}
  boxes.forEach(function (b) {
    b.closest(".step").classList.toggle("done", b.checked);
    b.addEventListener("change", function () {
      b.closest(".step").classList.toggle("done", b.checked);
      saveChecks(); refreshProgress();
    });
  });
  refreshProgress();

  /* ---------------- mod bentang ---------------- */
  var SLIDES = [
    {
      kicker: "Selamat datang",
      title: "Modul Pembinaan WebApp",
      body: "<p class=\"big\">Bina aplikasi web sekolah sendiri — tanpa pelayan, tanpa kos bulanan.</p>" +
        "<div class=\"slide-kpi\">" +
        "<div class=\"stat\"><b>6 modul</b><span>peta → frontend → backend → database → hosting → keselamatan</span></div>" +
        "<div class=\"stat\"><b>90 minit</b><span>termasuk amali 30 minit</span></div>" +
        "<div class=\"stat\"><b>RM0</b><span>Gemini Canvas + Apps Script + Sheets + hosting percuma</span></div>" +
        "</div>"
    },
    {
      kicker: "Masalah",
      title: "Cara lama vs cara baru",
      body: "<ul class=\"clean\">" +
        "<li><b>Cara lama:</b> borang kertas → ditaip ke Excel → versi berbeza setiap guru → laporan dikira tangan.</li>" +
        "<li><b>Cara baru:</b> guru isi web app dari telefon → data masuk satu Sheet → laporan dikira app.</li>" +
        "<li><b>Kos:</b> RM0. <b>Pengetahuan:</b> cukup untuk diselenggara sendiri.</li>" +
        "</ul>"
    },
    {
      kicker: "Peta besar",
      title: "Empat bahagian sesebuah web app",
      body: "<ul class=\"clean\">" +
        "<li><b>Frontend</b> — apa yang dilihat guru (index.html, dari Gemini Canvas).</li>" +
        "<li><b>Backend</b> — otak: semak, proses, simpan rahsia (Code.gs, Apps Script).</li>" +
        "<li><b>Database</b> — gudang data (Google Sheets, atau Supabase/Firebase/MongoDB/MariaDB).</li>" +
        "<li><b>Hosting</b> — supaya orang lain boleh masuk (Google Sites, Cloudflare Pages, Netlify, GitHub Pages).</li>" +
        "</ul>"
    },
    {
      kicker: "Modul 1",
      title: "Frontend dengan Gemini Canvas",
      body: "<ul class=\"clean\">" +
        "<li>Satu prompt → dua hasil: <b>index.html</b> + <b>Code.gs</b>.</li>" +
        "<li>Canvas = bengkel, bukan database dan bukan host.</li>" +
        "<li>Peraturan besi: <b>jangan sekali-kali</b> letak API key atau kata laluan di frontend.</li>" +
        "<li>Kod mesti diuji: loading, berjaya, ralat, empty state.</li>" +
        "</ul>"
    },
    {
      kicker: "Modul 2",
      title: "Backend: Google Apps Script",
      body: "<ul class=\"clean\">" +
        "<li>Extensions → Apps Script dalam Sheet: tampal Code.gs.</li>" +
        "<li>Deploy → New deployment → <b>Web app</b> (Execute as Me).</li>" +
        "<li>Salin URL berakhir <b>/exec</b> (bukan /dev, bukan URL editor).</li>" +
        "<li>Selepas ubah kod: <b>New version → Deploy</b>; URL kekal sama.</li>" +
        "<li>Had percuma: ~20,000 permintaan/hari, 6 minit setiap pelaksanaan.</li>" +
        "</ul>"
    },
    {
      kicker: "Modul 3",
      title: "Database: Google Sheets",
      body: "<ul class=\"clean\">" +
        "<li>Baris 1 = header tetap; satu tab = satu jadual.</li>" +
        "<li>Guna ID unik untuk elak rekod berganda; simpan tarikh sebagai tarikh.</li>" +
        "<li>Had ~10 juta sel setiap fail; pengguna serentak banyak boleh lembap.</li>" +
        "<li><b>Backup mingguan wajib</b> — Sheet boleh dipadam sesiapa yang ada akses.</li>" +
        "</ul>"
    },
    {
      kicker: "Modul 4",
      title: "Bila Sheet tak cukup",
      body: "<ul class=\"clean\">" +
        "<li><b>Perlu login &amp; peranan?</b> → Supabase atau Firebase.</li>" +
        "<li><b>Data tak seragam / log?</b> → MongoDB Atlas.</li>" +
        "<li><b>Sekolah ada pelayan sendiri?</b> → MariaDB/MySQL (atau Supabase self-host).</li>" +
        "<li>Semua ada peringkat percuma. Amalan sama: semakan hak akses mesti di <b>server</b>.</li>" +
        "</ul>"
    },
    {
      kicker: "Modul 5",
      title: "Hosting percuma",
      body: "<ul class=\"clean\">" +
        "<li><b>Google Sites</b> — embed URL /exec; paling mudah untuk guru.</li>" +
        "<li><b>Cloudflare Pages</b> — drag &amp; drop, CDN laju, boleh guna domain sekolah.</li>" +
        "<li><b>Netlify</b> — app.netlify.com/drop, hidup dalam 30 saat.</li>" +
        "<li><b>GitHub Pages</b> — simpan versi; modul ini sendiri diletak di sini.</li>" +
        "</ul>"
    },
    {
      kicker: "Modul 6",
      title: "Keselamatan &amp; amalan baik",
      body: "<ul class=\"clean\">" +
        "<li>Rahsia (API key, token) di backend — Script Properties.</li>" +
        "<li>Sahkan semua input di server; jangan percaya frontend.</li>" +
        "<li>Login akaun sekolah + peranan untuk data murid.</li>" +
        "<li>Backup berjadual; jejak siapa ubah apa; kumpul data yang perlu sahaja.</li>" +
        "</ul>"
    },
    {
      kicker: "Amali",
      title: "Latihan 30 minit",
      body: "<ul class=\"clean\">" +
        "<li>Canvas → index.html + Code.gs (5 min).</li>" +
        "<li>Sheet baru + tampal Code.gs (5 min).</li>" +
        "<li>Deploy → salin URL /exec (5 min).</li>" +
        "<li>Sambung frontend + uji simpan &amp; baca (5 min).</li>" +
        "<li>Hosting: GitHub Pages / Netlify / Google Sites (10 min).</li>" +
        "</ul>"
    },
    {
      kicker: "Bila tak menjadi",
      title: "Tiga kesilapan paling kerap",
      body: "<ul class=\"clean\">" +
        "<li><b>403</b> — header <span class=\"mono\">Content-Type: application/json</span> mencetuskan preflight. Buang header itu.</li>" +
        "<li><b>Kod lama masih jalan</b> — perlu <b>New version</b> pada deployment.</li>" +
        "<li><b>“Tak nampak perubahan”</b> — cache pelayar. Ctrl+Shift+R atau incognito.</li>" +
        "</ul>"
    },
    {
      kicker: "Penutup",
      title: "Satu app kecil hari ini",
      body: "<p class=\"big\">Lebih berguna daripada rancangan besar tahun depan.</p>" +
        "<ul class=\"clean\">" +
        "<li>Pilih satu masalah sebenar di sekolah anda.</li>" +
        "<li>Selesaikan sepenuhnya sebelum menambah fitur.</li>" +
        "<li>Ajar seorang guru lain membinanya — itu cara modul ini kekal hidup.</li>" +
        "</ul>"
    }
  ];

  var present = doc.getElementById("present");
  var slidesBox = doc.getElementById("slides");
  var dotsBox = doc.getElementById("dots");
  var idx = 0;

  function buildSlides() {
    if (!slidesBox || slidesBox.childElementCount) return;
    SLIDES.forEach(function (s) {
      var el = doc.createElement("section");
      el.className = "slide";
      el.innerHTML = "<div class=\"kicker\"></div><h2></h2><div class=\"sbody\"></div>";
      el.querySelector(".kicker").textContent = s.kicker;
      el.querySelector("h2").textContent = s.title;
      el.querySelector(".sbody").innerHTML = s.body;
      slidesBox.appendChild(el);

      var dot = doc.createElement("i");
      dot.setAttribute("role", "button");
      dot.setAttribute("tabindex", "0");
      dot.title = s.title;
      dot.addEventListener("click", function () { show(SLIDES.indexOf(s)); });
      if (dotsBox) dotsBox.appendChild(dot);
    });
  }

  function show(i) {
    if (!slidesBox) return;
    var all = slidesBox.querySelectorAll(".slide");
    if (!all.length) return;
    idx = Math.max(0, Math.min(all.length - 1, i));
    Array.prototype.forEach.call(all, function (el, k) { el.classList.toggle("on", k === idx); });
    if (dotsBox) Array.prototype.forEach.call(dotsBox.children, function (el, k) { el.classList.toggle("on", k === idx); });
    var cur = all[idx];
    if (cur) cur.scrollTop = 0;
  }

  function openPresent() {
    buildSlides();
    if (!present) return;
    present.setAttribute("data-open", "true");
    doc.body.style.overflow = "hidden";
    show(idx);
  }
  function closePresent() {
    if (!present) return;
    present.setAttribute("data-open", "false");
    doc.body.style.overflow = "";
  }

  var openers = [doc.getElementById("presentBtn"), doc.getElementById("presentBtn2")];
  openers.forEach(function (b) { if (b) b.addEventListener("click", openPresent); });
  var closer = doc.getElementById("closeBtn");
  if (closer) closer.addEventListener("click", closePresent);
  var prev = doc.getElementById("prevBtn");
  if (prev) prev.addEventListener("click", function () { show(idx - 1); });
  var next = doc.getElementById("nextBtn");
  if (next) next.addEventListener("click", function () { show(idx + 1); });

  doc.addEventListener("keydown", function (ev) {
    var open = present && present.getAttribute("data-open") === "true";
    if (!open) {
      if (ev.key === "p" && !ev.metaKey && !ev.ctrlKey && !ev.altKey) openPresent();
      return;
    }
    if (ev.key === "Escape") closePresent();
    else if (ev.key === "ArrowRight" || ev.key === " " || ev.key === "PageDown") { ev.preventDefault(); show(idx + 1); }
    else if (ev.key === "ArrowLeft" || ev.key === "PageUp") { ev.preventDefault(); show(idx - 1); }
    else if (ev.key === "Home") show(0);
    else if (ev.key === "End") show(SLIDES.length - 1);
  });
})();
