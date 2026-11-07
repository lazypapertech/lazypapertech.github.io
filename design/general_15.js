"use strict";

/* ═════════════ Config ═════════════ */
const WS_HOST = "rndomg84pbrg.onrender.com";
const LINKS = {
  menu: [["Home", "/"], ["Features", "./es/subtitulos-automaticos#description-container"], ["How to use", "./generador-de-subtitulos#clip-container"], ["FAQ", "./generador-de-subtitulos#descr"]],
  advanced: "https://www.youtube.com",
};
const LANGUAGES = ["English (beta)", "Español", "Portuguese", "German", "Italian"];
const OUTPUT_LANGS = { English: "en", Spanish: "es", Portuguese: "pt", French: "fr", German: "de", Italian: "it" };
const SOURCE_NAME = { 1: "Spanish", 2: "Portuguese" }; // index in LANGUAGES -> option hidden in "Translate"
const STEPS = [
  ["Upload", "Choose your MP4 and the language spoken in it."],
  ["Edit", "Fix any text, then press “Add captions” to finish."],
  ["Add captions", "Rendering your video. This can take a minute."],
  ["Download", "Your video is ready."],
];
const MAX_SIZE = 350e6;
const FONT_COUNT = 11;
const MAX_RECONNECTS = 120;
const SEP = "_client_";
const RING = 131.95; // 2 * PI * r(21)

/* ═════════════ Helpers ═════════════ */
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, props = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  el.append(...kids.flat().filter((k) => k != null && k !== false));
  return el;
};
const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICON = {
  upload: svg('<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 9.5H17"/><path d="M12 12v8M9 15l3-3 3 3"/>'),
  tune: svg('<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M18 18h2"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>'),
  caps: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 12h4M13 12h4M7 15.5h7"/>'),
  dl: svg('<path d="M12 4v11M8 11l4 4 4-4M5 19h14"/>'),
  up: svg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
};
const btn = (cls, icon, text, onclick) => {
  const b = h("button", { class: "btn " + cls, type: "button", onclick });
  if (icon) b.insertAdjacentHTML("beforeend", icon);
  b.append(h("span", {}, text));
  b.lbl = b.lastChild;
  return b;
};
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const rnd = () => "mywebsite" + ((1000 + Math.random() * 9000) | 0);
const autosize = (t) => { t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; };

/* ═════════════ State ═════════════ */
const uid = (() => {
  let id = localStorage.getItem("useridmywebsite");
  if (!id) {
    id = Array.from({ length: 10 }, () => "0123456789abcdefghijklmnopqrstuvwxyz"[(Math.random() * 36) | 0]).join("");
    localStorage.setItem("useridmywebsite", id);
  }
  return id;
})();
const navLang = (navigator.language || "en").slice(0, 2);

const st = {
  ws: null, view: "", step: 0, connecting: true, dup: false, reconnects: 0, rcTimer: null, reqTimer: null, timer: null,
  uploadPhase: true, waitingCaptions: false, waitingVideo: false, waitingMp4: false,
  lang: { es: 1, pt: 2, de: 3, it: 4 }[navLang] ?? 0,
  file: null, duration: 1,
  captions: "", captionLength: 0.5, durations: null, firstUrl: "", paramsAI: "", aiPrompt: "", hl: -1,
  font: "9", colorMode: "mono", mono: "#FFFFFF", multi: ["#0FF764", "#FFFF00", "#469AFA"], pos: 1, glow: 1, audio: 1,
  videoTag: "mp4", mime: "application/octet-stream", ext: ".webm", blob: null, chunks: [], recv: 0,
  nSeg: 0, frameIdx: 0, ts: 0, fps: 10, videoSecs: 1,
  mp4: { chunks: [], recv: 0, blob: null, progress: 0 },
};
const subtitleColor = () =>
  st.colorMode === "mono"
    ? st.mono.slice(1).toUpperCase()
    : st.multi.map((c) => c.slice(1).toUpperCase()).join("-");

const ui = {};
let ctx = null, decoder = null, anim = 0, tAnim = 0, toastT = 0;

/* ═════════════ UI construction ═════════════ */
function build() {
  document.body.prepend(buildHeader());
  ui.steps = buildSteps();
  ui.views = { upload: buildUpload(), loading: buildLoading(), preview: buildPreview(), workspace: buildWorkspace() };
  ui.cancelBtn = h("button", { class: "btn sm", type: "button", onclick: cancelTask }, "Cancel");
  ui.cancel = h("div", { class: "cancel", hidden: "" }, ui.cancelBtn, h("p", {}, "Press Cancel if the task freezes or to edit."));
  $("#app").append(ui.steps.el, ...Object.values(ui.views), ui.cancel);
  ui.toast = h("div", { class: "toast", role: "status", hidden: "" });
  document.body.append(ui.toast);
  document.addEventListener("click", (e) => { if (e.target.closest("[data-track]")) send("tutorial_presionado"); });
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("beforeunload", () => { if (st.ws) { st.ws.onclose = null; st.ws.close(1000, "Page unloading"); } });
}

function buildHeader() {
  const nav = h("nav", { class: "nav" }, LINKS.menu.map(([t, u], i) => h("a", i ? { href: u, "data-track": "" } : { href: u }, t)));
  const burger = h("button", {
    class: "burger", type: "button", "aria-label": "Menu", "aria-expanded": "false",
    onclick: () => burger.setAttribute("aria-expanded", nav.classList.toggle("open")),
  }, "☰");
  return h("header", { class: "top" },
    h("a", { class: "brand", href: "/", translate: "no" }, h("img", { src: "./design/images/title.jpg", alt: "Logo" }), h("span", {}, "Manycaptions")),
    nav, burger);
}

function buildSteps() {
  const label = h("p", { class: "steps-label" });
  const segs = STEPS.map(([n]) => h("div", { class: "st" }, h("i"), h("span", {}, n)));
  return {
    el: h("div", { class: "steps", "aria-live": "polite" }, label, h("div", { class: "track" }, segs)),
    set(i) {
      label.replaceChildren(h("b", {}, `Step ${i} of ${STEPS.length}: ${STEPS[i - 1][0]}`), STEPS[i - 1][1]);
      segs.forEach((s, k) => (s.className = "st" + (k + 1 < i ? " past" : k + 1 === i ? " now" : "")));
    },
  };
}

function buildUpload() {
  ui.input = h("input", { type: "file", accept: "video/mp4", hidden: "" });
  ui.input.addEventListener("change", () => handleFile(ui.input.files[0]));
  const chips = LANGUAGES.map((l, i) => h("button", {
    class: "chip", type: "button", "aria-pressed": i === st.lang,
    onclick: () => { st.lang = i; chips.forEach((c, k) => c.setAttribute("aria-pressed", k === i)); updateTranslateOptions(); },
  }, l));
  const drop = h("div", { class: "drop" },
    h("span", { html: ICON.upload }),
    h("p", { class: "drop-t" }, "Drop your MP4 here"),
    btn("primary big", "", "Choose video", () => ui.input.click()),
    h("p", { class: "note ok" }, "Active during daylight hours"),
    ui.input);
  ["dragover", "dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => {
    e.preventDefault();
    drop.classList.toggle("over", ev === "dragover");
    if (ev === "drop") handleFile(e.dataTransfer.files[0]);
  }));
  return h("section", { class: "card", hidden: "" }, h("p", { class: "lbl" }, "Video language"), h("div", { class: "chips" }, chips), drop);
}

function buildLoading() {
  const ring = h("div", { class: "ring", html: '<svg viewBox="0 0 50 50"><circle class="bg" cx="25" cy="25" r="21"/><circle class="fg" cx="25" cy="25" r="21"/></svg>' });
  ui.ringFg = $(".fg", ring);
  ui.pct = h("span", { class: "pct" }, "0%");
  ring.append(ui.pct);
  ui.ldesc = h("p", { class: "ldesc" });
  return h("section", { class: "card load", hidden: "" }, ring, ui.ldesc);
}

function buildPreview() {
  ui.canvas = h("canvas", { class: "live" });
  ctx = ui.canvas.getContext("2d");
  ui.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  ui.bar = h("i");
  return h("section", { class: "card", hidden: "" }, ui.canvas, h("div", { class: "bar" }, ui.bar), h("p", { class: "note" }, "Audio available when render finish"));
}

function buildWorkspace() {
  const v = (ui.video = h("video", { controls: "", playsinline: "", preload: "auto", controlsList: "nodownload" }));
  v.addEventListener("contextmenu", (e) => e.preventDefault());
  v.addEventListener("timeupdate", onTime);
  ui.playerErr = h("p", { class: "err", hidden: "" });
  const player = h("div", { class: "card player" }, h("div", { class: "frame" }, v), ui.playerErr);

  ui.btnCreate = btn("primary big create pulse", ICON.caps, "Add captions", onCreate);
  ui.btnMp4 = btn("primary big", ICON.dl, "Download MP4", downloadMp4);
  ui.btnWebm = btn("big", "", "WEBM", downloadVideo);
  ui.hint = h("p", { class: "hint" });
  const actions = h("div", { class: "actions" },
    h("div", { class: "dl" }, ui.btnMp4, ui.btnWebm),
    h("div", { class: "row-btns" }, btn("big", ICON.tune, "Customize", openSettings), ui.btnCreate),
    ui.hint);

  ui.translate = h("select", { class: "sel", "aria-label": "Translate", onchange: onTranslate },
    h("option", { value: "Reset" }, "Original text"),
    Object.keys(OUTPUT_LANGS).map((l) => h("option", { value: l }, "Translate to " + l)));
  ui.caps = h("div", { class: "caps" });
  const paneCaps = h("div", {}, h("div", { class: "toolbar" }, ui.translate,
    btn("sm", "", "SRT", () => downloadText(".srt")), btn("sm", "", "TXT", () => downloadText(".txt"))), ui.caps);
  const paneAI = buildAI();
  paneAI.hidden = true;
  const tabs = [["cap", "Captions", paneCaps], ["ai", "AI Editor", paneAI]].map(([k, t, pane]) =>
    h("button", {
      class: "tab", type: "button", role: "tab", "aria-selected": k === "cap",
      onclick: () => { tabs.forEach((b) => b.setAttribute("aria-selected", b === tabs[k === "cap" ? 0 : 1])); paneCaps.hidden = k !== "cap"; paneAI.hidden = k !== "ai"; resizeAll(); },
    }, t));
  const capcard = h("div", { class: "card capcard" }, h("div", { class: "tabs", role: "tablist" }, tabs), paneCaps, paneAI);

  return h("section", { class: "ws", hidden: "", "data-state": "edit" }, player, capcard, actions);
}

function buildAI() {
  ui.aiHead = h("div", {}, h("h4", {}, "Save many minutes of video editing time."), h("p", {}, "The written instructions will edit the source video."));
  ui.aiPrompt = h("div", { class: "ai-prompt", hidden: "" });
  ui.aiMsg = h("div", { class: "ai-msg", hidden: "" });
  ui.aiInput = h("textarea", { rows: "1", placeholder: "Type your instructions..." });
  ui.aiInput.addEventListener("input", () => { ui.aiInput.style.height = "24px"; ui.aiInput.style.height = Math.min(ui.aiInput.scrollHeight, 96) + "px"; });
  ui.aiInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAI(); } });
  ui.aiSend = h("button", { class: "send", type: "button", "aria-label": "Send", html: ICON.up, onclick: sendAI });
  return h("div", { class: "ai" }, ui.aiHead, ui.aiPrompt, ui.aiMsg, h("div", { class: "ai-in" }, ui.aiInput, ui.aiSend),
    h("a", { class: "btn sm", href: LINKS.advanced, target: "_blank", rel: "noopener", "data-track": "" }, "Tutorial"));
}

/* ═════════════ Stages ═════════════ */
function setStage(view, step, state) {
  st.view = view;
  for (const [k, el] of Object.entries(ui.views)) el.hidden = k !== view;
  ui.steps.set(step);
  ui.cancel.hidden = !(step === 3 && (view === "loading" || view === "preview"));
  if (state) ui.views.workspace.dataset.state = state;
  if (view === "preview") resizeCanvas();
  if (view === "workspace") requestAnimationFrame(resizeAll);
}
function goEdit() {
  setStage("workspace", 2, "edit");
  ui.hint.textContent = "Last step: press “Add captions” to burn the subtitles into your video.";
}
function goDone() {
  setStage("workspace", 4, "done");
  ui.btnWebm.hidden = st.ext !== ".webm";
  ui.hint.textContent = "Changed something? Edit the text and press “Add captions” again.";
}
function toast(msg, kind = "info", ms = 5000) {
  ui.toast.textContent = msg;
  ui.toast.className = "toast " + kind;
  ui.toast.hidden = false;
  clearTimeout(toastT);
  if (ms) toastT = setTimeout(() => (ui.toast.hidden = true), ms);
}
function setProgress(f, center, desc) {
  f = Math.min(1, Math.max(0, f || 0));
  ui.ringFg.style.strokeDashoffset = RING * (1 - f);
  ui.pct.textContent = center ?? `${(f * 100).toFixed(1)}%`;
  if (desc) ui.ldesc.textContent = desc;
  ui.bar.style.width = f * 100 + "%";
}
function showPlayerErr() {
  ui.playerErr.textContent = "Unplayable video. Press “Add captions” to repair it.";
  ui.playerErr.hidden = false;
}
function loadPreview(url) {
  const v = ui.video;
  if (v.dataset.url) URL.revokeObjectURL(v.dataset.url);
  v.dataset.url = url;
  ui.playerErr.hidden = true;
  v.onloadedmetadata = () => { st.duration = Math.round(v.duration) || 1; if (!v.videoWidth || !v.videoHeight) showPlayerErr(); };
  v.onerror = showPlayerErr;
  v.src = url;
  v.load();
}

/* ═════════════ Upload ═════════════ */
function handleFile(file) {
  ui.input.value = "";
  if (!file) return;
  if (!/\.mp4$/i.test(file.name)) return toast("Only MP4 videos can be uploaded. Use an online converter.", "err");
  if (file.size >= MAX_SIZE) return toast("This video exceeds 350MB of free plan. Use an online video compressor", "err");
  st.file = file;
  loadPreview(URL.createObjectURL(file));
  setProgress(0, "0%", `Uploading video . . .\nVideo language: ${LANGUAGES[st.lang]}`);
  setStage("loading", 1);
  send(["lang", uid, st.lang + 1].join(SEP));
  send("video_size:" + file.size);
}

function sendAndWait(data) {
  return new Promise((resolve, reject) => {
    const ws = st.ws;
    const done = (fn, v) => {
      ws.removeEventListener("message", onMsg);
      ws.removeEventListener("close", onErr);
      ws.removeEventListener("error", onErr);
      fn(v);
    };
    const onMsg = (e) => done(resolve, e.data);
    const onErr = (e) => done(reject, e);
    ws.addEventListener("message", onMsg);
    ws.addEventListener("close", onErr);
    ws.addEventListener("error", onErr);
    try { ws.send(data); } catch (e) { done(reject, e); }
  });
}

async function sendVideo() {
  const f = st.file;
  if (!f) return;
  let kb = 125, off = 0;
  try {
    while (off < f.size) {
      const end = Math.min(off + kb * 1024, f.size);
      await sendAndWait(f.slice(off, end));
      off = end;
      setProgress(off / f.size);
      kb = Math.min(kb + 10, 2000);
    }
  } catch (e) {
    console.warn("Upload interrupted", e);
  }
}

function startTranscribeTimer() {
  clearInterval(st.timer);
  const d = st.duration || 1;
  let delta = d < 62 ? 2000 : 1000, inc = 1;
  if (d > 180) { delta = 900; inc = 2; }
  if (d > 300) { delta = 500; inc = 4; }
  let p = 0;
  st.timer = setInterval(() => {
    p += inc;
    setProgress(p / d, mmss(Math.max(0, Math.floor(1 + d - p))));
    if ((p / d) * 100 >= 99) clearInterval(st.timer);
  }, delta);
}

/* ═════════════ Captions ═════════════ */
const getCaptions = () => [...ui.caps.querySelectorAll("textarea")].map((t) => t.value).join("-o-");
const resizeAll = () => ui.caps.querySelectorAll("textarea").forEach(autosize);

function renderCaptions(str) {
  const arr = str.split("-o-");
  while (arr.length && arr[arr.length - 1] === "") arr.pop();
  st.durations = st.receivedDurations || arr.map(() => 1);
  st.hl = -1;
  const g = st.captionLength < 0.9 ? 2 : 1;
  ui.caps.replaceChildren();
  for (let i = 0; i < arr.length; i += g) {
    const row = h("div", { class: "row" });
    for (let j = i; j < Math.min(i + g, arr.length); j++) {
      const ta = h("textarea", { rows: "1" });
      ta.value = arr[j];
      ta.addEventListener("input", () => autosize(ta));
      row.append(ta);
    }
    ui.caps.append(row);
  }
  requestAnimationFrame(resizeAll);
}

function cumIndex(n, list) {
  let a = 0;
  for (let i = 0; i < list.length; i++) { a += list[i]; if (a >= n) return i; }
  return -1;
}
function onTime() {
  const idx = cumIndex(Math.floor(ui.video.currentTime) + 1, st.durations || []);
  if (idx === st.hl) return;
  st.hl = idx;
  const g = st.captionLength < 0.9 ? 2 : 1;
  const tas = [...ui.caps.querySelectorAll("textarea")];
  tas.forEach((t, i) => t.classList.toggle("on", idx >= 0 && i >= idx * g && i < idx * g + g));
  const first = tas[idx * g];
  if (first) ui.caps.scrollTop = first.parentElement.offsetTop - ui.caps.clientHeight / 2 + first.offsetHeight / 2;
}

function updateTranslateOptions() {
  [...ui.translate.options].forEach((o) => (o.hidden = o.value === SOURCE_NAME[st.lang]));
}
function onTranslate() {
  const v = ui.translate.value;
  if (v === "Reset") return renderCaptions(st.captions);
  ui.translate.disabled = true;
  send(["translate", uid, getCaptions(), OUTPUT_LANGS[v]].join(SEP));
}

function fmtTime(s) {
  const ms = Math.floor(s * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
}
function downloadText(ext) {
  const phrases = getCaptions().split("-o-");
  let out;
  if (ext === ".srt") {
    const step = st.captionLength || 0.5;
    let t = 0, n = 1;
    out = phrases.map((p) => {
      const a = t;
      t += step;
      const text = p.replace(/\s*\n\s*/g, " ").trim();
      return text ? `${n++}\n${fmtTime(a)} --> ${fmtTime(t)}\n${text}` : null;
    }).filter(Boolean).join("\n\n");
  } else {
    out = phrases.join(" ");
  }
  saveBlob(new Blob(["\uFEFF" + out], { type: "application/octet-stream" }), rnd() + ext);
}

/* ═════════════ Render request ═════════════ */
function onCreate() {
  ui.btnCreate.classList.remove("pulse");
  ui.btnCreate.disabled = true;
  send("request:0");
  st.reqTimer = setTimeout(() => {
    st.reqTimer = null;
    ui.btnCreate.disabled = false;
    toast("Connection lost. Try again", "err");
  }, 5000);
}
function onAck() {
  if (!st.reqTimer) return;
  clearTimeout(st.reqTimer);
  st.reqTimer = null;
  ui.btnCreate.disabled = false;
  requestCreate();
}
function requestCreate() {
  st.captions = getCaptions();
  send(["tocreate", uid, st.captions, st.firstUrl, st.font, subtitleColor(), st.pos, st.glow, st.audio, st.paramsAI, st.videoTag].join(SEP));
  st.chunks = []; st.recv = 0; st.nSeg = 0; st.frameIdx = 0; st.ts = 0; st.fps = 10;
  st.waitingVideo = true;
  ui.playerErr.hidden = true;
  ui.video.pause();
  if (st.videoTag === "webm") {
    setStage("preview", 3);
    startLoading();
  } else {
    setProgress(0, "0%", "Rendering video . . .");
    setStage("loading", 3);
  }
}
function resetRender() {
  st.waitingVideo = false; st.frameIdx = 0; st.chunks = []; st.recv = 0; st.nSeg = 0;
  closeLoading();
}
function cancelTask() {
  ui.cancelBtn.textContent = "Canceling...";
  send("cancel_task:" + uid);
  setTimeout(() => { ui.cancelBtn.textContent = "Cancel"; resetRender(); goEdit(); }, 4000);
}
function finishRender() {
  resetRender();
  st.step = 2;
  st.blob = new Blob(st.chunksDone, { type: st.mime });
  st.mp4 = { chunks: [], recv: 0, blob: null, progress: 0 };
  loadPreview(URL.createObjectURL(st.blob));
  goDone();
  send("full_video_received_" + st.videoTag);
  toast("Video rendered successfully", "ok");
}

/* ═════════════ Binary frames from server ═════════════ */
function onBinary(buf) {
  const b = new Uint8Array(buf);
  if (b.length < 5) return;
  const first = b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24);
  const flag = (b[4] << 24) >> 24;
  if (st.waitingMp4) return onMp4(b, first, flag);
  if (st.waitingVideo && st.step > 0) onVideo(b, first, flag);
}

function onVideo(b, first, flag) {
  if (first < 0) { // final video, sent in pieces
    const total = -first;
    st.mime = flag >= 0 ? "application/octet-stream" : "video/mp4";
    st.ext = flag >= 0 ? ".webm" : ".mp4";
    if (!st.recv) ui.cancel.hidden = true;
    const p = b.subarray(5);
    st.chunks.push(p);
    st.recv += p.length;
    setProgress(st.recv / total, undefined, "Preparing video . . .");
    if (st.recv === total) { st.chunksDone = st.chunks; finishRender(); }
    return;
  }
  st.videoSecs = first;
  if (flag > 0) { // live preview frames (VP8)
    if (st.frameIdx === 0) { closeLoading(); if (first < 15) ui.cancel.hidden = true; }
    const f = st.nSeg / first;
    setProgress(f);
    if (f > 0.6) ui.cancel.hidden = true;
    feedFrames(getChunks(b.subarray(5)));
    if (st.fps < 17 && st.nSeg % 8 === 0) st.fps++;
  } else { // progress only
    setProgress(st.nSeg / first, mmss(Math.max(0, Math.floor(1 + first - st.nSeg))), "Rendering video . . .");
    if (Math.abs(st.nSeg - first) <= 2) setProgress(0, "0%");
  }
  st.nSeg++;
}

function getChunks(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out = [];
  let o = 0;
  while (o + 4 <= bytes.length) {
    const size = dv.getUint32(o, true);
    o += 4;
    if (o + size > bytes.length) throw new Error("Incomplete chunk at end of buffer");
    out.push(bytes.slice(o, o + size));
    o += size;
  }
  return out;
}

/* VP8 live preview */
function initDecoder() {
  if (!("VideoDecoder" in window)) return;
  decoder = new VideoDecoder({
    output: drawFrame,
    error: (e) => { console.error("Decoder error:", e); try { decoder.reset(); decoder.configure({ codec: "vp8" }); } catch {} },
  });
  decoder.configure({ codec: "vp8" });
}
async function detectFormat() {
  if (!decoder) return;
  if (document.createElement("video").canPlayType('video/webm; codecs="vp8"') !== "probably") return;
  try {
    const s = await VideoDecoder.isConfigSupported({ codec: "vp8" });
    if (s.supported) st.videoTag = "webm";
  } catch {}
}
function feedFrames(frames) {
  if (!decoder) return;
  decoder.reset();
  decoder.configure({ codec: "vp8" });
  const dur = 1e6 / st.fps;
  frames.forEach((data, i) => {
    decoder.decode(new EncodedVideoChunk({ type: i === 0 ? "key" : "delta", timestamp: st.ts, data }));
    st.ts += dur;
    st.frameIdx++;
  });
}
function drawFrame(f) {
  try {
    const c = ui.canvas, W = c.width, H = c.height;
    const s = Math.min(W / f.displayWidth, H / f.displayHeight);
    const dw = f.displayWidth * s, dh = f.displayHeight * s;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(f, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } catch (e) {
    console.error("Render error:", e);
  } finally {
    f.close();
  }
}
function resizeCanvas() {
  const r = ui.canvas.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  if (r.width) { ui.canvas.width = Math.round(r.width * d); ui.canvas.height = Math.round(r.height * d); }
}
function drawLoading() {
  const c = ui.canvas, W = c.width, H = c.height;
  ctx.fillStyle = "#0b0a12";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.font = `${(H * 0.085) | 0}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("Rendering . . .", W / 2, H / 2 - H * 0.1);
  ctx.fillStyle = "#7c55e6";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(W / 2 + Math.sin(tAnim + i * 0.6) * W * 0.15, H / 2 + H * 0.05, W * 0.012, 0, Math.PI * 2);
    ctx.fill();
  }
  tAnim += 0.05;
  anim = requestAnimationFrame(drawLoading);
}
function startLoading() { if (!anim) { resizeCanvas(); drawLoading(); } }
function closeLoading() {
  if (!anim) return;
  cancelAnimationFrame(anim);
  anim = 0;
  ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
}

/* ═════════════ Downloads ═════════════ */
function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = h("a", { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function downloadVideo() {
  if (!st.blob) return;
  saveBlob(st.blob, rnd() + st.ext);
  send("exported");
}
function downloadMp4() {
  if (!st.blob) return;
  if (st.ext === ".mp4") return downloadVideo();
  if (st.mp4.blob) { saveBlob(st.mp4.blob, rnd() + ".mp4"); send("exported"); return; }
  if (st.waitingMp4) return;
  st.mp4 = { chunks: [], recv: 0, blob: null, progress: 0 };
  st.waitingMp4 = true;
  mp4Progress(100);
  send("webm_to_mp4:" + st.videoSecs);
}
function mp4Progress(total) {
  st.mp4.progress++;
  ui.btnMp4.disabled = true;
  ui.btnMp4.lbl.textContent = `Converting ${Math.min(99, Math.round((st.mp4.progress / total) * 100))}%`;
}
function onMp4(b, first, flag) {
  if (first >= 0) return;
  const m = st.mp4;
  if (flag === 1) return mp4Progress(-first + 2);
  if (flag !== 2) return;
  const p = b.subarray(5);
  m.chunks.push(p);
  m.recv += p.length;
  if (m.recv !== -first) return;
  st.waitingMp4 = false;
  m.blob = new Blob(m.chunks, { type: "video/mp4" });
  m.chunks = [];
  ui.btnMp4.disabled = false;
  ui.btnMp4.lbl.textContent = "Download MP4";
  send("full_video_received_" + st.videoTag);
  saveBlob(m.blob, rnd() + ".mp4");
  send("exported");
  toast("MP4 ready. If it did not download, press Download MP4 again.", "ok");
}

/* ═════════════ Customize ═════════════ */
function modal(title, ...body) {
  const d = h("dialog", { class: "modal" },
    h("div", { class: "mb" }, h("div", { class: "mh" }, h("h3", {}, title), h("button", { class: "x", type: "button", "aria-label": "Close", onclick: () => d.close() }, "×")), ...body));
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  d.addEventListener("close", () => d.remove());
  document.body.append(d);
  d.showModal();
  return d;
}
function segmented(options, value, onChange) {
  const w = h("div", { class: "sg" });
  options.forEach((t, i) => w.append(h("button", {
    type: "button", "aria-pressed": i + 1 === value,
    onclick: () => { [...w.children].forEach((c, k) => c.setAttribute("aria-pressed", k === i)); onChange(i + 1); },
  }, t)));
  return w;
}
const field = (label, ...kids) => h("div", { class: "field" }, h("p", { class: "lbl" }, label), ...kids);

function openSettings() {
  const fonts = h("div", { class: "fonts" }, Array.from({ length: FONT_COUNT }, (_, i) => h("button", {
    type: "button", style: `font-family:font${i + 1}`, "aria-pressed": st.font === String(i + 1),
    onclick: (e) => { st.font = String(i + 1); [...fonts.children].forEach((c) => c.setAttribute("aria-pressed", c === e.currentTarget)); },
  }, `${i + 1}. Subtitle`)));

  const box = h("div", { class: "colors" }), note = h("p", { class: "note" });
  const drawColors = () => {
    box.replaceChildren();
    (st.colorMode === "mono" ? [st.mono] : st.multi).forEach((c, i) => box.append(h("input", {
      type: "color", value: c,
      oninput: (e) => { if (st.colorMode === "mono") st.mono = e.target.value; else st.multi[i] = e.target.value; },
    })));
    note.textContent = st.colorMode === "mono" ? "One single color in all subtitles" : "Colors will alternate randomly across all subtitles";
  };
  drawColors();

  modal("Customize",
    field("Text font", fonts),
    field("Text color", segmented(["Monocolor", "Multicolor"], st.colorMode === "mono" ? 1 : 2, (v) => { st.colorMode = v === 1 ? "mono" : "multi"; drawColors(); }), box, note),
    field("Position of subtitles", segmented(["Down", "Center", "Up"], st.pos, (v) => (st.pos = v))),
    field("Text glow", segmented(["Off", "Thin", "Thick"], st.glow, (v) => (st.glow = v))),
    field("Simultaneous lines", segmented(["1", "2", "3"], st.audio, (v) => (st.audio = v))),
    h("a", { class: "btn", href: LINKS.advanced, target: "_blank", rel: "noopener", "data-track": "" }, "Advanced editor"));
}

/* ═════════════ AI editor ═════════════ */
function sendAI() {
  const text = ui.aiInput.value.trim();
  if (!text) return;
  send("ai_presionado:" + text);
  st.aiPrompt = text;
  ui.aiHead.hidden = true;
  ui.aiMsg.hidden = true;
  ui.aiPrompt.textContent = "Loading...";
  ui.aiPrompt.hidden = false;
  ui.aiSend.disabled = true;
  ui.aiInput.value = "";
  ui.aiInput.style.height = "24px";
  send(["ai_option", uid, getCaptions(), text].join(SEP));
}
function aiResult(state) {
  ui.aiSend.disabled = false;
  if (state !== "ok" && state !== "error") return;
  const ok = state === "ok";
  ui.aiPrompt.hidden = !ok;
  if (ok) ui.aiPrompt.textContent = st.aiPrompt;
  else { ui.aiInput.value = st.aiPrompt; ui.aiInput.dispatchEvent(new Event("input")); }
  ui.aiMsg.className = "ai-msg " + (ok ? "ok" : "bad");
  ui.aiMsg.textContent = ok ? 'Instruction saved, press "Add captions" to continue' : "Enter an instruction related to editing the subtitles";
  ui.aiMsg.hidden = false;
}
function jsonToCustomString(json) {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("JSON must be an array of objects");
  return data.map((o) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join("%element%")).join("%json%");
}

/* ═════════════ WebSocket (protocol unchanged) ═════════════ */
function send(m) {
  if (st.ws && st.ws.readyState === WebSocket.OPEN) { st.ws.send(m); return true; }
  return false;
}

function connect(type) {
  clearTimeout(st.rcTimer);
  if (st.ws) { st.ws.onclose = null; st.ws.onmessage = null; st.ws.close(); }
  const ws = (st.ws = new WebSocket(`wss://${WS_HOST}/${uid}`));
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    st.reconnects = 0;
    st.connecting = false;
    send(`type_connection==${type}==${location.pathname}==${uid}`);
    if (st.waitingCaptions) send("check_captions");
    if (st.uploadPhase) setStage("upload", 1);
    if (type === "reconnecting") aiResult("reset");
  };

  ws.onmessage = (e) => {
    if (typeof e.data === "string") onText(e.data);
    else if (e.data instanceof ArrayBuffer) onBinary(e.data);
  };

  ws.onclose = (ev) => {
    resetRender();
    if (st.dup) return;
    if (st.waitingMp4) { st.waitingMp4 = false; ui.btnMp4.disabled = false; ui.btnMp4.lbl.textContent = "Download MP4"; }
    if (st.view === "preview" || (st.view === "loading" && !st.uploadPhase && !st.waitingCaptions)) {
      toast("Connection lost. Try again", "err");
      goEdit();
    }
    if (st.uploadPhase && !st.connecting && st.view !== "upload") {
      setStage("upload", 1);
      toast("Bad connection. Try it again", "err");
    }
    if (ev.code === 4001) return;
    if (!ev.wasClean && ++st.reconnects <= MAX_RECONNECTS) st.rcTimer = setTimeout(() => connect("reconnecting"), 5000);
  };
}

function onText(m) {
  if (m === "1") return onAck();

  const p = m.split(SEP);
  if (p[0] === "translated") {
    renderCaptions(p[1]);
    ui.translate.disabled = false;
    return;
  }
  if (p[0] === "enviar") {
    st.step = 1;
    st.waitingCaptions = false;
    st.uploadPhase = false;
    st.captions = p[2];
    st.firstUrl = "none";
    st.captionLength = parseFloat(p[4]) || 0.5;
    st.receivedDurations = p.length === 6 ? JSON.parse(p[5]) : null;
    clearInterval(st.timer);
    renderCaptions(st.captions);
    updateTranslateOptions();
    goEdit();
    send("captions_received:" + uid);
    return;
  }
  if (m.includes("intensidad_resplandor")) {
    if (m === "error:intensidad_resplandor") return aiResult("error");
    try { st.paramsAI = jsonToCustomString(m); aiResult("ok"); } catch (e) { console.error(e); aiResult("error"); }
    return;
  }
  if (m === "session_duplicated") {
    st.dup = true;
    toast("Session duplicated. Connection closed. Please reload the page.", "err", 0);
    st.ws.close(4001, "Duplicate session");
    return;
  }
  if (m === "ready_to_upload") return void sendVideo();
  if (m === "all_chunks_received") {
    st.waitingCaptions = true;
    st.uploadPhase = false;
    setProgress(0, mmss(st.duration), "Transcribing video . . .");
    startTranscribeTimer();
    return;
  }
  if (m === "check_captions_false") { st.waitingCaptions = false; return; }
  if (m.includes("wrong_file:")) {
    st.uploadPhase = true;
    ui.input.value = "";
    setStage("upload", 1);
    const msgs = { bad_connection: "Bad connection. Try it again", bad_file: "This file could not be uploaded. Try it with another file" };
    toast(msgs[m.split(":")[1]] || "Something went wrong. Try it again", "err");
  }
}

/* ═════════════ Init ═════════════ */
function init() {
  build();
  initDecoder();
  detectFormat();
  setProgress(0, "", "Connecting . . .");
  setStage("loading", 1);
  connect("connected");
}
init();




















const start_elements = [
    { id: "pages", content: "Pages" },
    { id: "videogenerator", content: "Video translator" },
    { id: "privacy_policy", content: "Privacy Policy" },
    { id: "company", content: "Company" },
    { id: "terms_conditions", content: "Terms & Conditions" },
  ];

document.addEventListener("DOMContentLoaded", function () {
 
    start_elements.forEach((item) => {
        const el = item.id
          ? document.getElementById(item.id)
          : document.querySelector(item.selector);
  
        if (el) {
          el.innerHTML = item.content;
          el.classList.add("notranslate");
        }
    });
     

  });