(() => {
  "use strict";

  const S = window.SUMMIT || { workshops: [], program: [] };
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- i18n ---------------- */
  const T = {
    en: {
      "hero.org": "Organised by", "ws.play": "Open playground",
      "ask.eyebrow": "Contact", "ask.title": "Got a <em>question?</em>", "ask.text": "Write to us about workshops, registration or anything else — we're happy to help.",
      "ask.mail": "Email", "ask.phone": "Phone", "ft.org": "Organised by", "ft.prev": "Previous summits", "pg.label": "Playground",
      "nav.about": "About", "nav.workshops": "Workshops", "nav.program": "Program", "nav.join": "Join", "nav.archive": "Archive", "ar.eyebrow": "Past summits", "ar.title": "Twelve <em>leaps</em> so far", "ar.site": "SITE", "ar.wayback": "ARCHIVE", "ar.source": "SOURCE", "ar.missing": "Not online yet", "ar.ed": "Summit", "nav.contact": "Contact",
      "hero.edition": "13th", "hero.tag": "FROM FABLAB STUDENTS. TO ANYONE WHO WANTS TO LEARN",
      "hero.hint": "move · click to collapse the wave", "hero.date": "Date",
      "hero.cta1": "Explore workshops", "hero.cta2": "Join the summit",
      "about.eyebrow": "Coding since 2013", "about.title": "A decade+ of<br><em>leaps</em>",
      "about.p1": "Hisar Coding Summit was created to grow our students' potential through digital transformation. On 18–19 December 2026 the 13th annual summit, Quantum Leap, comes to Hisar Schools — organised by FRC Team 6431, in English and Turkish, taught by FabLab students to anyone who wants to learn.",
      "about.p2": "Hisar FabLab has been the heartbeat of innovation for over a decade: a maker space where creativity and collaboration turn ideas into real things.",
      "about.s1": "Editions", "about.s2": "Workshops", "about.s3": "Languages", "about.s4": "Since",
      "ws.eyebrow": (n, d) => `${n} workshops · ${d} days`, "ws.title": "Student <em>workshops</em>", "ws.search": "Search workshops…",
      "ws.all": "All", "ws.count": n => `${n} WORKSHOP${n === 1 ? "" : "S"}`,
      "ws.none": "No workshop matches", "ws.noneHint": "Try another filter or search word.",
      "ws.soon": "Workshops are being finalized", "ws.soonHint": "The lesson list for this year lands here soon.",
      "ws.more": "Details",
      "meta.category": "Field", "meta.level": "Level", "meta.language": "Language", "meta.age": "Age",
      "meta.day": "Day", "meta.session": "Session", "meta.duration": "Duration",
      "pg.eyebrow": "Daily program", "pg.title": "The <em>timeline</em>",
      "pg.soon": "The program will be announced soon.",
      "join.eyebrow": "Registration", "join.title": "Take the<br>leap",
      "join.soon": "Registration opens soon. Follow @hisarcs to be the first to know.",
      "join.open": "Registration is open. Pick your workshops and take the leap — seats in each workshop are limited.",
      "join.follow": "Follow @hisarcs", "join.register": "Register",
      "ft.where": "Where to find us", "ft.contact": "Contact", "ft.follow": "Follow",
      "ft.legacy": "Looking for last year's site?",
      "cd.d": "d", "cd.h": "h", "cd.m": "m", "cd.s": "s", "cd.live": "Happening now", "cd.done": "See you next year",
      "mq1": ["QUANTUM LEAP", "13TH CODING SUMMIT", "HISAR FABLAB", "LEARN · BUILD · LEAP"],
      "mq2": ["FABLAB STUDENTS", "TO ANYONE WHO WANTS TO LEARN", "FABLAB", "SINCE 2013"]
    },
    tr: {
      "hero.org": "Düzenleyen", "ws.play": "Playground'u aç",
      "ask.eyebrow": "İletişim", "ask.title": "Sorun mu <em>var?</em>", "ask.text": "Atölyeler, kayıt ya da aklına takılan her şey için bize yaz — yardımcı olmaktan mutluluk duyarız.",
      "ask.mail": "E-posta", "ask.phone": "Telefon", "ft.org": "Düzenleyen", "ft.prev": "Önceki summitler", "pg.label": "Playground",
      "nav.about": "Hakkında", "nav.workshops": "Atölyeler", "nav.program": "Program", "nav.join": "Katıl", "nav.archive": "Arşiv", "ar.eyebrow": "Önceki summitler", "ar.title": "Şimdiye kadar on iki <em>sıçrama</em>", "ar.site": "SİTE", "ar.wayback": "ARŞİV", "ar.source": "KAYNAK", "ar.missing": "Henüz çevrimiçi değil", "ar.ed": "Summit", "nav.contact": "İletişim",
      "hero.edition": "13.", "hero.tag": "FABLAB ÖĞRENCİLERİNDEN. ÖĞRENMEK İSTEYEN HERKESE.",
      "hero.hint": "fareyi gezdir · dalgayı çökertmek için tıkla", "hero.date": "Tarih",
      "hero.cta1": "Atölyeleri keşfet", "hero.cta2": "Summit'e katıl",
      "about.eyebrow": "2013'ten beri kodluyoruz", "about.title": "On yılı aşkın<br><em>sıçrama</em>",
      "about.p1": "Hisar Coding Summit, öğrencilerimizin potansiyelini dijital dönüşüm kapsamında geliştirmek için kuruldu. 13. Geleneksel Coding Summit: Quantum Leap, 18–19 Aralık 2026'da Hisar Okulları'nda — FRC Takımı 6431 düzenliyor; İngilizce ve Türkçe, FabLab öğrencilerinden öğrenmek isteyen herkese.",
      "about.p2": "Hisar FabLab, on yılı aşkın süredir inovasyonun kalbi: yaratıcılığın ve iş birliğinin fikirleri gerçeğe dönüştürdüğü bir üretim alanı.",
      "about.s1": "Edisyon", "about.s2": "Atölye", "about.s3": "Dil", "about.s4": "Başlangıç",
      "ws.eyebrow": (n, d) => `${n} atölye · ${d} gün`, "ws.title": "Öğrenci <em>atölyeleri</em>", "ws.search": "Atölye ara…",
      "ws.all": "Tümü", "ws.count": n => `${n} ATÖLYE`,
      "ws.none": "Eşleşen atölye yok", "ws.noneHint": "Başka bir filtre ya da kelime dene.",
      "ws.soon": "Atölyeler kesinleşiyor", "ws.soonHint": "Bu yılın ders listesi çok yakında burada.",
      "ws.more": "Detaylar",
      "meta.category": "Alan", "meta.level": "Seviye", "meta.language": "Dil", "meta.age": "Yaş",
      "meta.day": "Gün", "meta.session": "Oturum", "meta.duration": "Süre",
      "pg.eyebrow": "Günlük program", "pg.title": "Zaman <em>çizelgesi</em>",
      "pg.soon": "Program yakında açıklanacak.",
      "join.eyebrow": "Kayıt", "join.title": "Sıçramaya<br>hazır mısın",
      "join.soon": "Kayıtlar çok yakında açılıyor. İlk sen duymak için @hisarcs'ı takip et.",
      "join.open": "Kayıtlar açık. Atölyelerini seç ve sıçra — her atölyenin kontenjanı sınırlı.",
      "join.follow": "@hisarcs'ı takip et", "join.register": "Kayıt ol",
      "ft.where": "Bizi nerede bulursun", "ft.contact": "İletişim", "ft.follow": "Takip et",
      "ft.legacy": "Geçen yılın sitesini mi arıyorsun?",
      "cd.d": "g", "cd.h": "s", "cd.m": "d", "cd.s": "sn", "cd.live": "Şu an devam ediyor", "cd.done": "Seneye görüşmek üzere",
      "mq1": ["QUANTUM LEAP", "13. CODING SUMMIT", "HISAR FABLAB", "ÖĞREN · ÜRET · SIÇRA"],
      "mq2": ["FABLAB ÖĞRENCİLERİ", "ÖĞRENMEK İSTEYEN HERKESE", "FABLAB", "2013'TEN BERİ"]
    }
  };
  let lang = "en";
  try { lang = localStorage.getItem("hcs13.lang") || ((navigator.language || "").startsWith("tr") ? "tr" : "en"); } catch (e) {}
  const t = (k, ...a) => { const v = (T[lang] || T.en)[k] ?? T.en[k]; return typeof v === "function" ? v(...a) : v; };
  const pick = v => (v && typeof v === "object" && !Array.isArray(v)) ? (v[lang] ?? v.en ?? "") : (v ?? "");

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $("#dateText").textContent = pick(S.dateLabel) || "TBA";
    $("#wsEyebrow").textContent = t("ws.eyebrow", WS.length, (S.program || []).length || 2);
    buildMarquee(); renderChips(); renderGrid(); renderProgram(); renderJoin(); renderLinks(); renderArchive(); tickCountdown();
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    lang = b.dataset.lang;
    try { localStorage.setItem("hcs13.lang", lang); } catch (e) {}
    applyLang();
  }));

  /* ---------------- nav ---------------- */
  const nav = $("#nav"), links = $("#navlinks"), burger = $("#burger");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", e => { if (e.target.closest("a")) { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); } });
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$("a", links).forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id], footer[id]").forEach(s => secObs.observe(s));

  /* ---------------- reveal + counters ---------------- */
  const countUp = el => {
    const end = +el.dataset.count; if (!end) { el.textContent = "0"; return; }
    if (reduced) { el.textContent = end; return; }
    const start = end > 1000 ? end - 40 : 0, t0 = performance.now(), dur = 1400;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(start + (end - start) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(countUp);
    revObs.unobserve(e.target);
  }), { threshold: 0.15 });
  $$(".reveal").forEach(el => revObs.observe(el));

  /* ---------------- cursor ---------------- */
  if (fine && !reduced) {
    const dot = $(".cursor"), ring = $(".cursor-ring");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; }, { passive: true });
    (function loop() { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", e => ring.classList.toggle("is-hover", !!e.target.closest("a,button,.card,input,.chip")));
  }

  /* ---------------- title: scramble + glitch ---------------- */
  const title = $("#title");
  const GLYPHS = "01ΨΦΩ<>/\\{}[]#*+=QUANTMLEP";
  function splitRow(row, text) { row.innerHTML = [...text].map(c => `<span class="ch">${c}</span>`).join(""); }
  function scramble(row) {
    const final = row.dataset.scramble;
    if (reduced) { splitRow(row, final); return; }
    let frame = 0; const total = 26;
    const tick = () => {
      frame++;
      const out = [...final].map((c, i) => frame / total > i / final.length + 0.15 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
      row.textContent = out;
      if (frame < total + 4) requestAnimationFrame(tick); else splitRow(row, final);
    };
    tick();
  }
  $$(".row", title).forEach((r, i) => setTimeout(() => scramble(r), 250 + i * 260));
  const glitch = () => { title.classList.remove("is-glitch"); void title.offsetWidth; title.classList.add("is-glitch"); };
  title.addEventListener("pointerenter", glitch);
  if (!reduced) setInterval(() => { if (document.visibilityState === "visible" && scrollY < innerHeight) glitch(); }, 5200);

  /* ---------------- smoke (WebGL) ---------------- */
  (function smoke() {
    const c = $("#smoke");
    const gl = c.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fs = `precision mediump float;
      uniform vec2 r; uniform float t; uniform vec2 m; uniform float sc;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/r; vec2 p=uv*vec2(r.x/r.y,1.)*2.2;
        p.y+=sc*.6;
        vec2 q=vec2(fbm(p+t*.035),fbm(p+vec2(5.2,1.3)-t*.03));
        vec2 w=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*.05+m*.4),fbm(p+3.*q+vec2(8.3,2.8)-t*.04));
        float f=fbm(p+3.5*w);
        float wisp=smoothstep(.55,.95,f)*.55+smoothstep(.35,.9,length(w))*.18;
        vec3 deep=vec3(.024,.165,.40), blue=vec3(.043,.247,.561), light=vec3(.55,.68,.92);
        vec3 col=mix(deep,blue,smoothstep(.0,1.,uv.y*.6+f*.7));
        col=mix(col,light,wisp*.45);
        col+=vec3(.77,.16,.26)*smoothstep(.75,1.,f)*.05;
        float vig=smoothstep(1.25,.25,length(uv-vec2(.5,.55)));
        col*=.72+.28*vig;
        gl_FragColor=vec4(col,1.);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m"), uS = gl.getUniformLocation(pr, "sc");
    const scale = 0.5; // render at half resolution: it is blurry smoke anyway
    const size = () => { c.width = Math.ceil(innerWidth * scale); c.height = Math.ceil(innerHeight * scale); gl.viewport(0, 0, c.width, c.height); };
    size(); addEventListener("resize", size);
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    addEventListener("pointermove", e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; }, { passive: true });
    const t0 = performance.now();
    const draw = now => {
      mx += (tmx - mx) * .03; my += (tmy - my) * .03;
      gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, reduced ? 0 : (now - t0) / 1000);
      gl.uniform2f(uM, mx, -my); gl.uniform1f(uS, scrollY / innerHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  })();

  /* ---------------- hero ring (poster mark, alive) ---------------- */
  (function ring() {
    const c = $("#ring"), stage = $("#stage"), ctx = c.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = stage.clientWidth; H = stage.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener("resize", size);

    let px = 0, py = 0, tx = 0, ty = 0, inside = false;
    let amp = 1, ampT = 1, spin = 0;
    stage.addEventListener("pointermove", e => {
      const b = stage.getBoundingClientRect();
      tx = (e.clientX - b.left) / b.width - .5; ty = (e.clientY - b.top) / b.height - .5; inside = true;
    });
    stage.addEventListener("pointerleave", () => { tx = 0; ty = 0; inside = false; });
    stage.addEventListener("click", () => { ampT = 0; spin += Math.PI; setTimeout(() => { ampT = 1; }, 700); });

    const RED = "#c52a43", CREAM = [244, 241, 193];
    const LINES = 30;
    const draw = now => {
      const time = reduced ? 0 : now / 1000;
      px += (tx - px) * .06; py += (ty - py) * .06; amp += (ampT - amp) * .07;
      ctx.clearRect(0, 0, W, H);
      const s = Math.min(W, H) * .46;               // square side
      const cx = W * .44 + px * 14, cy = H * .58 + py * 14; // square centre
      // red circle sits on the square's top-right corner, like the poster
      const ccx = cx + s / 2 - px * 26, ccy = cy - s / 2 - py * 26;
      ctx.fillStyle = RED;
      ctx.beginPath(); ctx.arc(ccx, ccy, s / 2, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(px * .08); ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();

      // contour ring: a family of closed curves that bunch on one side and fan into a wave on the other
      const R = s * .5;
      const phase = Math.atan2(py, px || .0001) * (inside ? 1 : 0) + spin * .5 + time * .35;
      ctx.lineWidth = 1.05;
      for (let i = 0; i < LINES; i++) {
        const k = i / (LINES - 1);
        const a = (CREAM.concat(0.35 + 0.6 * (1 - Math.abs(k - .5) * 1.2))).join(",");
        ctx.strokeStyle = `rgba(${a})`;
        ctx.beginPath();
        for (let j = 0; j <= 160; j++) {
          const th = (j / 160) * Math.PI * 2;
          const side = .5 + .5 * Math.cos(th - phase);                 // 0 on the bunched side, 1 on the open side
          const wave = Math.sin(th * 3 + time * 1.4 + k * 5.5) * .09 * side;
          const pull = k * .62 * Math.pow(side, 1.6) * amp;            // inner lines fold inward → the "leap"
          const rr = R * (1 - pull + wave * amp) * (1 + Math.hypot(px, py) * .12);
          const x = cx + Math.cos(th) * rr + Math.cos(phase) * k * R * .18 * amp;
          const y = cy + Math.sin(th) * rr * (0.94 + k * .06) + Math.sin(phase) * k * R * .18 * amp;
          j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  })();

  /* ---------------- countdown ---------------- */
  const target = S.date ? new Date(S.date).getTime() : NaN;
  function tickCountdown() {
    const el = $("#countdown");
    if (isNaN(target)) { el.textContent = "TBA"; return; }
    let d = target - Date.now();
    if (d <= 0) { el.textContent = d > -2 * 864e5 ? t("cd.live") : t("cd.done"); return; }
    const D = Math.floor(d / 864e5); d -= D * 864e5;
    const h = Math.floor(d / 36e5); d -= h * 36e5;
    const m = Math.floor(d / 6e4); const sec = Math.floor((d - m * 6e4) / 1e3);
    const pad = n => String(n).padStart(2, "0");
    el.innerHTML = `<b>${D}</b><i>${t("cd.d")}</i><b>${pad(h)}</b><i>${t("cd.h")}</i><b>${pad(m)}</b><i>${t("cd.m")}</i><b>${pad(sec)}</b><i>${t("cd.s")}</i>`;
  }
  setInterval(tickCountdown, 1000);

  /* ---------------- marquee ---------------- */
  function buildMarquee() {
    [["#mq1", "mq1"], ["#mq2", "mq2"]].forEach(([sel, key]) => {
      const words = t(key), html = words.map(w => `<span>${w}</span>`).join("");
      $(sel).innerHTML = html + html + html + html;
    });
  }

  /* ---------------- workshops ---------------- */
  const WS = (S.workshops || []).filter(w => w && w.title);
  const CATS = S.categories || {};
  let active = "", query = "";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const catName = k => pick(CATS[k]) || k;
  $("#wsCountStat").dataset.count = WS.length;

  // poster-style compositions for the card art, picked by index
  function art(i, col) {
    const v = i % 6, R = "#c52a43", Y = "#efc232", Cr = "#f4f1c1", N = "#2e3a4f";
    const ring = `<g fill="none" stroke="${Cr}" stroke-width="1.2" opacity=".85">${Array.from({ length: 9 }, (_, k) => `<ellipse cx="110" cy="128" rx="${54 - k * 3}" ry="${54 - k * 4.4}" transform="rotate(${k * 9 + i * 13} 110 128)"/>`).join("")}</g>`;
    const shapes = [
      `<rect x="56" y="74" width="108" height="108" fill="${R}"/><circle cx="164" cy="74" r="54" fill="${col}"/>${ring}`,
      `<circle cx="100" cy="120" r="70" fill="${col}"/><rect x="118" y="40" width="70" height="70" fill="${N}"/>${ring}`,
      `<rect x="40" y="60" width="140" height="140" fill="${N}"/><circle cx="110" cy="130" r="60" fill="${R}"/>${ring}`,
      `<circle cx="80" cy="90" r="48" fill="${Y}"/><circle cx="140" cy="150" r="58" fill="${R}" opacity=".95"/>${ring}`,
      `<path d="M30 190 L110 40 L190 190Z" fill="${col}"/><circle cx="110" cy="140" r="36" fill="${R}"/>${ring}`,
      `<rect x="30" y="100" width="160" height="70" fill="${R}"/><rect x="75" y="40" width="70" height="160" fill="${col}" opacity=".9"/>${ring}`
    ];
    return `<svg viewBox="0 0 220 220" class="hcard__art" aria-hidden="true">${shapes[v]}</svg>`;
  }

  function renderChips() {
    const box = $("#chips"), counts = {};
    WS.forEach(w => { counts[w.cat] = (counts[w.cat] || 0) + 1; });
    const keys = Object.keys(CATS).filter(k => counts[k]);
    box.innerHTML = [`<button class="chip" type="button" data-v="" aria-pressed="${!active}">${t("ws.all")}<span class="n">${WS.length}</span></button>`]
      .concat(keys.map(k => `<button class="chip" type="button" data-v="${k}" aria-pressed="${active === k}"><i class="chip__dot" style="background:${CATS[k].color}"></i>${esc(catName(k))}<span class="n">${counts[k]}</span></button>`)).join("");
  }
  $("#chips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.v; renderChips(); renderGrid();
  });
  $("#q").addEventListener("input", e => { query = e.target.value.trim().toLocaleLowerCase(lang); renderGrid(); });

  let shown = [];
  function renderGrid() {
    shown = WS.map((w, i) => ({ w, i })).filter(({ w }) => {
      const hay = [w.title, w.desc].map(pick).concat(catName(w.cat)).join(" ").toLocaleLowerCase(lang);
      return (!active || w.cat === active) && (!query || hay.includes(query));
    });
    if (!shown.length) {
      track.innerHTML = `<div class="hcard hcard--empty"><b>${t("ws.none")}</b><span>${t("ws.noneHint")}</span></div>`;
    } else {
      track.innerHTML = shown.map(({ w, i }, n) => {
        const col = (CATS[w.cat] || {}).color || "#f4f1c1";
        return `<button class="hcard" type="button" data-i="${i}" style="--cat:${col}">
          <span class="hcard__top"><span class="hcard__no">${String(i + 1).padStart(2, "0")}</span><span class="hcard__cat"><i style="background:${col}"></i>${esc(catName(w.cat))}</span></span>
          <span class="hcard__visual">${art(i, col)}</span>
          <h3>${esc(pick(w.title))}</h3>
          <p>${esc(pick(w.desc))}</p>
          <span class="hcard__cta">${t("ws.play")} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </button>`;
      }).join("");
    }
    liquidKick();
  }

  /* liquid scroll: a droplet of scroll velocity stretches the cards, then everything settles back to still */
  const track = $("#track"), liquidMap = $("#liquidMap");
  let lqY = scrollY, lqV = 0, lqOn = false, lqRun = false;
  function liquidKick() { if (!reduced && !lqRun) { lqRun = true; requestAnimationFrame(liquidStep); } }
  function liquidClear() {
    track.style.filter = ""; liquidMap.setAttribute("scale", "0");
    track.querySelectorAll(".hcard").forEach(c => { c.style.transform = ""; });
    lqOn = false;
  }
  function liquidStep() {
    const y = scrollY, dy = y - lqY; lqY = y;
    lqV += (Math.max(-90, Math.min(90, dy)) - lqV) * .14;
    const a = Math.abs(lqV), k = Math.min(1, a / 55), sign = lqV < 0 ? -1 : 1;
    if (a < .05) {
      if (lqOn) liquidClear();
      lqRun = false; return;
    }
    const r = track.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom > -200 && r.top < vh + 200) {
      lqOn = true;
      const cards = track.children, rects = [];
      for (let i = 0; i < cards.length; i++) rects.push(cards[i].getBoundingClientRect());   // reads first
      for (let i = 0; i < cards.length; i++) {                                               // then writes
        const c = rects[i], f = Math.max(0, 1 - Math.abs(c.top + c.height / 2 - vh / 2) / (vh * .75));
        const w = k * f * f;
        cards[i].style.transform = w < .003 ? "" : `scale(${(1 + .06 * w).toFixed(4)}, ${(1 - .03 * w).toFixed(4)}) skewY(${(sign * 1.6 * w).toFixed(3)}deg)`;
      }
      track.style.filter = "url(#liquid)";
      liquidMap.setAttribute("scale", (k * 22).toFixed(2));
    } else if (lqOn) liquidClear();
    requestAnimationFrame(liquidStep);
  }
  if (!reduced) addEventListener("scroll", liquidKick, { passive: true });

  /* workshop window + playground */
  const modal = $("#modal");
  let lastFocus = null, killPg = null;
  track.addEventListener("click", e => {
    const c = e.target.closest(".hcard[data-i]"); if (!c) return;
    const i = +c.dataset.i, w = WS[i];
    lastFocus = c;
    $("#mNo").textContent = `${String(i + 1).padStart(2, "0")} · ${catName(w.cat)}`;
    $("#mTitle").textContent = pick(w.title);
    $("#mDesc").textContent = pick(w.desc);
    const body = $("#mPg"); body.innerHTML = "";
    const make = (window.PLAYGROUNDS || {})[w.pg];
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("no-scroll");
    killPg = make ? make(body, (en, tr) => lang === "tr" ? tr : en) : null;
    $(".modal__close", modal).focus();
  });
  const closeModal = () => {
    modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("no-scroll");
    if (killPg) { killPg(); killPg = null; }
    setTimeout(() => { if (!modal.classList.contains("is-open")) $("#mPg").innerHTML = ""; }, 400);
    lastFocus && lastFocus.focus({ preventScroll: true });
  };
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  /* links: organiser, contact, previous editions */
  function renderLinks() {
    const Lk = S.links || {};
    ["#orgLink", "#frcStrip", "#frcFoot"].forEach(q => { const a = $(q); if (a) a.href = Lk.frc || "#"; });
    const rows = [
      Lk.email && [`mailto:${Lk.email}`, "✉", t("ask.mail"), Lk.email],
      Lk.instagram && [Lk.instagram, "◎", "Instagram", "@hisarcs"],
      Lk.linkedin && [Lk.linkedin, "in", "LinkedIn", "HisarCS · FabLab"],
      ["tel:+902123640000", "☏", t("ask.phone"), "+90 (212) 364 00 00"]
    ].filter(Boolean);
    $("#askLinks").innerHTML = rows.map(([href, ic, lab, val]) =>
      `<a class="ask__link" href="${esc(href)}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}><span class="ask__ic">${ic}</span><span><small>${esc(lab)}</small><b>${esc(val)}</b></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`).join("");
    $("#prevLinks").innerHTML = (Lk.previous || []).map(p =>
      `<li><a href="${esc(p.href)}"${p.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(pick(p.label))} ↗</a></li>`).join("");
  }

  /* ---------------- archive ---------------- */
  function renderArchive() {
    $("#archiveGrid").innerHTML = (S.archive || []).map(a => {
      const inner = `<span class="acard__no">${esc(a.mark || a.no)}</span>
        <span class="acard__date">${esc(pick(a.date))}</span>
        ${a.title ? `<span class="acard__title">${esc(pick(a.title))}</span>` : ""}
        ${a.note ? `<span class="acard__note">${esc(pick(a.note))}</span>` : ""}
        <span class="acard__badge">${esc(t("ar." + (a.kind === "local" ? "site" : a.kind)))}</span>`;
      const label = `${t("ar.ed")} ${a.no}`;
      if (!a.href) return `<div class="acard acard--${a.kind}" aria-label="${esc(label)}">${inner}</div>`;
      const ext = a.href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
      return `<a class="acard acard--${a.kind}" href="${esc(a.href)}"${ext} aria-label="${esc(label + " · " + pick(a.date))}">${inner}</a>`;
    }).join("");
  }

  /* ---------------- program ---------------- */
  let day = 0;
  function renderProgram() {
    const P = S.program || [], tabs = $("#tabs"), tl = $("#timeline");
    tl.classList.toggle("is-empty", !P.length);
    if (!P.length) { tabs.hidden = true; tl.innerHTML = `<div class="empty"><b>${t("pg.soon")}</b></div>`; return; }
    tabs.hidden = P.length < 2;
    tabs.innerHTML = P.map((d, i) => `<button type="button" role="tab" aria-selected="${i === day}" data-d="${i}">${esc(pick(d.label))}</button>`).join("");
    tl.innerHTML = (P[day].slots || []).map(s => `<div class="slot"><time>${esc(s.time)}</time><div><b>${esc(pick(s.title))}</b>${pick(s.note) ? `<small>${esc(pick(s.note))}</small>` : ""}</div></div>`).join("");
  }
  $("#tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { day = +b.dataset.d; renderProgram(); } });

  /* ---------------- join ---------------- */
  function renderJoin() {
    $("#joinText").textContent = t(S.registrationEndpoint ? "join.open" : "join.soon");
    $("#joinBtnText").textContent = t("join.register");
  }

  /* ---------------- legacy ---------------- */
  $("#legacyBtn").addEventListener("click", e => {
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const href = e.currentTarget.href;
    $("#rewind").classList.add("is-on");
    setTimeout(() => { location.href = href; }, 950);
  });
  addEventListener("pageshow", () => $("#rewind").classList.remove("is-on"));

  $("#yr").textContent = new Date().getFullYear();
  applyLang();
})();
