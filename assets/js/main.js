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
      "nav.about": "About", "nav.workshops": "Workshops", "nav.program": "Program", "nav.join": "Join", "nav.contact": "Contact",
      "hero.edition": "13th", "hero.tag": "FabLab students. To anyone who wants to learn",
      "hero.hint": "move · click to collapse the wave", "hero.date": "Date",
      "hero.cta1": "Explore workshops", "hero.cta2": "Join the summit",
      "about.eyebrow": "Coding since 2013", "about.title": "A decade+ of<br><em>leaps</em>",
      "about.p1": "Hisar Coding Summit was created to grow our students' potential through digital transformation. This year it is held for the 13th time at Hisar Schools — in English and Turkish, taught by FabLab students to anyone who wants to learn.",
      "about.p2": "Idealab, Hisar's FabLab, has been the heartbeat of innovation for over a decade: a maker space where creativity and collaboration turn ideas into real things.",
      "about.s1": "Editions", "about.s2": "Workshops", "about.s3": "Languages", "about.s4": "Since",
      "ws.eyebrow": "Student-led workshops", "ws.title": "Pick your<br><em>state</em>", "ws.search": "Search workshops…",
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
      "join.open": "Registration is open. Seats in each workshop are limited.",
      "join.follow": "Follow @hisarcs", "join.register": "Register now",
      "ft.where": "Where to find us", "ft.contact": "Contact", "ft.follow": "Follow",
      "ft.legacy": "Looking for last year's site?",
      "cd.d": "d", "cd.h": "h", "cd.m": "m", "cd.s": "s", "cd.live": "Happening now", "cd.done": "See you next year",
      "mq1": ["QUANTUM LEAP", "13TH CODING SUMMIT", "HISAR FABLAB", "LEARN · BUILD · LEAP"],
      "mq2": ["FABLAB STUDENTS", "TO ANYONE WHO WANTS TO LEARN", "IDEALAB", "SINCE 2013"]
    },
    tr: {
      "nav.about": "Hakkında", "nav.workshops": "Atölyeler", "nav.program": "Program", "nav.join": "Katıl", "nav.contact": "İletişim",
      "hero.edition": "13.", "hero.tag": "FabLab öğrencilerinden öğrenmek isteyen herkese",
      "hero.hint": "fareyi gezdir · dalgayı çökertmek için tıkla", "hero.date": "Tarih",
      "hero.cta1": "Atölyeleri keşfet", "hero.cta2": "Summit'e katıl",
      "about.eyebrow": "2013'ten beri kodluyoruz", "about.title": "On yılı aşkın<br><em>sıçrama</em>",
      "about.p1": "Hisar Coding Summit, öğrencilerimizin potansiyelini dijital dönüşüm kapsamında geliştirmek için kuruldu. Bu yıl 13. kez Hisar Okulları'nda; İngilizce ve Türkçe, FabLab öğrencilerinden öğrenmek isteyen herkese.",
      "about.p2": "Hisar'ın FabLab'ı Idealab, on yılı aşkın süredir inovasyonun kalbi: yaratıcılığın ve iş birliğinin fikirleri gerçeğe dönüştürdüğü bir üretim alanı.",
      "about.s1": "Edisyon", "about.s2": "Atölye", "about.s3": "Dil", "about.s4": "Başlangıç",
      "ws.eyebrow": "Öğrenci atölyeleri", "ws.title": "Durumunu<br><em>seç</em>", "ws.search": "Atölye ara…",
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
      "join.open": "Kayıtlar açık. Her atölyenin kontenjanı sınırlı.",
      "join.follow": "@hisarcs'ı takip et", "join.register": "Hemen kaydol",
      "ft.where": "Bizi nerede bulursun", "ft.contact": "İletişim", "ft.follow": "Takip et",
      "ft.legacy": "Geçen yılın sitesini mi arıyorsun?",
      "cd.d": "g", "cd.h": "s", "cd.m": "d", "cd.s": "sn", "cd.live": "Şu an devam ediyor", "cd.done": "Seneye görüşmek üzere",
      "mq1": ["QUANTUM LEAP", "13. CODING SUMMIT", "HISAR FABLAB", "ÖĞREN · ÜRET · SIÇRA"],
      "mq2": ["FABLAB ÖĞRENCİLERİ", "ÖĞRENMEK İSTEYEN HERKESE", "IDEALAB", "2013'TEN BERİ"]
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
    buildMarquee(); renderChips(); renderGrid(); renderProgram(); renderJoin(); tickCountdown();
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
  const FACETS = ["category", "level", "language", "day", "session", "age"];
  const facet = FACETS.find(f => new Set(WS.map(w => pick(w[f])).filter(Boolean)).size > 1);
  let active = "", query = "";
  const shapes = [
    `<svg class="card__shape" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#c52a43"/></svg>`,
    `<svg class="card__shape" viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" fill="#efc232"/></svg>`,
    `<svg class="card__shape" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="#f4f1c1" stroke-width="2"/><circle cx="20" cy="20" r="10" fill="none" stroke="#f4f1c1" stroke-width="2"/></svg>`,
    `<svg class="card__shape" viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" fill="#2e3a4f"/><circle cx="37" cy="3" r="14" fill="#c52a43"/></svg>`
  ];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  $("#wsCountStat").dataset.count = WS.length;

  function renderChips() {
    const box = $("#chips");
    if (!facet) { box.innerHTML = ""; return; }
    const counts = {};
    WS.forEach(w => { const v = pick(w[facet]); if (v) counts[v] = (counts[v] || 0) + 1; });
    const vals = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    box.innerHTML = [`<button class="chip" type="button" data-v="" aria-pressed="${!active}">${t("ws.all")}<span class="n">${WS.length}</span></button>`]
      .concat(vals.map(v => `<button class="chip" type="button" data-v="${esc(v)}" aria-pressed="${active === v}">${esc(v)}<span class="n">${counts[v]}</span></button>`)).join("");
  }
  $("#chips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.v; renderChips(); filter();
  });
  $("#q").addEventListener("input", e => { query = e.target.value.trim().toLocaleLowerCase(lang); filter(); });

  function renderGrid() {
    const grid = $("#grid");
    if (!WS.length) {
      grid.innerHTML = `<div class="empty"><b>${t("ws.soon")}</b>${t("ws.soonHint")}</div>`;
      $("#wsCount").textContent = ""; return;
    }
    grid.innerHTML = WS.map((w, i) => {
      const tags = FACETS.map((f, j) => pick(w[f]) ? `<span class="tag${j === 0 ? " tag--red" : j === 1 ? " tag--y" : ""}">${esc(pick(w[f]))}</span>` : "").join("");
      return `<button class="card" type="button" data-i="${i}">
        ${shapes[i % shapes.length]}
        <span class="card__no">Q.${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(pick(w.title))}</h3>
        ${pick(w.desc) ? `<p>${esc(pick(w.desc))}</p>` : ""}
        <span class="card__tags">${tags}</span>
      </button>`;
    }).join("") + `<div class="empty" id="noMatch" hidden><b>${t("ws.none")}</b>${t("ws.noneHint")}</div>`;
    filter();
  }
  function filter() {
    if (!WS.length) return;
    let n = 0;
    $$(".card", $("#grid")).forEach(c => {
      const w = WS[+c.dataset.i];
      const hay = [w.title, w.desc, ...FACETS.map(f => w[f])].map(pick).join(" ").toLocaleLowerCase(lang);
      const ok = (!active || pick(w[facet]) === active) && (!query || hay.includes(query));
      c.classList.toggle("is-hidden", !ok); if (ok) n++;
    });
    $("#noMatch").hidden = n > 0;
    $("#wsCount").textContent = t("ws.count", n);
  }

  const grid = $("#grid");
  if (fine && !reduced) {
    grid.addEventListener("pointermove", e => {
      const c = e.target.closest(".card"); if (!c) return;
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      c.style.setProperty("--ry", `${(x - .5) * 10}deg`); c.style.setProperty("--rx", `${(.5 - y) * 10}deg`);
      c.style.setProperty("--mx", `${x * 100}%`); c.style.setProperty("--my", `${y * 100}%`);
    });
    grid.addEventListener("pointerout", e => {
      const c = e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
    });
  }

  /* modal */
  const modal = $("#modal");
  let lastFocus = null;
  grid.addEventListener("click", e => {
    const c = e.target.closest(".card"); if (!c) return;
    const i = +c.dataset.i, w = WS[i];
    lastFocus = c;
    $("#mNo").textContent = `Q.${String(i + 1).padStart(2, "0")}`;
    $("#mTitle").textContent = pick(w.title);
    $("#mDesc").textContent = pick(w.desc);
    $("#mMeta").innerHTML = FACETS.concat("duration").filter(f => pick(w[f]))
      .map(f => `<div><dt>${t("meta." + f)}</dt><dd>${esc(pick(w[f]))}</dd></div>`).join("");
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
    $(".modal__close", modal).focus();
  });
  const closeModal = () => { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); lastFocus && lastFocus.focus(); };
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

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
    if (!S.registrationUrl) return;
    $("#joinText").textContent = t("join.open");
    $("#joinBtnText").textContent = t("join.register");
    $("#joinBtn").href = S.registrationUrl;
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
