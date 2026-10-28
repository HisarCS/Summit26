(() => {
  "use strict";

  const S = (typeof window !== "undefined" && window.SUMMIT) || { workshops: [], categories: {} };
  const WS = (S.workshops || []).filter(w => w && w.title && w.id);
  const CATS = S.categories || {};

  /* ---------------- i18n (same storage key as the main site) ---------------- */
  const T = {
    en: {
      "reg.back": "Back to site", "reg.eyebrow": "Registration", "reg.title": "Take the <em>leap</em>",
      "reg.lead": "Tell us who you are and pick the workshops you want to join on 18–19 December 2026. Seats in each workshop are limited.",
      "reg.soonTitle": "Registration opens soon",
      "reg.soonText": "The form is ready, but we are not taking sign-ups yet. Follow @hisarcs to be the first to know.",
      "reg.first": "First name", "reg.last": "Last name", "reg.email": "Email", "reg.phone": "Phone",
      "reg.phoneHint": "Mobile number, e.g. 0532 123 45 67 or +90 532 123 45 67",
      "reg.school": "School", "reg.grade": "Grade", "reg.gradeNone": "Select…", "reg.gradeN": n => `Grade ${n}`,
      "reg.gradeGrad": "Graduate", "reg.gradeOther": "Other",
      "reg.workshops": "Workshops", "reg.wsSearch": "Search workshops…", "reg.wsNone": "No workshop matches your search.",
      "reg.picked": n => `${n} selected`, "reg.notes": "Notes", "reg.notesPh": "Anything we should know? (optional)",
      "reg.consent": "I consent to my personal data being processed for Hisar Coding Summit registration.",
      "reg.submit": "Register", "reg.sending": "Sending…", "reg.retry": "Try again", "reg.required": "* required",
      "reg.failTitle": "We could not send your registration",
      "reg.failNet": "Check your connection and try again. Your answers are still here.",
      "reg.failTimeout": "The server took too long to answer. Please try again in a moment.",
      "reg.failServer": "Something went wrong on our side. Please try again, or write to us.",
      "reg.doneEyebrow": "Done", "reg.doneTitle": "You're <em>registered</em>",
      "reg.doneText": name => `Thanks, ${name}. Your registration is received. Your workshops:`,
      "reg.help": "Questions? Contact us",
      "err.required": "This field is required.", "err.email": "Enter a valid email address.",
      "err.phone": "Enter a valid mobile number, e.g. 0532 123 45 67.",
      "err.workshops": "Pick at least one workshop.", "err.consent": "You need to give your consent to register."
    },
    tr: {
      "reg.back": "Siteye dön", "reg.eyebrow": "Kayıt", "reg.title": "Sen de <em>sıçra</em>",
      "reg.lead": "Bize biraz kendinden bahset ve 18–19 Aralık 2026'da katılmak istediğin atölyeleri seç. Her atölyenin kontenjanı sınırlı.",
      "reg.soonTitle": "Kayıtlar çok yakında açılıyor",
      "reg.soonText": "Form hazır ama kayıtlar henüz başlamadı. Haberin ilk olsun diye @hisarcs'ı takip et.",
      "reg.first": "Ad", "reg.last": "Soyad", "reg.email": "E-posta", "reg.phone": "Telefon",
      "reg.phoneHint": "Cep telefonu, örn. 0532 123 45 67 veya +90 532 123 45 67",
      "reg.school": "Okul", "reg.grade": "Sınıf", "reg.gradeNone": "Seç…", "reg.gradeN": n => `${n}. sınıf`,
      "reg.gradeGrad": "Mezun", "reg.gradeOther": "Diğer",
      "reg.workshops": "Atölyeler", "reg.wsSearch": "Atölye ara…", "reg.wsNone": "Aramana uyan atölye yok.",
      "reg.picked": n => `${n} seçildi`, "reg.notes": "Notlar", "reg.notesPh": "Bilmemiz gereken bir şey var mı? (isteğe bağlı)",
      "reg.consent": "Kişisel verilerimin Hisar Coding Summit kaydı için işlenmesini kabul ediyorum.",
      "reg.submit": "Kayıt ol", "reg.sending": "Gönderiliyor…", "reg.retry": "Tekrar dene", "reg.required": "* zorunlu",
      "reg.failTitle": "Kaydın gönderilemedi",
      "reg.failNet": "Bağlantını kontrol edip tekrar dene. Cevapların burada duruyor.",
      "reg.failTimeout": "Sunucu geç yanıt verdi. Biraz sonra tekrar dene.",
      "reg.failServer": "Bizim tarafta bir aksilik çıktı. Tekrar dene ya da bize yaz.",
      "reg.doneEyebrow": "Tamamdır", "reg.doneTitle": "Kaydın <em>alındı</em>",
      "reg.doneText": name => `Teşekkürler ${name}, kaydın bize ulaştı. Seçtiğin atölyeler:`,
      "reg.help": "Takıldığın bir yer mi var? Bize yaz",
      "err.required": "Bu alan zorunlu.", "err.email": "Geçerli bir e-posta adresi gir.",
      "err.phone": "Geçerli bir cep telefonu numarası gir, örn. 0532 123 45 67.",
      "err.workshops": "En az bir atölye seç.", "err.consent": "Kayıt için onay vermelisin."
    }
  };
  let lang = "en";
  try { lang = localStorage.getItem("hcs13.lang") || ((navigator.language || "").startsWith("tr") ? "tr" : "en"); } catch (e) {}
  const t = (k, ...a) => { const v = (T[lang] || T.en)[k] ?? T.en[k]; return typeof v === "function" ? v(...a) : v; };
  const pick = v => (v && typeof v === "object") ? (v[lang] ?? v.en ?? "") : (v ?? "");

  /* ---------------- pure helpers (unit-tested in node) ---------------- */
  const normPhone = p => String(p || "").replace(/[\s().\-]/g, "");
  const phoneOk = p => /^(?:\+?90|0)?5\d{9}$/.test(normPhone(p));
  const emailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "").trim());

  function validate(v, t_) {
    const e = {}, req = s => !String(s || "").trim();
    if (req(v.firstName)) e.firstName = "err.required";
    if (req(v.lastName)) e.lastName = "err.required";
    if (req(v.email)) e.email = "err.required"; else if (!emailOk(v.email)) e.email = "err.email";
    if (req(v.phone)) e.phone = "err.required"; else if (!phoneOk(v.phone)) e.phone = "err.phone";
    if (!v.workshops || !v.workshops.length) e.workshops = "err.workshops";
    if (!v.consent) e.consent = "err.consent";
    return e;
  }

  function buildPayload(v, workshops, lang_, ua) {
    const chosen = new Set(v.workshops || []);
    return {
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      email: v.email.trim(),
      phone: normPhone(v.phone),
      school: (v.school || "").trim(),
      grade: v.grade || "",
      workshops: workshops.filter(w => chosen.has(w.id)).map(w => ({ id: w.id, name: (w.title && w.title.tr) || (w.title && w.title.en) || "" })),
      notes: (v.notes || "").trim(),
      consent: true,
      lang: lang_,
      website: v.website || "",
      ua: ua || ""
    };
  }

  if (typeof module !== "undefined" && module.exports) { module.exports = { validate, buildPayload, phoneOk, emailOk, normPhone }; }
  if (typeof document === "undefined") return;

  /* ---------------- page ---------------- */
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const form = $("#form"), selected = new Set();
  let sending = false, lastErrors = {};

  function renderGrades() {
    const sel = $("#grade"), cur = sel.value;
    sel.innerHTML = `<option value="">${t("reg.gradeNone")}</option>` +
      [5, 6, 7, 8, 9, 10, 11, 12].map(n => `<option value="${n}">${esc(t("reg.gradeN", n))}</option>`).join("") +
      `<option value="mezun">${t("reg.gradeGrad")}</option><option value="diger">${t("reg.gradeOther")}</option>`;
    sel.value = cur;
  }

  function renderWorkshops() {
    const q = $("#wsq").value.trim().toLocaleLowerCase(lang);
    const list = WS.filter(w => !q || [w.title.en, w.title.tr, (CATS[w.cat] || {})[lang]].join(" ").toLocaleLowerCase(lang).includes(q));
    $("#wsList").innerHTML = list.length ? list.map(w => {
      const c = CATS[w.cat] || {}, id = "w-" + w.id;
      return `<label class="wopt" for="${id}"><input type="checkbox" id="${id}" value="${esc(w.id)}"${selected.has(w.id) ? " checked" : ""} />` +
        `<span class="box" aria-hidden="true"></span><span class="t"><b>${esc(pick(w.title))}</b><span><i style="background:${c.color || "#f4f1c1"}"></i>${esc(c[lang] || w.cat)}</span></span></label>`;
    }).join("") : `<p class="none">${t("reg.wsNone")}</p>`;
    updatePicked();
  }
  function updatePicked() { $("#picked").textContent = selected.size ? t("reg.picked", selected.size) : ""; }
  $("#wsList").addEventListener("change", e => {
    const cb = e.target.closest("input[type=checkbox]"); if (!cb) return;
    cb.checked ? selected.add(cb.value) : selected.delete(cb.value);
    updatePicked(); if (lastErrors.workshops) { delete lastErrors.workshops; showErrors(); }
  });
  $("#wsq").addEventListener("input", renderWorkshops);

  function values() {
    const g = id => form.elements[id];
    return {
      firstName: g("firstName").value, lastName: g("lastName").value, email: g("email").value, phone: g("phone").value,
      school: g("school").value, grade: g("grade").value, workshops: [...selected], notes: g("notes").value,
      consent: g("consent").checked, website: g("website").value
    };
  }
  function showErrors() {
    $$(".err", form).forEach(p => {
      const k = lastErrors[p.dataset.for];
      p.textContent = k ? t(k) : "";
      const f = p.closest(".f"); if (f) f.classList.toggle("has-err", !!k);
    });
  }
  form.addEventListener("input", e => {
    const n = e.target.name; if (n && lastErrors[n]) { delete lastErrors[n]; showErrors(); }
  });
  form.addEventListener("change", e => { if (e.target.name === "consent" && lastErrors.consent) { delete lastErrors.consent; showErrors(); } });

  const endpoint = () => (S.registrationEndpoint || "").trim();
  function applyState() {
    const open = !!endpoint();
    $("#soon").hidden = open;
    $("#submit").disabled = !open || sending;
  }

  async function send(payload) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
    try {
      const res = await fetch(endpoint(), { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), signal: ctl.signal });
      let data = null; try { data = await res.json(); } catch (e) {}
      if (res.ok && data && data.ok === true) return { ok: true };
      return { ok: false, kind: "server", error: data && data.error };
    } catch (e) {
      return { ok: false, kind: e && e.name === "AbortError" ? "timeout" : "net" };
    } finally { clearTimeout(timer); }
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (sending || !endpoint()) return;
    const v = values();
    lastErrors = validate(v);
    showErrors();
    const first = Object.keys(lastErrors)[0];
    if (first) {
      const el = first === "workshops" ? $("#wsq") : form.elements[first];
      el && el.focus({ preventScroll: true }); el && el.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    $("#fail").hidden = true;
    sending = true; $("#submit").disabled = true; $("#submitText").textContent = t("reg.sending");
    const r = await send(buildPayload(v, WS, lang, navigator.userAgent));
    sending = false; $("#submitText").textContent = t("reg.submit"); applyState();
    if (r.ok) { showDone(v); return; }
    $("#failMsg").textContent = t(r.kind === "timeout" ? "reg.failTimeout" : r.kind === "net" ? "reg.failNet" : "reg.failServer");
    $("#submitText").textContent = t("reg.retry");
    $("#fail").hidden = false; $("#fail").scrollIntoView({ block: "center", behavior: "smooth" });
  });

  let doneV = null;
  function showDone(v) {
    doneV = v; renderDone();
    form.hidden = true; $(".reg__soon").hidden = true; $("#done").hidden = false;
    $("#done").scrollIntoView({ block: "start", behavior: "smooth" });
  }
  function renderDone() {
    if (!doneV) return;
    $("#doneText").textContent = t("reg.doneText", doneV.firstName.trim());
    $("#doneList").innerHTML = WS.filter(w => doneV.workshops.includes(w.id)).map(w => `<li><i style="background:${(CATS[w.cat] || {}).color || "#f4f1c1"}"></i>${esc(pick(w.title))}</li>`).join("");
  }

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    renderGrades(); renderWorkshops(); showErrors(); renderDone();
    if (!sending && $("#fail").hidden) $("#submitText").textContent = t("reg.submit");
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    lang = b.dataset.lang; try { localStorage.setItem("hcs13.lang", lang); } catch (e) {}
    applyLang();
  }));

  $("#yr").textContent = new Date().getFullYear();
  applyLang(); applyState();
})();
