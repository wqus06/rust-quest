"use strict";
/* ============================================================
 * Rust Quest · 新模式引擎
 * ① 内存剧场 ② 编译器找茬 ③ 代码排序 ④ 生命周期时间线
 * 依赖 app.js 的全局：LEVELS, $, esc, shuffle, highlightRust,
 * showScreen, save, persist, addXp, levelName
 * 数据：js/theater.js (THEATER), js/bugs.js (BUGS),
 *       js/order.js (ORDERS), js/lifelines.js (LIFELINES)
 * ============================================================ */

/* ---------- 通用 ---------- */
function renderCodeLines(el, code, curLine, onClick) {
  el.innerHTML = "";
  code.forEach((ln, i) => {
    const d = document.createElement("div");
    d.className = "cline" + (i === curLine ? " cur" : "");
    d.innerHTML = '<span class="ln">' + (i + 1) + "</span><code>" + highlightRust(ln) + "</code>";
    if (onClick) d.addEventListener("click", () => onClick(i, d));
    el.appendChild(d);
  });
}
function modeLevelTag(el, sc) {
  el.textContent = "第 " + sc.level + " 关 · " + levelName(sc.level);
}
/* 按关卡分组的列表（复用挑战列表样式） */
function renderModeList(listId, data, doneMap, startFn, descOf) {
  const wrap = $(listId);
  wrap.innerHTML = "";
  LEVELS.forEach(l => {
    const items = data.filter(c => c.level === l.n);
    if (!items.length) return;
    const g = document.createElement("div");
    g.className = "ch-group";
    const doneCount = items.filter(c => (doneMap || {})[c.id]).length;
    g.innerHTML = "<h3>" + l.icon + " 第 " + l.n + " 关 · " + esc(l.name) +
      ' <span class="muted">(' + doneCount + "/" + items.length + ")</span></h3>";
    items.forEach(c => {
      const it = document.createElement("div");
      it.className = "ch-item";
      const d = descOf ? descOf(c) : (c.desc || c.hint || "");
      it.innerHTML = '<div><div class="ch-title">' + esc(c.title) + "</div>" +
        (d ? '<div class="ch-desc">' + esc(d) + "</div>" : "") + '</div><div class="ch-done">' +
        ((doneMap || {})[c.id] ? "✅ 已完成" : "开始 →") + "</div>";
      it.addEventListener("click", () => startFn(c.id));
      g.appendChild(it);
    });
    wrap.appendChild(g);
  });
}

/* ============================================================
 * ① 内存剧场：单步执行，看栈/堆变化
 * ============================================================ */
let th = null;
const MEM_STATUS = {
  ok:     ["st-ok", ""],
  moved:  ["st-moved", "❌ 已失效"],
  ref:    ["st-ref", ""],
  refmut: ["st-refmut", ""],
  ended:  ["st-ended", "✓ 借用结束"]
};

function renderTheaterList() {
  if (typeof THEATER === "undefined") { alert("剧场数据尚未加载。"); return; }
  renderModeList("theater-groups", THEATER, save.theaterDone, startTheater, c => c.desc);
  showScreen("screen-theater-list");
}
function startTheater(id) {
  const sc = THEATER.find(t => t.id === id);
  if (!sc) return;
  thStopAuto();
  th = { sc, idx: 0, timer: null };
  modeLevelTag($("th-topic"), sc);
  $("th-title").textContent = sc.title;
  thRender();
  showScreen("screen-theater");
}
function thRender() {
  const sc = th.sc, st = sc.steps[th.idx], last = th.idx === sc.steps.length - 1;
  renderCodeLines($("th-code"), sc.code, st.line);
  $("th-progress").textContent = "步骤 " + (th.idx + 1) + " / " + sc.steps.length;
  const sk = $("th-stack");
  sk.innerHTML = "";
  st.stack.forEach(v => {
    const m = MEM_STATUS[v.status] || MEM_STATUS.ok;
    const d = document.createElement("div");
    d.className = "mem-var " + m[0];
    d.innerHTML = "<b>" + esc(v.name) + "</b><span>" + esc(v.detail) + (m[1] ? " · " + m[1] : "") + "</span>";
    sk.appendChild(d);
  });
  const hp = $("th-heap");
  hp.innerHTML = "";
  if (st.heap && st.heap.length) {
    st.heap.forEach(h => {
      const d = document.createElement("div");
      d.className = "mem-heap" + (h.status === "moved" ? " st-moved" : "");
      d.innerHTML = "<b>" + esc(h.label) + "</b><span>owner: " + esc(h.owner) + "</span>";
      hp.appendChild(d);
    });
  } else {
    hp.innerHTML = '<div class="mem-empty">（空）</div>';
  }
  const note = $("th-note");
  note.className = "explain";
  note.innerHTML = "💡 " + esc(st.note);
  if (last && !save.theaterDone[sc.id]) {
    save.theaterDone[sc.id] = true;
    addXp(20);
    note.innerHTML += ' <span class="xp-gain">+20 XP</span>';
  } else {
    persist();
  }
  note.style.display = "block";
  $("th-prev").disabled = th.idx === 0;
  $("th-next").textContent = last ? "完成 ✓" : "下一步 ▶";
}
function thStopAuto() {
  if (th && th.timer) {
    clearInterval(th.timer);
    th.timer = null;
    const b = $("th-auto");
    if (b) b.textContent = "▶ 自动播放";
  }
}

/* ============================================================
 * ② 编译器找茬：点出编译失败的代码行
 * ============================================================ */
let bug = null;
function renderBugList() {
  if (typeof BUGS === "undefined") { alert("找茬数据尚未加载。"); return; }
  renderModeList("bugs-groups", BUGS, save.bugsDone, startBug, c => "这段代码编译不过，问题出在哪几行？");
  showScreen("screen-bugs-list");
}
function startBug(id) {
  const sc = BUGS.find(b => b.id === id);
  if (!sc) return;
  bug = { sc, sel: new Set(), done: false, hintUsed: false };
  modeLevelTag($("bug-topic"), sc);
  $("bug-title").textContent = sc.title;
  renderCodeLines($("bug-code"), sc.code, -1, (i, d) => {
    if (bug.done) return;
    if (bug.sel.has(i)) { bug.sel.delete(i); d.classList.remove("sel"); }
    else { bug.sel.add(i); d.classList.add("sel"); }
  });
  $("bug-code").classList.add("clickable");
  const fb = $("bug-feedback");
  fb.style.display = "none";
  $("bug-submit").style.display = "";
  showScreen("screen-bug");
}
function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}
function bugSubmit() {
  if (!bug || bug.done) return;
  const sc = bug.sc, fb = $("bug-feedback");
  if (bug.sel.size === 0) {
    fb.className = "explain";
    fb.innerHTML = "👆 先点击你认为有问题的代码行（可多选）。";
    fb.style.display = "block";
    return;
  }
  const lines = $("bug-code").children;
  if (setsEqual(bug.sel, new Set(sc.bugLines))) {
    bug.done = true;
    sc.bugLines.forEach(i => { lines[i].classList.remove("sel"); lines[i].classList.add("hit"); });
    const firstTime = !save.bugsDone[sc.id];
    const gain = firstTime ? (bug.hintUsed ? 8 : 15) : 0;
    if (firstTime) { save.bugsDone[sc.id] = true; if (gain) addXp(gain); }
    else persist();
    fb.className = "explain good";
    fb.innerHTML = "<b>🎯 找对了！</b>" +
      (gain ? ' <span class="xp-gain">+' + gain + " XP</span>" : ' <span class="muted">（已完成过）</span>') +
      '<div class="rustc">' + esc(sc.rustc) + "</div>" +
      "<b>🔧 修复：</b>" + esc(sc.fix) +
      "<br><b>📖 讲解：</b>" + esc(sc.explain);
    fb.style.display = "block";
    $("bug-submit").style.display = "none";
  } else {
    bug.hintUsed = true;
    fb.className = "explain bad";
    fb.innerHTML = "<b>❌ 不是这几行，再想想。</b><br>💡 提示：" + esc(sc.hint) +
      ' <span class="muted">（已用提示，奖励降为 +8 XP）</span>';
    fb.style.display = "block";
    bug.sel.forEach(i => {
      lines[i].classList.add("shake");
      setTimeout(() => lines[i].classList.remove("shake"), 500);
    });
  }
}
function bugHint() {
  if (!bug || bug.done) return;
  bug.hintUsed = true;
  const fb = $("bug-feedback");
  fb.className = "explain";
  fb.innerHTML = "💡 提示：" + esc(bug.sc.hint) + ' <span class="muted">（使用提示后奖励降为 +8 XP）</span>';
  fb.style.display = "block";
}

/* ============================================================
 * ③ 代码排序：点击把打乱的代码排回正确顺序
 * ============================================================ */
let ord = null;
function renderOrderList() {
  if (typeof ORDERS === "undefined") { alert("排序数据尚未加载。"); return; }
  renderModeList("order-groups", ORDERS, save.orderDone, startOrder, c => c.hint);
  showScreen("screen-order-list");
}
function startOrder(id) {
  const sc = ORDERS.find(o => o.id === id);
  if (!sc) return;
  ord = { sc, pool: shuffle(sc.lines.map(t => ({ t }))), answer: [], tried: false, done: false };
  $("ord-title").textContent = sc.title;
  modeLevelTag($("ord-topic"), sc);
  $("ord-hint").textContent = "💡 " + sc.hint;
  ordRender();
  const fb = $("ord-feedback");
  fb.style.display = "none";
  $("ord-submit").style.display = "";
  showScreen("screen-order");
}
function ordRender() {
  const pool = $("ord-pool");
  pool.innerHTML = "";
  ord.pool.forEach(it => {
    const d = document.createElement("div");
    d.className = "ord-item";
    d.innerHTML = "<code>" + highlightRust(it.t) + "</code>";
    d.addEventListener("click", () => {
      if (ord.done) return;
      ord.pool.splice(ord.pool.indexOf(it), 1);
      ord.answer.push(it);
      ordRender();
    });
    pool.appendChild(d);
  });
  const ans = $("ord-answer");
  ans.innerHTML = "";
  if (!ord.answer.length) ans.innerHTML = '<div class="ord-empty">点击左侧代码块，按正确顺序排到这里</div>';
  ord.answer.forEach(it => {
    const d = document.createElement("div");
    d.className = "ord-item" + (it.mark ? " " + it.mark : "");
    d.innerHTML = "<code>" + highlightRust(it.t) + "</code>";
    d.addEventListener("click", () => {
      if (ord.done) return;
      delete it.mark;
      ord.answer.splice(ord.answer.indexOf(it), 1);
      ord.pool.push(it);
      ordRender();
    });
    ans.appendChild(d);
  });
}
function ordSubmit() {
  if (!ord || ord.done) return;
  const fb = $("ord-feedback");
  if (ord.answer.length !== ord.sc.lines.length) {
    fb.className = "explain";
    fb.innerHTML = "👆 先把所有代码块都排好再提交。";
    fb.style.display = "block";
    return;
  }
  let allOk = true;
  ord.answer.forEach((it, i) => {
    const ok = it.t === ord.sc.lines[i];
    it.mark = ok ? "ok" : "bad";
    if (!ok) allOk = false;
  });
  const firstTime = !save.orderDone[ord.sc.id];
  let gain = 0;
  if (allOk) {
    ord.done = true;
    gain = firstTime ? (ord.tried ? 10 : 20) : 0;
    if (firstTime) { save.orderDone[ord.sc.id] = true; if (gain) addXp(gain); }
    else persist();
  }
  ord.tried = true;
  ordRender();
  fb.className = "explain " + (allOk ? "good" : "bad");
  fb.innerHTML = allOk
    ? "<b>🎉 顺序正确！</b>" + (gain ? ' <span class="xp-gain">+' + gain + " XP</span>" : ' <span class="muted">（已完成过）</span>')
    : "<b>❌ 有几行位置不对</b>（红色）。点击它们可以送回左侧重排。";
  fb.style.display = "block";
  if (allOk) $("ord-submit").style.display = "none";
}

/* ============================================================
 * ④ 生命周期时间线：看懂引用/变量的存活区间
 * ============================================================ */
let lf = null;
function renderLifeList() {
  if (typeof LIFELINES === "undefined") { alert("时间线数据尚未加载。"); return; }
  renderModeList("life-groups", LIFELINES, save.lifeDone, startLife,
    () => "单步执行，看每个变量和引用在何时'活着'。");
  showScreen("screen-life-list");
}
function startLife(id) {
  const sc = LIFELINES.find(l => l.id === id);
  if (!sc) return;
  lf = { sc, idx: 0 };
  modeLevelTag($("lf-topic"), sc);
  $("lf-title").textContent = sc.title;
  lfRender();
  showScreen("screen-life");
}
function lfRender() {
  const sc = lf.sc, n = sc.code.length, last = lf.idx === n - 1;
  renderCodeLines($("lf-code"), sc.code, lf.idx);
  $("lf-progress").textContent = "第 " + (lf.idx + 1) + " / " + n + " 行";
  const wrap = $("lf-bars");
  wrap.innerHTML = "";
  sc.bars.forEach(b => {
    const alive = lf.idx >= b.from && lf.idx <= b.to;
    const row = document.createElement("div");
    row.className = "lf-row";
    row.innerHTML = '<div class="lf-label">' + esc(b.label) + "</div>" +
      '<div class="lf-track"><div class="lf-bar kind-' + b.kind + (b.bad ? " bad" : "") + (alive ? " alive" : "") +
      '" style="left:' + (b.from / n * 100).toFixed(1) + "%;width:" + ((b.to - b.from + 1) / n * 100).toFixed(1) + '%"></div></div>';
    wrap.appendChild(row);
  });
  const note = (sc.notes && sc.notes[String(lf.idx)]) || "——";
  const fb = $("lf-note");
  fb.className = "explain";
  fb.style.display = "block";
  if (last) {
    let html = "💡 " + esc(note) + "<br><br>📖 " + esc(sc.explain);
    if (!save.lifeDone[sc.id]) {
      save.lifeDone[sc.id] = true;
      addXp(15);
      html += ' <span class="xp-gain">+15 XP</span>';
    } else persist();
    fb.innerHTML = html;
  } else {
    fb.innerHTML = "💡 " + esc(note);
  }
  $("lf-prev").disabled = lf.idx === 0;
  $("lf-next").textContent = last ? "完成 ✓" : "下一行 ▶";
}
function lfNext() {
  if (lf.idx >= lf.sc.code.length - 1) { renderLifeList(); return; }
  lf.idx++;
  lfRender();
}

/* ---------- 初始化 ---------- */
function initModes() {
  $("btn-mode-theater").addEventListener("click", renderTheaterList);
  $("btn-mode-bugs").addEventListener("click", renderBugList);
  $("btn-mode-order").addEventListener("click", renderOrderList);
  $("btn-mode-life").addEventListener("click", renderLifeList);
  // 剧场
  $("th-prev").addEventListener("click", () => { if (!th) return; thStopAuto(); if (th.idx > 0) { th.idx--; thRender(); } });
  $("th-next").addEventListener("click", () => {
    if (!th) return; thStopAuto();
    if (th.idx >= th.sc.steps.length - 1) { renderTheaterList(); return; }
    th.idx++; thRender();
  });
  $("th-restart").addEventListener("click", () => { if (!th) return; thStopAuto(); th.idx = 0; thRender(); });
  $("th-auto").addEventListener("click", () => {
    if (!th) return;
    if (th.timer) { thStopAuto(); return; }
    $("th-auto").textContent = "⏸ 暂停";
    th.timer = setInterval(() => {
      if (!th || th.idx >= th.sc.steps.length - 1) { thStopAuto(); return; }
      th.idx++; thRender();
    }, 1700);
  });
  $("th-back").addEventListener("click", () => { thStopAuto(); renderTheaterList(); });
  // 找茬
  $("bug-submit").addEventListener("click", bugSubmit);
  $("bug-hint").addEventListener("click", bugHint);
  $("bug-back").addEventListener("click", renderBugList);
  // 排序
  $("ord-submit").addEventListener("click", ordSubmit);
  $("ord-back").addEventListener("click", renderOrderList);
  // 时间线
  $("lf-prev").addEventListener("click", () => { if (lf && lf.idx > 0) { lf.idx--; lfRender(); } });
  $("lf-next").addEventListener("click", () => { if (lf) lfNext(); });
  $("lf-back").addEventListener("click", renderLifeList);
}
document.addEventListener("DOMContentLoaded", initModes);
