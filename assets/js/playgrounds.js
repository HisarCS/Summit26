/* Mini playgrounds shown inside each workshop window.
   Each one takes (root, L) where L(en, tr) returns the string for the current language,
   builds itself inside `root`, and returns a cleanup function. Nothing here talks to a server. */
(() => {
  "use strict";
  const C = { blue: "#0b3f8f", deep: "#062a66", ink: "#031a44", cream: "#f4f1c1", red: "#c52a43", yellow: "#efc232", navy: "#2e3a4f", sky: "#6fa8ff" };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : v);
    }
    kids.flat().forEach(k => el.append(k instanceof Node ? k : document.createTextNode(k)));
    return el;
  }
  // canvas that keeps its backing store in sync with its CSS size
  function stage(root, ratio = 0.56) {
    const c = h("canvas", { class: "pg__canvas" });
    root.append(c);
    const ctx = c.getContext("2d");
    const s = { c, ctx, w: 0, h: 0 };
    const fit = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      s.w = c.clientWidth; s.h = Math.round(Math.min(s.w * ratio, Math.max(220, innerHeight * .4)));
      c.style.height = s.h + "px"; c.width = s.w * dpr; c.height = s.h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(c);
    s.stop = () => ro.disconnect();
    s.pos = e => { const b = c.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    return s;
  }
  function loop(fn) {
    let id = 0, t0 = performance.now(), on = true;
    const step = now => { if (!on) return; fn((now - t0) / 1000); id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    return () => { on = false; cancelAnimationFrame(id); };
  }
  const bar = (...kids) => h("div", { class: "pg__bar" }, ...kids);
  const btn = (label, on, extra = "") => h("button", { type: "button", class: "pg__btn " + extra, onclick: on }, label);
  function slider(label, min, max, val, step, on) {
    const out = h("output", {}, String(val));
    const inp = h("input", { type: "range", min, max, value: val, step, oninput: e => { out.textContent = e.target.value; on(+e.target.value); } });
    return h("label", { class: "pg__slider" }, h("span", {}, label), inp, out);
  }
  const note = text => h("p", { class: "pg__note" }, text);

  const PG = {};

  /* ---------- gears: a three-gear train ---------- */
  PG.gears = (root, L) => {
    const s = stage(root, 0.5); let speed = 1, dir = 1, a = 0;
    const gears = [{ x: .27, y: .55, t: 24 }, { x: .5, y: .45, t: 12 }, { x: .69, y: .58, t: 18 }];
    const info = h("div", { class: "pg__readout" });
    root.append(bar(slider(L("Motor speed", "Motor hızı"), 0, 4, 1, .1, v => speed = v), btn(L("Reverse", "Ters çevir"), () => dir *= -1)), info, note(L("Gear ratio = teeth of driven ÷ teeth of driver. Small gears spin faster.", "Dişli oranı = çevrilen dişli ÷ çeviren dişli diş sayısı. Küçük dişli daha hızlı döner.")));
    function gear(ctx, x, y, r, teeth, ang, col) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const rr = i % 2 ? r * .82 : r, a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
        ctx.lineTo(Math.cos(a0) * rr, Math.sin(a0) * rr); ctx.lineTo(Math.cos(a1) * rr, Math.sin(a1) * rr);
      }
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      ctx.fillStyle = C.deep; ctx.beginPath(); ctx.arc(0, 0, r * .18, 0, 7); ctx.fill();
      ctx.strokeStyle = C.deep; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * .6, 0); ctx.stroke();
      ctx.restore();
    }
    const stop = loop(() => {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      a += .02 * speed * dir;
      const unit = Math.min(w, H * 2) / 150;
      const col = [C.red, C.yellow, C.cream];
      let ang = a;
      gears.forEach((g, i) => {
        const r = g.t * unit;
        const rot = i === 0 ? ang : -ang * (gears[0].t / g.t) * (i === 2 ? -1 : 1);
        gear(ctx, g.x * w, g.y * H, r, g.t, rot, col[i]);
      });
      info.textContent = `${L("Driver", "Çeviren")} 24T → 12T → 18T · ${L("output speed", "çıkış hızı")} ×${(24 / 18).toFixed(2)}`;
    });
    return () => { stop(); s.stop(); };
  };

  /* ---------- ml: k-nearest-neighbours you train by clicking ---------- */
  PG.ml = (root, L) => {
    const s = stage(root, 0.56); let cls = 0, k = 3; const pts = [];
    const seed = () => { pts.length = 0; for (let i = 0; i < 6; i++) { pts.push({ x: .15 + Math.random() * .3, y: .2 + Math.random() * .6, c: 0 }, { x: .55 + Math.random() * .3, y: .2 + Math.random() * .6, c: 1 }); } };
    seed();
    const bA = btn("● " + L("Class A", "Sınıf A"), () => { cls = 0; bA.classList.add("is-on"); bB.classList.remove("is-on"); }, "is-on");
    const bB = btn("■ " + L("Class B", "Sınıf B"), () => { cls = 1; bB.classList.add("is-on"); bA.classList.remove("is-on"); });
    root.append(bar(bA, bB, slider("k", 1, 9, 3, 2, v => { k = v; draw(); }), btn(L("Clear", "Temizle"), () => { pts.length = 0; draw(); })),
      note(L("Click to add training examples. The background is the model's guess for every spot — that is k-nearest-neighbours.", "Tıklayarak eğitim örneği ekle. Arka plan, modelin her nokta için tahmini — buna k-en yakın komşu denir.")));
    function predict(x, y) {
      if (!pts.length) return .5;
      const d = pts.map(p => [(p.x - x) ** 2 + (p.y - y) ** 2, p.c]).sort((a, b) => a[0] - b[0]).slice(0, k);
      return d.reduce((s, v) => s + v[1], 0) / d.length;
    }
    function draw() {
      const { ctx, w, h: H } = s, n = 36, cw = w / n, ch = H / Math.round(n * H / w);
      for (let y = 0; y < H; y += ch) for (let x = 0; x < w; x += cw) {
        const p = predict((x + cw / 2) / w, (y + ch / 2) / H);
        ctx.fillStyle = p > .5 ? `rgba(239,194,50,${.12 + (p - .5) * .5})` : `rgba(197,42,67,${.12 + (.5 - p) * .5})`;
        ctx.fillRect(x, y, cw + 1, ch + 1);
      }
      pts.forEach(p => {
        ctx.fillStyle = p.c ? C.yellow : C.red; ctx.strokeStyle = C.cream; ctx.lineWidth = 2;
        if (p.c) { ctx.fillRect(p.x * w - 6, p.y * H - 6, 12, 12); ctx.strokeRect(p.x * w - 6, p.y * H - 6, 12, 12); }
        else { ctx.beginPath(); ctx.arc(p.x * w, p.y * H, 7, 0, 7); ctx.fill(); ctx.stroke(); }
      });
    }
    s.c.addEventListener("pointerdown", e => { const p = s.pos(e); pts.push({ x: p.x / s.w, y: p.y / s.h, c: cls }); draw(); });
    const ro = new ResizeObserver(draw); ro.observe(s.c); draw();
    return () => { ro.disconnect(); s.stop(); };
  };

  /* ---------- robot: drive a tank-drive robot, collect game pieces ---------- */
  PG.robot = (root, L) => {
    const s = stage(root, 0.56); const keys = {}; let score = 0;
    const r = { x: .2, y: .5, a: 0 }; let pieces = [];
    const spawn = () => { pieces = Array.from({ length: 5 }, () => ({ x: .1 + Math.random() * .8, y: .15 + Math.random() * .7 })); };
    spawn();
    const info = h("div", { class: "pg__readout" });
    const hold = (k, label) => h("button", { type: "button", class: "pg__btn pg__pad", onpointerdown: () => keys[k] = 1, onpointerup: () => keys[k] = 0, onpointerleave: () => keys[k] = 0 }, label);
    root.append(bar(hold("ArrowLeft", "◀"), hold("ArrowUp", "▲"), hold("ArrowDown", "▼"), hold("ArrowRight", "▶"), btn(L("Reset", "Sıfırla"), () => { score = 0; Object.assign(r, { x: .2, y: .5, a: 0 }); spawn(); })), info,
      note(L("Arrow keys / WASD or the buttons. Tank drive: one motor per side, like many FRC drivetrains.", "Ok tuşları / WASD ya da butonlar. Tank sürüş: her tarafta bir motor, birçok FRC şasisi gibi.")));
    const map = { w: "ArrowUp", a: "ArrowLeft", s: "ArrowDown", d: "ArrowRight" };
    const kd = e => { const k = map[e.key] || e.key; if (k.startsWith("Arrow")) { keys[k] = 1; e.preventDefault(); } };
    const ku = e => { const k = map[e.key] || e.key; keys[k] = 0; };
    addEventListener("keydown", kd); addEventListener("keyup", ku);
    const stop = loop(() => {
      const { ctx, w, h: H } = s;
      const v = (keys.ArrowUp ? 1 : 0) - (keys.ArrowDown ? 1 : 0), turn = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
      r.a += turn * .06; r.x = Math.min(.97, Math.max(.03, r.x + Math.cos(r.a) * v * .006)); r.y = Math.min(.95, Math.max(.05, r.y + Math.sin(r.a) * v * .006 * w / H));
      pieces = pieces.filter(p => { const hit = Math.hypot((p.x - r.x) * w, (p.y - r.y) * H) < 26; if (hit) score++; return !hit; });
      if (!pieces.length) spawn();
      ctx.fillStyle = "#0a2f6e"; ctx.fillRect(0, 0, w, H);
      ctx.strokeStyle = "rgba(244,241,193,.12)"; ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      pieces.forEach(p => { ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(p.x * w, p.y * H, 8, 0, 7); ctx.fill(); });
      ctx.save(); ctx.translate(r.x * w, r.y * H); ctx.rotate(r.a);
      ctx.fillStyle = C.red; ctx.fillRect(-18, -15, 36, 30);
      ctx.fillStyle = C.ink; ctx.fillRect(-16, -19, 32, 5); ctx.fillRect(-16, 14, 32, 5);
      ctx.fillStyle = C.cream; ctx.fillRect(10, -6, 10, 12);
      ctx.restore();
      info.textContent = `${L("Pieces collected", "Toplanan parça")}: ${score}`;
    });
    return () => { stop(); s.stop(); removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
  };

  /* ---------- game: monster invasion ---------- */
  PG.game = (root, L) => {
    const s = stage(root, 0.56); let mons = [], score = 0, lives = 3, t = 0, over = false, zaps = [];
    const info = h("div", { class: "pg__readout" });
    const reset = () => { mons = []; score = 0; lives = 3; over = false; };
    root.append(bar(btn(L("Restart", "Yeniden başla"), reset)), info, note(L("Click the monsters before they reach the bottom. In Godot this is a scene, a script and a collision signal.", "Canavarlar aşağı inmeden tıkla. Godot'ta bu bir sahne, bir script ve bir çarpışma sinyali.")));
    s.c.addEventListener("pointerdown", e => {
      if (over) { reset(); return; }
      const p = s.pos(e); zaps.push({ x: p.x, y: p.y, life: 1 });
      mons = mons.filter(m => { const hit = Math.hypot(m.x * s.w - p.x, m.y * s.h - p.y) < m.r + 6; if (hit) score++; return !hit; });
    });
    const stop = loop(sec => {
      const { ctx, w, h: H } = s;
      if (!over) {
        t++;
        if (t % Math.max(18, 60 - score) === 0) mons.push({ x: .08 + Math.random() * .84, y: -.05, r: 14 + Math.random() * 8, v: .0018 + Math.random() * .002 + score * .00004 });
        mons.forEach(m => m.y += m.v);
        const before = mons.length; mons = mons.filter(m => m.y < 1.05); lives -= before - mons.length;
        if (lives <= 0) over = true;
      }
      ctx.fillStyle = "#081f4d"; ctx.fillRect(0, 0, w, H);
      mons.forEach((m, i) => {
        const x = m.x * w, y = m.y * H, wob = Math.sin(sec * 6 + i) * 2;
        ctx.fillStyle = i % 2 ? C.red : "#7be0b0"; ctx.beginPath(); ctx.arc(x, y + wob, m.r, Math.PI, 0); ctx.lineTo(x + m.r, y + m.r * .7);
        for (let k = 3; k >= -3; k--) ctx.lineTo(x + k * m.r / 3, y + m.r * (k % 2 ? .4 : .7)); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(x - m.r * .35, y - 2 + wob, 3.5, 0, 7); ctx.arc(x + m.r * .35, y - 2 + wob, 3.5, 0, 7); ctx.fill();
      });
      zaps = zaps.filter(z => (z.life -= .06) > 0);
      zaps.forEach(z => { ctx.strokeStyle = `rgba(239,194,50,${z.life})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(z.x, z.y, (1 - z.life) * 30, 0, 7); ctx.stroke(); });
      if (over) {
        ctx.fillStyle = "rgba(3,26,68,.75)"; ctx.fillRect(0, 0, w, H); ctx.fillStyle = C.cream; ctx.textAlign = "center";
        ctx.font = "700 22px Orbitron, sans-serif"; ctx.fillText(L("GAME OVER", "OYUN BİTTİ"), w / 2, H / 2 - 6);
        ctx.font = "500 13px Montserrat, sans-serif"; ctx.fillText(L("click to play again", "tekrar oynamak için tıkla"), w / 2, H / 2 + 20);
      }
      info.textContent = `${L("Score", "Skor")}: ${score} · ${L("Lives", "Can")}: ${"♥".repeat(Math.max(0, lives))}`;
    });
    return () => { stop(); s.stop(); };
  };

  /* ---------- plot: tune a model until it fits the data ---------- */
  PG.plot = (root, L) => {
    const s = stage(root, 0.5); const p = { a: 1, b: 1, c: 0 };
    const truth = { a: 1.6 + Math.random(), b: .6 + Math.random() * 1.2, c: Math.random() * 2 };
    const data = Array.from({ length: 28 }, (_, i) => { const x = i / 27 * 6.28; return { x, y: truth.a * Math.sin(truth.b * x + truth.c) + (Math.random() - .5) * .5 }; });
    const info = h("div", { class: "pg__readout" });
    root.append(h("div", { class: "pg__code" }, "f(x) = a · sin(b · x + c)"),
      bar(slider("a", 0, 3, 1, .05, v => { p.a = v; draw(); }), slider("b", 0, 2.5, 1, .02, v => { p.b = v; draw(); }), slider("c", 0, 6.28, 0, .02, v => { p.c = v; draw(); })),
      info, note(L("Move the sliders until the curve fits the measured points. Lower error = better model.", "Eğri ölçülen noktalara oturana kadar kaydır. Hata ne kadar düşükse model o kadar iyi.")));
    function draw() {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      const X = x => 20 + x / 6.28 * (w - 40), Y = y => H / 2 - y * (H / 7.5);
      ctx.strokeStyle = "rgba(244,241,193,.2)"; ctx.beginPath(); ctx.moveTo(20, H / 2); ctx.lineTo(w - 20, H / 2); ctx.stroke();
      data.forEach(d => { ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(X(d.x), Y(d.y), 4, 0, 7); ctx.fill(); });
      ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 200; i++) { const x = i / 200 * 6.28; const y = p.a * Math.sin(p.b * x + p.c); i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
      ctx.stroke();
      const err = Math.sqrt(data.reduce((s, d) => s + (d.y - p.a * Math.sin(p.b * d.x + p.c)) ** 2, 0) / data.length);
      info.textContent = `${L("Error (RMSE)", "Hata (RMSE)")}: ${err.toFixed(3)} ${err < .35 ? "✓ " + L("great fit!", "harika uyum!") : ""}`;
    }
    const ro = new ResizeObserver(draw); ro.observe(s.c); draw();
    return () => { ro.disconnect(); s.stop(); };
  };

  /* ---------- sticker: draw, then cut along the outline ---------- */
  PG.sticker = (root, L) => {
    const s = stage(root, 0.56); let strokes = [], cur = null, cut = 0, color = C.red, stopAnim = null;
    const colors = [C.red, C.yellow, C.sky, "#7be0b0", C.cream];
    const sw = h("div", { class: "pg__swatches" }, colors.map(c => h("button", { type: "button", style: `background:${c}`, "aria-label": c, onclick: () => color = c })));
    root.append(bar(sw, btn(L("Cut it!", "Kes!"), () => { cut = 0.0001; if (stopAnim) stopAnim(); stopAnim = loop(() => { cut = Math.min(1, cut + .012); draw(); if (cut >= 1) stopAnim(); }); }), btn(L("Clear", "Temizle"), () => { strokes = []; cut = 0; draw(); })),
      note(L("Draw a shape, then hit Cut: the white border is the bleed, the dashed line is where the blade goes.", "Bir şekil çiz, sonra Kes'e bas: beyaz kenar taşma payı, kesikli çizgi bıçağın gideceği yol.")));
    s.c.addEventListener("pointerdown", e => { cur = { c: color, p: [s.pos(e)] }; strokes.push(cur); cut = 0; s.c.setPointerCapture(e.pointerId); });
    s.c.addEventListener("pointermove", e => { if (cur) { cur.p.push(s.pos(e)); draw(); } });
    s.c.addEventListener("pointerup", () => cur = null);
    function path(ctx, st) { ctx.beginPath(); st.p.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); }
    function draw() {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      ctx.fillStyle = "#e9e6c8"; ctx.globalAlpha = .06; ctx.fillRect(0, 0, w, H); ctx.globalAlpha = 1;
      ctx.lineCap = ctx.lineJoin = "round";
      strokes.forEach(st => { path(ctx, st); ctx.strokeStyle = "#fff"; ctx.lineWidth = 34; ctx.stroke(); });
      strokes.forEach(st => { path(ctx, st); ctx.strokeStyle = st.c; ctx.lineWidth = 18; ctx.stroke(); });
      if (cut > 0) {
        strokes.forEach(st => {
          path(ctx, st); ctx.strokeStyle = C.ink; ctx.lineWidth = 36; ctx.setLineDash([2, 6]);
          ctx.globalAlpha = cut; ctx.globalCompositeOperation = "destination-over"; ctx.stroke();
          ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1; ctx.setLineDash([]);
        });
        ctx.fillStyle = C.yellow; ctx.font = "700 12px 'JetBrains Mono', monospace";
        ctx.fillText(cut < 1 ? L("cutting…", "kesiliyor…") + Math.round(cut * 100) + "%" : L("done ✓", "bitti ✓"), 12, H - 12);
      }
      if (!strokes.length) { ctx.fillStyle = "rgba(244,241,193,.5)"; ctx.textAlign = "center"; ctx.font = "500 14px Montserrat, sans-serif"; ctx.fillText(L("draw here", "buraya çiz"), w / 2, H / 2); ctx.textAlign = "left"; }
    }
    const ro = new ResizeObserver(draw); ro.observe(s.c); draw();
    return () => { ro.disconnect(); s.stop(); stopAnim && stopAnim(); };
  };

  /* ---------- qubit: gates, probabilities, measurement ---------- */
  PG.qubit = (root, L) => {
    const s = stage(root, 0.48); let th = 0, shown = null, counts = [0, 0];
    const info = h("div", { class: "pg__readout" });
    const gate = (g, f) => btn(g, () => { shown = null; f(); draw(); }, "pg__gate");
    // real-amplitude qubit on the x–z circle: H reflects across the 45° axis, X across the x axis
    root.append(bar(gate("H", () => th = Math.PI / 2 - th),
      gate("X", () => th = Math.PI - th), gate("RY", () => th = (th + Math.PI / 8) % (Math.PI * 2)),
      btn(L("Measure", "Ölç"), () => { const p1 = Math.sin(th / 2) ** 2; shown = Math.random() < p1 ? 1 : 0; counts[shown]++; th = shown ? Math.PI : 0; draw(); }, "is-on"),
      btn(L("Reset", "Sıfırla"), () => { th = 0; shown = null; counts = [0, 0]; draw(); })), info,
      note(L("H puts the qubit in superposition: 50% |0⟩, 50% |1⟩. Measuring collapses it to one answer — the wave collapses, like the hero on this page.", "H, kübiti süperpozisyona sokar: %50 |0⟩, %50 |1⟩. Ölçmek onu tek bir cevaba çökertir — tıpkı bu sayfadaki dalga gibi.")));
    function draw() {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      const cx = w * .3, cy = H / 2, R = Math.min(w * .22, H * .4);
      ctx.strokeStyle = "rgba(244,241,193,.35)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * .3, 0, 0, 7); ctx.stroke();
      ctx.fillStyle = C.cream; ctx.font = "600 13px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText("|0⟩", cx, cy - R - 8); ctx.fillText("|1⟩", cx, cy + R + 18);
      const x = cx + Math.sin(th) * R, y = cy - Math.cos(th) * R;
      ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill();
      const p1 = Math.sin(th / 2) ** 2, p0 = 1 - p1, bx = w * .58, bw = w * .34;
      [[p0, "|0⟩", C.cream], [p1, "|1⟩", C.yellow]].forEach(([p, lab, col], i) => {
        const yy = H * .3 + i * H * .28;
        ctx.fillStyle = "rgba(244,241,193,.1)"; ctx.fillRect(bx, yy, bw, 22);
        ctx.fillStyle = col; ctx.fillRect(bx, yy, bw * p, 22);
        ctx.fillStyle = C.cream; ctx.textAlign = "left"; ctx.fillText(`${lab} ${(p * 100).toFixed(0)}%`, bx, yy - 6);
      });
      info.textContent = (shown == null ? "" : `${L("Measured", "Ölçüldü")}: |${shown}⟩ · `) + `${L("history", "geçmiş")} 0:${counts[0]} 1:${counts[1]}`;
    }
    const ro = new ResizeObserver(draw); ro.observe(s.c); draw();
    return () => { ro.disconnect(); s.stop(); };
  };

  /* ---------- layers: slice a form into laser-cut layers ---------- */
  PG.layers = (root, L) => {
    const s = stage(root, 0.56); let n = 12, explode = .2, shape = 0;
    const shapes = [z => Math.sqrt(Math.max(0, 1 - z * z)), z => .45 + .35 * Math.sin(z * 3.2 + 1) * (1 - Math.abs(z) * .3), z => 1 - Math.abs(z) * .9];
    root.append(bar(slider(L("Layers", "Katman"), 4, 30, 12, 1, v => n = v), slider(L("Explode", "Ayır"), 0, 1, .2, .02, v => explode = v),
      btn(L("Shape", "Şekil"), () => shape = (shape + 1) % shapes.length)),
      note(L("Each slice is one sheet of plywood or acrylic. More layers = smoother form, more cutting time.", "Her dilim bir kontrplak ya da akrilik levha. Daha çok katman = daha pürüzsüz form, daha uzun kesim.")));
    const stop = loop(t => {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      const cx = w / 2, base = H * .82, R = Math.min(w, H) * .32, gap = (H * .55) / n * (1 + explode * 1.6);
      for (let i = 0; i < n; i++) {
        const z = (i / (n - 1)) * 2 - 1, r = shapes[shape](z) * R, y = base - i * gap;
        const rx = Math.max(2, r), ry = rx * .32, rot = reduced ? 0 : Math.sin(t * .6) * .1;
        ctx.fillStyle = i % 2 ? "#d9b98a" : "#cfae7d"; ctx.strokeStyle = "#7a5a33"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx, y + 5, rx, ry, rot, 0, 7); ctx.fill();
        ctx.fillStyle = i % 2 ? "#f0d7aa" : "#e8cc9b"; ctx.beginPath(); ctx.ellipse(cx, y, rx, ry, rot, 0, 7); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = C.cream; ctx.font = "600 12px 'JetBrains Mono', monospace"; ctx.fillText(`${n} ${L("sheets", "levha")}`, 12, 20);
    });
    return () => { stop(); s.stop(); };
  };

  /* ---------- joint: a jointed creature that follows you ---------- */
  PG.joint = (root, L) => {
    const s = stage(root, 0.56); let segs = 10, stiff = .5; const target = { x: .5, y: .5 };
    let chain = Array.from({ length: 30 }, () => ({ x: .5, y: .5 }));
    root.append(bar(slider(L("Joints", "Eklem"), 3, 24, 10, 1, v => segs = v), slider(L("Stiffness", "Sertlik"), 0, 1, .5, .05, v => stiff = v)),
      note(L("Move over the canvas. Every segment is a part, every dot a joint — the same idea as a revolute mate in Onshape or a snap-fit hinge.", "Fareyi gezdir. Her parça bir gövde, her nokta bir eklem — Onshape'teki döner bağlantı ya da snap-fit menteşe gibi.")));
    s.c.addEventListener("pointermove", e => { const p = s.pos(e); target.x = p.x / s.w; target.y = p.y / s.h; });
    const stop = loop(t => {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      if (reduced) { target.x = .5; target.y = .5; }
      const len = Math.min(w, H) * .5 / segs;
      chain[0].x += (target.x - chain[0].x) * .15; chain[0].y += (target.y - chain[0].y) * .15;
      for (let i = 1; i < segs; i++) {
        const a = chain[i - 1], b = chain[i];
        const dx = (b.x - a.x) * w, dy = (b.y - a.y) * H, d = Math.hypot(dx, dy) || 1;
        const wig = Math.sin(t * 4 - i * .6) * (1 - stiff) * 3;
        b.x = a.x + dx / d * len / w + wig / w; b.y = a.y + dy / d * len / H;
      }
      for (let i = segs - 1; i >= 0; i--) {
        const p = chain[i], r = Math.max(5, (segs - i) / segs * 18);
        if (i < segs - 1) { const q = chain[i + 1]; ctx.strokeStyle = i % 2 ? C.red : C.yellow; ctx.lineWidth = r * 1.4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p.x * w, p.y * H); ctx.lineTo(q.x * w, q.y * H); ctx.stroke(); }
        ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(p.x * w, p.y * H, 3.5, 0, 7); ctx.fill();
      }
      const hd = chain[0]; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(hd.x * w + 5, hd.y * H - 4, 3, 0, 7); ctx.arc(hd.x * w - 5, hd.y * H - 4, 3, 0, 7); ctx.fill();
    });
    return () => { stop(); s.stop(); };
  };

  /* ---------- cyber: how long would a brute-force take? ---------- */
  PG.cyber = (root, L) => {
    const out = h("div", { class: "pg__meter" });
    const inp = h("input", { type: "password", class: "pg__input", placeholder: L("Type a made-up password", "Uydurma bir şifre yaz"), autocomplete: "off", oninput: calc });
    const show = btn(L("Show", "Göster"), () => { inp.type = inp.type === "password" ? "text" : "password"; });
    root.append(h("div", { class: "pg__row" }, inp, show), out,
      note(L("Never type a real password into a website demo. This one runs only in your browser and sends nothing. A home router's default password is often the easiest door in.", "Bir site demosuna asla gerçek şifreni yazma. Bu yalnızca tarayıcında çalışır, hiçbir şey göndermez. Ev modemlerinin varsayılan şifresi çoğu zaman en kolay giriş kapısıdır.")));
    function calc() {
      const p = inp.value; let pool = 0;
      if (/[a-z]/.test(p)) pool += 26; if (/[A-Z]/.test(p)) pool += 26; if (/\d/.test(p)) pool += 10; if (/[^A-Za-z0-9]/.test(p)) pool += 33;
      const bits = p.length * Math.log2(pool || 1);
      const common = /^(123456|password|qwerty|admin|111111|12345678|abc123|iloveyou|sifre|parola)/i.test(p);
      const secs = common ? 0.001 : Math.pow(2, bits) / 1e10;
      const fmt = x => x < 1 ? L("instantly", "anında") : x < 3600 ? Math.round(x / 60) + L(" minutes", " dakika") : x < 864e2 * 365 ? Math.round(x / 864e2) + L(" days", " gün") : x < 864e2 * 365 * 1e6 ? Math.round(x / (864e2 * 365)).toLocaleString() + L(" years", " yıl") : L("longer than the universe has existed", "evrenin yaşından uzun");
      const lvl = common ? 0 : Math.min(4, Math.floor(bits / 18));
      const names = [L("Very weak", "Çok zayıf"), L("Weak", "Zayıf"), L("OK", "İdare eder"), L("Strong", "Güçlü"), L("Very strong", "Çok güçlü")];
      out.innerHTML = p ? `<div class="pg__meterbar"><i style="width:${(lvl + 1) * 20}%;background:${[C.red, "#ff8a5c", C.yellow, "#7be0b0", "#7be0b0"][lvl]}"></i></div>
        <b>${names[lvl]}</b> · ${Math.round(bits)} bit · ${L("cracked in", "kırılma süresi")}: <b>${fmt(secs)}</b> <small>(${L("10 billion guesses/s", "saniyede 10 milyar deneme")})</small>` : "";
    }
    return () => {};
  };

  /* ---------- rnd / impact: idea builders ---------- */
  function builder(root, L, steps, make) {
    const pick = steps.map(() => 0);
    const card = h("div", { class: "pg__card" });
    const rows = steps.map((st, i) => h("div", { class: "pg__step" }, h("b", {}, `${i + 1}. ${st.label}`),
      h("div", { class: "pg__chips" }, st.opts.map((o, j) => h("button", { type: "button", class: "pg__chip" + (j ? "" : " is-on"), onclick: e => {
        pick[i] = j; [...e.target.parentNode.children].forEach((b, k) => b.classList.toggle("is-on", k === j)); render(); } }, o)))));
    function render() { card.innerHTML = make(pick.map((j, i) => steps[i].opts[j])); }
    root.append(...rows, card); render();
    return () => {};
  }
  PG.rnd = (root, L) => builder(root, L, [
    { label: L("Pick a problem", "Bir problem seç"), opts: [L("School waste", "Okul atığı"), L("Noisy classrooms", "Gürültülü sınıflar"), L("Lost focus", "Dağılan dikkat"), L("Water use", "Su kullanımı")] },
    { label: L("Pick a tool", "Bir araç seç"), opts: [L("sensors", "sensörler"), L("a mobile app", "mobil uygulama"), L("a 3D-printed device", "3D baskı cihaz"), L("data analysis", "veri analizi")] },
    { label: L("Pick a measure", "Bir ölçüt seç"), opts: [L("in 2 weeks", "2 haftada"), L("by 20%", "%20 oranında"), L("for 100 students", "100 öğrenci için")] }
  ], ([a, b, c]) => `<span class="pg__eyebrow">${L("Your research question", "Araştırma sorun")}</span><p>${L(`Can <b>${b}</b> reduce <b>${a.toLowerCase()}</b> <b>${c}</b>?`, `<b>${b}</b> kullanarak <b>${a.toLowerCase()}</b> sorununu <b>${c}</b> azaltabilir miyiz?`)}</p><small>${L("Hypothesis → prototype → test → write it up.", "Hipotez → prototip → test → raporla.")}</small>`);
  PG.impact = (root, L) => builder(root, L, [
    { label: L("Who needs help?", "Kime yardım edelim?"), opts: [L("Elderly neighbours", "Yaşlı komşular"), L("Stray animals", "Sokak hayvanları"), L("New students", "Yeni öğrenciler"), L("Local shops", "Mahalle esnafı")] },
    { label: L("Which goal?", "Hangi hedef?"), opts: [L("Good health", "Sağlık"), L("Quality education", "Nitelikli eğitim"), L("Climate action", "İklim eylemi"), L("Zero hunger", "Açlığa son")] },
    { label: L("Which tech?", "Hangi teknoloji?"), opts: [L("map + alerts", "harita + bildirim"), L("AI chatbot", "yapay zeka sohbet"), L("QR + volunteers", "QR + gönüllüler")] }
  ], ([a, b, c]) => `<span class="pg__eyebrow">${L("App idea", "Uygulama fikri")}</span><p>${L(`An app for <b>${a.toLowerCase()}</b> using <b>${c}</b>, working toward <b>${b.toLowerCase()}</b>.`, `<b>${a}</b> için <b>${c}</b> kullanan, <b>${b.toLowerCase()}</b> hedefine çalışan bir uygulama.`)}</p><small>${L("Next: sketch 3 screens and test with one real user.", "Sıradaki: 3 ekran çiz, bir gerçek kullanıcıyla test et.")}</small>`);

  /* ---------- vision: draw a shape, the "model" guesses it ---------- */
  PG.vision = (root, L) => {
    const s = stage(root, 0.56); let pts = [], down = false;
    const out = h("div", { class: "pg__readout" });
    root.append(bar(btn(L("Clear", "Temizle"), () => { pts = []; out.textContent = ""; draw(); })), out,
      note(L("Draw a circle, triangle or square in one stroke. Real apps use a trained neural network (Core ML); this one counts corners.", "Tek çizgide daire, üçgen ya da kare çiz. Gerçek uygulamalar eğitilmiş bir sinir ağı (Core ML) kullanır; bu köşe sayıyor.")));
    s.c.addEventListener("pointerdown", e => { pts = [s.pos(e)]; down = true; s.c.setPointerCapture(e.pointerId); draw(); });
    s.c.addEventListener("pointermove", e => { if (down) { pts.push(s.pos(e)); draw(); } });
    s.c.addEventListener("pointerup", () => { down = false; classify(); });
    function rdp(p, eps) {
      if (p.length < 3) return p; const a = p[0], b = p[p.length - 1]; let idx = 0, max = 0;
      for (let i = 1; i < p.length - 1; i++) { const d = Math.abs((b.y - a.y) * p[i].x - (b.x - a.x) * p[i].y + b.x * a.y - b.y * a.x) / (Math.hypot(b.y - a.y, b.x - a.x) || 1); if (d > max) { max = d; idx = i; } }
      return max > eps ? rdp(p.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(p.slice(idx), eps)) : [a, b];
    }
    function classify() {
      if (pts.length < 10) return;
      const xs = pts.map(p => p.x), ys = pts.map(p => p.y), size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      const closed = Math.hypot(pts[0].x - pts.at(-1).x, pts[0].y - pts.at(-1).y) < size * .3;
      const cx = xs.reduce((a, b) => a + b) / xs.length, cy = ys.reduce((a, b) => a + b) / ys.length;
      const rs = pts.map(p => Math.hypot(p.x - cx, p.y - cy)), mr = rs.reduce((a, b) => a + b) / rs.length;
      const roundness = 1 - Math.sqrt(rs.reduce((s, r) => s + (r - mr) ** 2, 0) / rs.length) / mr;
      const corners = rdp(pts.concat([pts[0]]), size * .12).length - 1;
      let sc = { circle: roundness * 1.1, triangle: corners === 3 ? .9 : .2, square: corners === 4 ? .9 : .2, line: closed ? .05 : .9 };
      if (!closed) sc = { circle: .05, triangle: .05, square: .05, line: .95 };
      const sum = Object.values(sc).reduce((a, b) => a + b), names = { circle: L("circle", "daire"), triangle: L("triangle", "üçgen"), square: L("square", "kare"), line: L("line", "çizgi") };
      const best = Object.entries(sc).sort((a, b) => b[1] - a[1]);
      out.innerHTML = best.map(([k, v]) => `<span class="pg__conf"><i style="width:${v / sum * 100}%"></i>${names[k]} ${(v / sum * 100).toFixed(0)}%</span>`).join("");
    }
    function draw() {
      const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
      ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.lineCap = ctx.lineJoin = "round"; ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
      if (!pts.length) { ctx.fillStyle = "rgba(244,241,193,.5)"; ctx.textAlign = "center"; ctx.font = "500 14px Montserrat, sans-serif"; ctx.fillText(L("draw a shape", "bir şekil çiz"), w / 2, H / 2); ctx.textAlign = "left"; }
    }
    const ro = new ResizeObserver(draw); ro.observe(s.c); draw();
    return () => { ro.disconnect(); s.stop(); };
  };

  /* ---------- music: step sequencer with a tiny Markov "AI" ---------- */
  PG.music = (root, L) => {
    const notes = [523.25, 440, 392, 329.63, 293.66, 261.63], names = ["C5", "A4", "G4", "E4", "D4", "C4"], steps = 8;
    const grid = notes.map(() => Array(steps).fill(false));
    let ac = null, timer = 0, col = -1, tempo = 220;
    const cells = [];
    const g = h("div", { class: "pg__seq", style: `grid-template-columns: 34px repeat(${steps}, 1fr)` });
    notes.forEach((_, r) => {
      g.append(h("span", { class: "pg__seqlab" }, names[r]));
      for (let c = 0; c < steps; c++) {
        const b = h("button", { type: "button", class: "pg__cell", "aria-label": `${names[r]} ${c + 1}`, onclick: () => { grid[r][c] = !grid[r][c]; b.classList.toggle("is-on", grid[r][c]); } });
        cells.push([r, c, b]); g.append(b);
      }
    });
    const sync = () => cells.forEach(([r, c, b]) => b.classList.toggle("is-on", grid[r][c]));
    function ai() { // walk a Markov chain over the pentatonic rows: small steps are likely, leaps are rare
      grid.forEach(r => r.fill(false)); let r = 5;
      for (let c = 0; c < steps; c++) { if (Math.random() < .85) grid[r][c] = true; const mv = [-1, 0, 1, 1, -1, 2, -2][(Math.random() * 7) | 0]; r = Math.min(5, Math.max(0, r + mv)); }
      sync();
    }
    function tick() {
      col = (col + 1) % steps;
      cells.forEach(([, c, b]) => b.classList.toggle("is-now", c === col));
      notes.forEach((f, r) => {
        if (!grid[r][col]) return;
        const o = ac.createOscillator(), v = ac.createGain(); o.type = "triangle"; o.frequency.value = f;
        v.gain.setValueAtTime(.18, ac.currentTime); v.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .35);
        o.connect(v).connect(ac.destination); o.start(); o.stop(ac.currentTime + .4);
      });
    }
    const play = btn("▶ " + L("Play", "Çal"), () => {
      if (timer) { clearInterval(timer); timer = 0; play.textContent = "▶ " + L("Play", "Çal"); return; }
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume();
      timer = setInterval(tick, tempo); play.textContent = "■ " + L("Stop", "Durdur");
    }, "is-on");
    root.append(g, bar(play, btn("✦ " + L("AI melody", "YZ melodisi"), ai), btn(L("Clear", "Temizle"), () => { grid.forEach(r => r.fill(false)); sync(); })),
      note(L("The AI button walks a Markov chain: each note picks the next one by probability. In the workshop you build this in Java.", "YZ butonu bir Markov zinciri yürütür: her nota bir sonrakini olasılıkla seçer. Atölyede bunu Java'da kuruyorsun.")));
    ai();
    return () => { clearInterval(timer); ac && ac.close(); };
  };

  /* ---------- cnc: run G-code ---------- */
  PG.cnc = (root, L) => {
    const s = stage(root, 0.5);
    const code = h("textarea", { class: "pg__gcode", spellcheck: "false", rows: 6 },
      "G0 X10 Y10\nG1 X90 Y10\nG1 X90 Y50\nG1 X50 Y80\nG1 X10 Y50\nG1 X10 Y10\nG0 X50 Y40");
    const out = h("div", { class: "pg__readout" });
    let stopAnim = null;
    function parse() {
      const moves = []; let x = 0, y = 0, err = "";
      code.value.split("\n").forEach((ln, i) => {
        const t = ln.trim().toUpperCase(); if (!t || t.startsWith(";")) return;
        const m = t.match(/^G([01])\b/); if (!m) { err = err || `${L("line", "satır")} ${i + 1}: ${L("only G0 / G1", "sadece G0 / G1")}`; return; }
        const X = t.match(/X(-?\d+(\.\d+)?)/), Y = t.match(/Y(-?\d+(\.\d+)?)/);
        const nx = X ? +X[1] : x, ny = Y ? +Y[1] : y; moves.push({ g: +m[1], x0: x, y0: y, x: nx, y: ny }); x = nx; y = ny;
      });
      return { moves, err };
    }
    function run() {
      const { moves, err } = parse(); out.textContent = err;
      if (stopAnim) stopAnim();
      let i = 0, p = 0;
      stopAnim = loop(() => {
        const { ctx, w, h: H } = s; ctx.clearRect(0, 0, w, H);
        const X = v => 16 + v / 100 * (w - 32), Y = v => H - 16 - v / 100 * (H - 32);
        ctx.fillStyle = "rgba(244,241,193,.06)"; ctx.fillRect(16, 16, w - 32, H - 32);
        moves.forEach((m, k) => {
          if (k > i) return; const f = k < i ? 1 : p;
          ctx.strokeStyle = m.g ? C.yellow : "rgba(244,241,193,.35)"; ctx.setLineDash(m.g ? [] : [4, 4]); ctx.lineWidth = m.g ? 3 : 1;
          ctx.beginPath(); ctx.moveTo(X(m.x0), Y(m.y0)); ctx.lineTo(X(m.x0 + (m.x - m.x0) * f), Y(m.y0 + (m.y - m.y0) * f)); ctx.stroke(); ctx.setLineDash([]);
        });
        const m = moves[Math.min(i, moves.length - 1)];
        if (m) { const f = i < moves.length ? p : 1; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(X(m.x0 + (m.x - m.x0) * f), Y(m.y0 + (m.y - m.y0) * f), 7, 0, 7); ctx.fill(); }
        if (i < moves.length) { p += .04; if (p >= 1) { p = 0; i++; } } else { out.textContent = out.textContent || L("Program finished ✓", "Program bitti ✓"); }
      });
    }
    root.append(code, bar(btn("▶ " + L("Run", "Çalıştır"), run, "is-on")), out,
      note(L("G0 = fast move (dashed, not cutting), G1 = cutting move. Coordinates in mm on a 100×100 table. Edit the code and run again.", "G0 = hızlı hareket (kesikli, kesmiyor), G1 = kesme hareketi. 100×100 tablada mm koordinat. Kodu değiştirip tekrar çalıştır.")));
    run();
    return () => { stopAnim && stopAnim(); s.stop(); };
  };

  /* ---------- video: colour grading ---------- */
  PG.video = (root, L) => {
    const s = stage(root, 0.5); const f = { b: 100, c: 100, s: 100, hu: 0 };
    const presets = { [L("Original", "Orijinal")]: [100, 100, 100, 0], [L("Warm", "Sıcak")]: [105, 105, 125, -12], [L("Cool", "Soğuk")]: [100, 110, 90, 18], [L("Mono", "S/B")]: [105, 130, 0, 0], [L("Cinematic", "Sinematik")]: [92, 125, 80, -6] };
    const sliders = [["b", L("Brightness", "Parlaklık"), 40, 160], ["c", L("Contrast", "Kontrast"), 40, 180], ["s", L("Saturation", "Doygunluk"), 0, 200], ["hu", L("Hue", "Ton"), -60, 60]].map(([k, lab, mn, mx]) => slider(lab, mn, mx, f[k], 1, v => f[k] = v));
    root.append(bar(...Object.entries(presets).map(([n, v]) => btn(n, () => { [f.b, f.c, f.s, f.hu] = v; sliders.forEach((el, i) => { const inp = el.querySelector("input"); inp.value = v[i]; el.querySelector("output").textContent = v[i]; }); }))),
      bar(...sliders), note(L("Colour grading sets the mood of a cut. Same footage, different story.", "Renk düzenleme kurgunun havasını belirler. Aynı görüntü, farklı hikaye.")));
    const stop = loop(t => {
      const { ctx, w, h: H } = s;
      ctx.filter = `brightness(${f.b}%) contrast(${f.c}%) saturate(${f.s}%) hue-rotate(${f.hu}deg)`;
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#ff9a5c"); g.addColorStop(.55, "#ffd27a"); g.addColorStop(1, "#4a7bd1");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, H);
      ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(w * .7, H * .5 - Math.sin(t * .3) * 6, H * .14, 0, 7); ctx.fill();
      [["#2b3f7a", .62, .08], ["#1b2b5a", .72, .12], [C.ink, .84, .05]].forEach(([c, y, a], i) => {
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= w; x += 10) ctx.lineTo(x, H * y + Math.sin(x * .012 + i * 2 + t * .2 * (i + 1)) * H * a);
        ctx.lineTo(w, H); ctx.fill();
      });
      ctx.filter = "none";
      ctx.fillStyle = "rgba(0,0,0,.8)"; ctx.fillRect(0, 0, w, H * .07); ctx.fillRect(0, H * .93, w, H * .07);
    });
    return () => { stop(); s.stop(); };
  };

  /* ---------- generative: flow-field art ---------- */
  PG.generative = (root, L) => {
    const s = stage(root, 0.56); let scale = 3, count = 600, pal = 0, seed = Math.random() * 1000, parts = [];
    const pals = [[C.red, C.yellow, C.cream], ["#6fa8ff", C.cream, "#c8a6ff"], ["#7be0b0", C.yellow, "#ff8a5c"]];
    const reset = () => { parts = Array.from({ length: count }, () => ({ x: Math.random() * s.w, y: Math.random() * s.h, c: (Math.random() * 3) | 0 })); s.ctx.fillStyle = C.ink; s.ctx.fillRect(0, 0, s.w, s.h); };
    root.append(bar(slider(L("Chaos", "Kaos"), 1, 8, 3, .1, v => { scale = v; }), slider(L("Particles", "Parçacık"), 100, 1500, 600, 50, v => { count = v; reset(); }),
      btn(L("Palette", "Palet"), () => { pal = (pal + 1) % pals.length; reset(); }), btn(L("New seed", "Yeni tohum"), () => { seed = Math.random() * 1000; reset(); })),
      note(L("Each particle follows an invisible field of angles. Change one number, get a new artwork.", "Her parçacık görünmez bir açı alanını izler. Tek bir sayıyı değiştir, yeni bir eser çıksın.")));
    s.c.addEventListener("pointerdown", () => { seed = Math.random() * 1000; reset(); });
    reset();
    const field = (x, y) => Math.sin(x * .004 * scale + seed) * 2 + Math.cos(y * .005 * scale - seed * .7) * 2 + Math.sin((x + y) * .002 * scale);
    const stop = loop(() => {
      const { ctx, w, h: H } = s; ctx.fillStyle = "rgba(3,26,68,.03)"; ctx.fillRect(0, 0, w, H);
      parts.forEach(p => {
        const a = field(p.x, p.y), nx = p.x + Math.cos(a) * 1.4, ny = p.y + Math.sin(a) * 1.4;
        ctx.strokeStyle = pals[pal][p.c]; ctx.globalAlpha = .55; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny; if (p.x < 0 || p.x > w || p.y < 0 || p.y > H) { p.x = Math.random() * w; p.y = Math.random() * H; }
      });
      ctx.globalAlpha = 1;
    });
    return () => { stop(); s.stop(); };
  };

  /* ---------- pcb: wire the circuit until the LED lights ---------- */
  PG.pcb = (root, L) => {
    const s = stage(root, 0.5);
    const pads = { "B+": [.12, .3], "B-": [.12, .72], "R1": [.42, .22], "R2": [.62, .22], "LA": [.82, .42], "LK": [.82, .68] };
    let wires = [], sel = null, lit = false;
    const out = h("div", { class: "pg__readout" });
    root.append(bar(btn(L("Undo", "Geri al"), () => { wires.pop(); sel = null; check(); draw(); }), btn(L("Clear", "Temizle"), () => { wires = []; sel = null; check(); draw(); })), out,
      note(L("Click a pad, then another, to draw a copper trace. Battery + → resistor → LED anode, LED cathode → battery −.", "Bir pad'e, sonra diğerine tıklayarak bakır yol çiz. Pil + → direnç → LED anot, LED katot → pil −.")));
    function find(a, par) { while (par[a] !== a) a = par[a] = par[par[a]]; return a; }
    function check() {
      const par = {}; Object.keys(pads).forEach(k => par[k] = k);
      wires.forEach(([a, b]) => { par[find(a, par)] = find(b, par); });
      const same = (a, b) => find(a, par) === find(b, par);
      const short = same("B+", "B-");
      const rOK = (same("B+", "R1") && same("R2", "LA")) || (same("B+", "R2") && same("R1", "LA"));
      lit = !short && rOK && same("LK", "B-");
      const noR = !short && (same("B+", "LA") && same("LK", "B-"));
      out.textContent = short ? L("Short circuit! + and − are connected directly.", "Kısa devre! + ve − doğrudan bağlı.")
        : noR ? L("LED burned out — you skipped the resistor.", "LED yandı — direnci atladın.")
        : lit ? L("Circuit closed — the LED is on ✓", "Devre tamam — LED yanıyor ✓") : L("Circuit open.", "Devre açık.");
    }
    s.c.addEventListener("pointerdown", e => {
      const p = s.pos(e); const hit = Object.entries(pads).find(([, [x, y]]) => Math.hypot(x * s.w - p.x, y * s.h - p.y) < 18);
      if (!hit) { sel = null; draw(); return; }
      if (sel && sel !== hit[0]) { wires.push([sel, hit[0]]); sel = null; check(); } else sel = hit[0];
      draw();
    });
    function draw() {
      const { ctx, w, h: H } = s; ctx.fillStyle = "#0d4a2a"; ctx.fillRect(0, 0, w, H);
      ctx.strokeStyle = "rgba(255,255,255,.06)"; for (let x = 0; x < w; x += 12) for (let y = 0; y < H; y += 12) ctx.strokeRect(x, y, .5, .5);
      const P = k => [pads[k][0] * w, pads[k][1] * H];
      // component bodies
      ctx.fillStyle = "#222"; ctx.fillRect(P("B+")[0] - 26, P("B+")[1] - 6, 52, P("B-")[1] - P("B+")[1] + 12);
      ctx.fillStyle = C.cream; ctx.font = "700 12px 'JetBrains Mono', monospace"; ctx.fillText("BAT 3V", P("B+")[0] - 22, (P("B+")[1] + P("B-")[1]) / 2 + 4);
      ctx.fillStyle = "#d9b98a"; ctx.fillRect(P("R1")[0], P("R1")[1] - 7, P("R2")[0] - P("R1")[0], 14);
      ["#8b4513", "#000", C.red].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(P("R1")[0] + 18 + i * 12, P("R1")[1] - 7, 5, 14); });
      ctx.fillStyle = lit ? "#ff3355" : "#5a1a24"; ctx.shadowColor = "#ff3355"; ctx.shadowBlur = lit ? 30 : 0;
      ctx.beginPath(); ctx.arc(P("LA")[0] + 34, (P("LA")[1] + P("LK")[1]) / 2, 16, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = "#c08a3e"; ctx.lineWidth = 6; ctx.lineCap = "round";
      wires.forEach(([a, b]) => { const [x1, y1] = P(a), [x2, y2] = P(b); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1, (y1 + y2) / 2); ctx.lineTo(x2, (y1 + y2) / 2); ctx.lineTo(x2, y2); ctx.stroke(); });
      Object.keys(pads).forEach(k => {
        const [x, y] = P(k); ctx.fillStyle = sel === k ? C.yellow : "#e0b25a"; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fill();
        ctx.fillStyle = "#0d4a2a"; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill();
        ctx.fillStyle = C.cream; ctx.font = "600 11px 'JetBrains Mono', monospace"; ctx.fillText({ "B+": "+", "B-": "−", R1: "R", R2: "R", LA: "A", LK: "K" }[k], x + 13, y - 10);
      });
    }
    check();
    const ro = new ResizeObserver(draw); ro.observe(s.c); draw();
    return () => { ro.disconnect(); s.stop(); };
  };

  /* ---------- vibe: prompt → code → app (simulated, no AI is called) ---------- */
  PG.vibe = (root, L) => {
    const apps = {
      counter: { k: /count|sayaç|sayac|click|tıkla/i, code: "let n = 0;\nbutton.onclick = () => {\n  n++;\n  label.textContent = n;\n};",
        make: el => { let n = 0; const lab = h("b", { class: "pg__big" }, "0"); el.append(lab, btn("+1", () => lab.textContent = ++n, "is-on")); } },
      dice: { k: /dice|zar|random|rastgele/i, code: "button.onclick = () => {\n  const d = 1 + Math.floor(Math.random()*6);\n  face.textContent = '⚀⚁⚂⚃⚄⚅'[d-1];\n};",
        make: el => { const f = h("b", { class: "pg__big" }, "⚄"); el.append(f, btn(L("Roll", "At"), () => f.textContent = "⚀⚁⚂⚃⚄⚅"[(Math.random() * 6) | 0], "is-on")); } },
      todo: { k: /todo|list|liste|görev|gorev|ödev|odev/i, code: "form.onsubmit = e => {\n  e.preventDefault();\n  list.append(li(input.value));\n  input.value = '';\n};",
        make: el => { const ul = h("ul", { class: "pg__todo" }); const i = h("input", { class: "pg__input", placeholder: L("New task", "Yeni görev") }); el.append(h("div", { class: "pg__row" }, i, btn(L("Add", "Ekle"), () => { if (i.value.trim()) { ul.append(h("li", { onclick: e => e.target.classList.toggle("done") }, i.value)); i.value = ""; } }, "is-on")), ul); } },
      color: { k: /colou?r|renk|palet/i, code: "button.onclick = () => {\n  const h = Math.random()*360;\n  box.style.background = `hsl(${h} 80% 60%)`;\n};",
        make: el => { const b = h("div", { class: "pg__swatch" }); const go = () => { const hh = (Math.random() * 360) | 0; b.style.background = `hsl(${hh} 80% 60%)`; b.textContent = `hsl(${hh} 80% 60%)`; }; el.append(b, btn(L("New colour", "Yeni renk"), go, "is-on")); go(); } }
    };
    const inp = h("input", { class: "pg__input", value: L("make a dice app", "zar atan bir uygulama yap") });
    const codeEl = h("pre", { class: "pg__code pg__codeout" }), prev = h("div", { class: "pg__preview" });
    let typing = 0;
    function go() {
      const key = Object.keys(apps).find(k => apps[k].k.test(inp.value)) || "counter", a = apps[key];
      clearInterval(typing); codeEl.textContent = ""; prev.innerHTML = ""; let i = 0;
      typing = setInterval(() => { codeEl.textContent = a.code.slice(0, i += 3); if (i >= a.code.length) { clearInterval(typing); a.make(prev); } }, 20);
    }
    const sug = [L("counter app", "sayaç uygulaması"), L("to-do list", "ödev listesi"), L("random colour", "rastgele renk"), L("dice", "zar at")];
    root.append(h("div", { class: "pg__row" }, inp, btn(L("Generate", "Üret"), go, "is-on")),
      h("div", { class: "pg__chips" }, sug.map(t => h("button", { type: "button", class: "pg__chip", onclick: () => { inp.value = t; go(); } }, t))),
      h("div", { class: "pg__split" }, codeEl, prev),
      note(L("Simulated: this demo matches keywords to ready-made snippets. In the workshop a real AI model writes the code from your words.", "Simülasyon: bu demo anahtar kelimeleri hazır kod parçalarıyla eşleştirir. Atölyede gerçek bir yapay zeka modeli kodu senin sözlerinden yazıyor.")));
    go();
    return () => clearInterval(typing);
  };

  window.PLAYGROUNDS = PG;
})();
