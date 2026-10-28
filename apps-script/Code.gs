/**
 * Hisar Coding Summit 13 — registration backend.
 *
 * A standalone Apps Script project (script.google.com) that writes into the sheet SHEET_ID, deployed as a Web App
 * (Execute as: Me, Who has access: Anyone). The site's register.html POSTs JSON here as
 * text/plain; every submission lands in the sheet within a second, whether or not any
 * computer is on — it runs on Google's servers.
 *
 * Tabs (created by setup() or on the first submission):
 *   Kayıtlar    — one row per student (latest submission per e-mail wins)
 *   Katılımlar  — one row per student × workshop (filter this tab by workshop)
 *   Dersler     — every workshop: count, capacity (editable), student list
 */

// "Hisar Coding Summit 13 — Kayıtlar" in keremduruk12@gmail.com's Drive.
const SHEET_ID = "15Jz79AIj8mCyBAn5tiEog0ChrqFwJwjoSyEXeXQgHGU";

const TAB_REG = "Kayıtlar";
const TAB_JOIN = "Katılımlar";
const TAB_WS = "Dersler";

const REG_HEADERS = ["Kayıt ID", "Zaman", "Ad", "Soyad", "E-posta", "Telefon", "Okul", "Sınıf",
  "Atölyeler", "Atölye sayısı", "Notlar", "Dil", "KVKK onayı", "Güncellendi"];
const JOIN_HEADERS = ["Atölye", "Atölye ID", "Ad Soyad", "E-posta", "Telefon", "Okul", "Sınıf", "Kayıt ID", "Zaman"];
const WS_HEADERS = ["Atölye ID", "Atölye", "Kayıtlı", "Kontenjan", "Kalan", "Öğrenciler"];

function doGet() {
  return json_({ ok: true, service: "HCS13 registration" });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, error: "bad_json" });
  }
  if (data.website) return json_({ ok: true });  // honeypot: bots fill it, people never see it

  const clean = s => String(s == null ? "" : s).trim().slice(0, 300);
  const reg = {
    firstName: clean(data.firstName), lastName: clean(data.lastName),
    email: clean(data.email).toLowerCase(), phone: clean(data.phone),
    school: clean(data.school), grade: clean(data.grade), notes: clean(data.notes).slice(0, 1000),
    lang: clean(data.lang), consent: data.consent === true,
    workshops: (Array.isArray(data.workshops) ? data.workshops : [])
      .map(w => ({ id: clean(w && w.id), name: clean(w && w.name) }))
      .filter(w => w.id && w.name).slice(0, 40)
  };
  if (!reg.firstName || !reg.lastName) return json_({ ok: false, error: "name" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) return json_({ ok: false, error: "email" });
  if (reg.phone.replace(/\D/g, "").length < 10) return json_({ ok: false, error: "phone" });
  if (!reg.workshops.length) return json_({ ok: false, error: "workshops" });
  if (!reg.consent) return json_({ ok: false, error: "consent" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const regSh = tab_(ss, TAB_REG, REG_HEADERS);
    const joinSh = tab_(ss, TAB_JOIN, JOIN_HEADERS);
    const now = new Date();
    const names = reg.workshops.map(w => w.name).join(", ");

    // One row per e-mail: a second submission replaces the first.
    const emails = regSh.getLastRow() > 1 ? regSh.getRange(2, 5, regSh.getLastRow() - 1, 1).getValues().map(r => r[0]) : [];
    const at = emails.indexOf(reg.email);
    let id;
    if (at >= 0) {
      const row = at + 2;
      id = regSh.getRange(row, 1).getValue();
      regSh.getRange(row, 2, 1, 13).setValues([[regSh.getRange(row, 2).getValue(), reg.firstName, reg.lastName,
        reg.email, "'" + reg.phone, reg.school, reg.grade, names, reg.workshops.length, reg.notes, reg.lang, "Evet", now]]);
      removeJoins_(joinSh, id);
    } else {
      id = "HCS-" + Utilities.getUuid().slice(0, 8).toUpperCase();
      regSh.appendRow([id, now, reg.firstName, reg.lastName, reg.email, "'" + reg.phone, reg.school, reg.grade,
        names, reg.workshops.length, reg.notes, reg.lang, "Evet", ""]);
    }

    const full = reg.firstName + " " + reg.lastName;
    const rows = reg.workshops.map(w => [w.name, w.id, full, reg.email, "'" + reg.phone, reg.school, reg.grade, id, now]);
    joinSh.getRange(joinSh.getLastRow() + 1, 1, rows.length, JOIN_HEADERS.length).setValues(rows);

    rebuildDersler_(ss, reg.workshops);
    return json_({ ok: true, id: id, updated: at >= 0 });
  } finally {
    lock.releaseLock();
  }
}

/** Run once from the editor: creates the tabs and lists every workshop from WORKSHOPS. */
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  tab_(ss, TAB_REG, REG_HEADERS);
  tab_(ss, TAB_JOIN, JOIN_HEADERS);
  tab_(ss, TAB_WS, WS_HEADERS);
  rebuildDersler_(ss, WORKSHOPS);
  const first = ss.getSheetByName("Sheet1") || ss.getSheetByName("Sayfa1");
  if (first && ss.getSheets().length > 3 && first.getLastRow() === 0) ss.deleteSheet(first);
}

/** Recount every workshop from Katılımlar. Capacity (column D) is kept as typed. */
function rebuildDersler_(ss, seen) {
  const wsSh = tab_(ss, TAB_WS, WS_HEADERS);
  const joinSh = tab_(ss, TAB_JOIN, JOIN_HEADERS);

  const existing = wsSh.getLastRow() > 1 ? wsSh.getRange(2, 1, wsSh.getLastRow() - 1, 4).getValues() : [];
  const order = [], byId = {};
  existing.forEach(r => { if (r[0]) { order.push(r[0]); byId[r[0]] = { name: r[1], cap: r[3], people: [] }; } });
  (seen || []).forEach(w => { if (!byId[w.id]) { order.push(w.id); byId[w.id] = { name: w.name, cap: "", people: [] }; } });

  const joins = joinSh.getLastRow() > 1 ? joinSh.getRange(2, 1, joinSh.getLastRow() - 1, 3).getValues() : [];
  joins.forEach(r => {
    if (!byId[r[1]]) { order.push(r[1]); byId[r[1]] = { name: r[0], cap: "", people: [] }; }
    byId[r[1]].people.push(r[2]);
  });

  const out = order.map(id => {
    const w = byId[id];
    const left = w.cap === "" ? "" : Number(w.cap) - w.people.length;
    return [id, w.name, w.people.length, w.cap, left, w.people.join(", ")];
  });
  if (wsSh.getLastRow() > 1) wsSh.getRange(2, 1, wsSh.getLastRow() - 1, WS_HEADERS.length).clearContent();
  if (out.length) wsSh.getRange(2, 1, out.length, WS_HEADERS.length).setValues(out);
}

/** Run from the editor after editing Katılımlar by hand (e.g. deleting a row) to recount Dersler. */
function refresh() { rebuildDersler_(SpreadsheetApp.openById(SHEET_ID), []); }

function removeJoins_(sh, id) {
  if (sh.getLastRow() < 2) return;
  const ids = sh.getRange(2, 8, sh.getLastRow() - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) if (ids[i][0] === id) sh.deleteRow(i + 2);
}

function tab_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold")
      .setBackground("#0b3f8f").setFontColor("#f4f1c1");
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Filled from assets/js/data.js (id + Turkish name). Re-run setup() after editing.
const WORKSHOPS = [
  {"id": "ar-interactive-mechanical-systems-automata", "name": "AR Etkileşimli Mekanik Sistemler: Otomata"},
  {"id": "rnd-rapid-prototyping-minds-and-machines", "name": "Ar-Ge ve Hızlı Prototipleme: Zihinler ve Makineler"},
  {"id": "machine-learning-for-kids", "name": "Çocuklar İçin Makine Öğrenimi"},
  {"id": "frc-robotics-sprint-a-robot-in-4-hours", "name": "FRC Robotik Sprinti — 4 Saatte Robot"},
  {"id": "2d-game-design-with-godot-monster-invasion", "name": "Godot ile 2D Oyun Tasarımı: Canavar İstilası!"},
  {"id": "modelling-and-visualisation-with-julia", "name": "Julia ile Modelleme ve Görselleştirme"},
  {"id": "design-your-own-sticker-graphic-design-and-stick", "name": "Kendi Sticker'ını Tasarla: Grafik Tasarım ve Sticker Baskı Atölyesi"},
  {"id": "quantum-computing", "name": "Kuantum Bilişim"},
  {"id": "layered-making-with-laser-cutting-design-cut-bui", "name": "Lazer Kesim ile Katmanlı Üretim: Tasarla, Kes, İnşa Et"},
  {"id": "lemon-building-bio-inspired-robots", "name": "Lemon: Biyo-İlhamlı Robotlar İnşa Etmek"},
  {"id": "design-your-own-jointed-animal-in-onshape", "name": "Onshape ile Kendi Eklemli Hayvanını Tasarla"},
  {"id": "cybersecurity-workshop-router-penetration-testin", "name": "Siber Güvenlik Atölyesi: Modem Sızma Testi"},
  {"id": "technovation-girls-prototyping-for-impact", "name": "Technovation Girls: Etki İçin Prototipleme"},
  {"id": "cardboard-robots-with-micro-bit", "name": "micro:bit ile Kartondan Robot Yapımı"},
  {"id": "swift-playground-an-image-recognition-app", "name": "Swift Playground: Görüntü Tanıma Uygulaması"},
  {"id": "piwars-challenge-robot-design", "name": "PiWars Yarışması: Robot Tasarımı"},
  {"id": "snap-fit-3d-toy-design-and-making-in-tinkercad", "name": "TinkerCad ile Snap-Fit 3D Oyuncak Tasarımı ve Üretimi"},
  {"id": "making-music-with-ai-a-java-workshop", "name": "Yapay Zeka ile Müzik Üretimi: Java Atölyesi"},
  {"id": "data-analysis-with-wolfram", "name": "Wolfram ile Veri Analizi"},
  {"id": "vinyl-cutting", "name": "Vinil Kesim"},
  {"id": "haas-cnc", "name": "Haas CNC"},
  {"id": "video-editing", "name": "Video Editing"},
  {"id": "fabart-sustainable-aesthetics", "name": "FabArt: Sürdürülebilir Estetik"},
  {"id": "pcb-design", "name": "PCB"},
  {"id": "brother-embroidery-machine", "name": "Brother Nakış Makinesi"},
  {"id": "vibe-coding-build-apps-with-ai", "name": "Vibe Coding: Yapay Zeka ile Uygulama Yap"},
  {"id": "tiny-ml-ai-meets-electronics", "name": "Tiny ML: Yapay Zeka Elektronikle Buluşuyor"},
  {"id": "creative-coding-art-meets-algorithms", "name": "Creative Coding: Sanat ve Algoritmalar"},
  {"id": "generative-design-code-to-create", "name": "Generative Design: Kodla Üret"}
];
