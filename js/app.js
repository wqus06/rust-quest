"use strict";
/* ============================================================
 * Rust Quest · 游戏引擎
 * 纯静态、无依赖。题库来自 js/questions.js (QUESTIONS)，
 * 代码挑战来自 js/challenges.js (CODE_CHALLENGES)。
 * ============================================================ */

const LEVELS = [
  { n: 1,  icon: "📦", name: "变量与可变性" },
  { n: 2,  icon: "🔑", name: "所有权" },
  { n: 3,  icon: "🔗", name: "借用与引用" },
  { n: 4,  icon: "🧱", name: "复合类型" },
  { n: 5,  icon: "🎭", name: "枚举与模式匹配" },
  { n: 6,  icon: "⚠️", name: "错误处理" },
  { n: 7,  icon: "🗂️", name: "集合与迭代器" },
  { n: 8,  icon: "🧬", name: "泛型与 Trait" },
  { n: 9,  icon: "⏳", name: "生命周期" },
  { n: 10, icon: "🧠", name: "智能指针与并发" },
];

const RANKS = [
  [0, "铁锈学徒"], [150, "青铜学徒"], [400, "白银工匠"], [800, "黄金工匠"],
  [1300, "铂金大师"], [2000, "钻石大师"], [3000, "锈蚀宗师"],
];

const SAVE_KEY = "rustQuestSaveV1";
const PASS_SCORE = 6;   // 闯关：8 题中答对 6 题通关
const LEVEL_Q_COUNT = 8;
const PRACTICE_Q_COUNT = 10;

/* ---------------- 存档 ---------------- */
function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && typeof s === "object") return Object.assign(defaultSave(), s);
  } catch (e) { /* 忽略损坏的存档 */ }
  return defaultSave();
}
function defaultSave() {
  return { xp: 0, unlocked: 1, passed: {}, best: {}, challengesDone: {}, totalAnswered: 0, totalCorrect: 0 };
}
let save = loadSave();
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
}
function addXp(n) { save.xp += n; persist(); updateHud(); }
function rankOf(xp) {
  let idx = 0;
  RANKS.forEach(([need], i) => { if (xp >= need) idx = i; });
  return { lv: idx + 1, name: RANKS[idx][1] };
}

/* ---------------- 工具 ---------------- */
function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/* 轻量 Rust 语法高亮（先分词再转义，避免转义后干扰匹配） */
function highlightRust(src) {
  const kw = "let|mut|const|static|fn|struct|enum|impl|trait|for|in|if|else|match|while|loop|return|use|pub|mod|where|type|as|ref|move|unsafe|extern|crate|self|Self|true|false|break|continue|dyn|async|await";
  const re = new RegExp(
    "(\\/\\/[^\\n]*)" +              // 1 注释
    '|("(?:[^"\\\\\\n]|\\\\.)*")' +  // 2 字符串
    "|('(?:[a-zA-Z_][a-zA-Z0-9_]*))" + // 3 lifetime
    "|\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b" + // 4 数字
    "|\\b(" + kw + ")\\b" +          // 5 关键字
    "|\\b([A-Za-z_][A-Za-z0-9_]*)(!)", // 6,7 宏
    "g"
  );
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    let cls = null;
    if (m[1]) cls = "tok-com";
    else if (m[2]) cls = "tok-str";
    else if (m[3]) cls = "tok-life";
    else if (m[4]) cls = "tok-num";
    else if (m[5]) cls = "tok-kw";
    else if (m[6]) cls = "tok-macro";
    out += cls ? '<span class="' + cls + '">' + esc(m[0]) + "</span>" : esc(m[0]);
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
}
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo(0, 0);
}
function updateHud() {
  const r = rankOf(save.xp);
  $("hud-rank").textContent = "Lv." + r.lv + " " + r.name;
  $("hud-xp").textContent = "✨ " + save.xp + " XP";
}
function levelName(n) {
  const l = LEVELS.find(l => l.n === n);
  return l ? l.icon + " " + l.name : "";
}

/* ---------------- 首页 ---------------- */
function renderHome() {
  const passedCount = Object.keys(save.passed).length;
  const doneCh = Object.keys(save.challengesDone).length;
  const totalCh = (typeof CODE_CHALLENGES !== "undefined") ? CODE_CHALLENGES.length : 0;
  const rate = save.totalAnswered ? Math.round(save.totalCorrect / save.totalAnswered * 100) : 0;
  $("home-stats").innerHTML =
    statHtml(passedCount + " / 10", "闯关通关") +
    statHtml(doneCh + " / " + totalCh, "代码挑战") +
    statHtml(rate + "%", "答题正确率");
  updateHud();
}
function statHtml(b, s) {
  return '<div class="stat"><b>' + esc(String(b)) + "</b><span>" + esc(s) + "</span></div>";
}

/* ---------------- 选关 ---------------- */
function renderLevels() {
  const grid = $("level-grid");
  grid.innerHTML = "";
  LEVELS.forEach(l => {
    const locked = l.n > save.unlocked;
    const done = !!save.passed[l.n];
    const card = document.createElement("div");
    card.className = "level-card" + (locked ? " locked" : "") + (done ? " done" : "");
    const badge = locked ? "🔒" : (done ? "✅ 已通关" : "▶️ 挑战");
    const best = save.best[l.n];
    card.innerHTML =
      '<span class="lv-badge">' + badge + "</span>" +
      '<div class="lv-icon">' + l.icon + "</div>" +
      '<div class="lv-name">第 ' + l.n + " 关 · " + esc(l.name) + "</div>" +
      '<div class="lv-sub">' + (best ? ("最佳 " + best.correct + "/" + best.total) : (locked ? "通关上一关解锁" : "8 道题 · 3 ❤️ · 答对 6 题通关")) + "</div>";
    if (!locked) card.addEventListener("click", () => startQuiz("level", l.n));
    grid.appendChild(card);
  });
  showScreen("screen-levels");
}

/* ---------------- 答题引擎 ---------------- */
let quiz = null;

function startQuiz(mode, level) {
  if (typeof QUESTIONS === "undefined" || !QUESTIONS.length) {
    alert("题库尚未加载，请稍后再试。");
    return;
  }
  const bank = mode === "level" ? QUESTIONS.filter(q => q.level === level) : QUESTIONS.slice();
  if (!bank.length) { alert("这一关还没有题目。"); return; }
  const count = mode === "level" ? LEVEL_Q_COUNT : PRACTICE_Q_COUNT;
  quiz = {
    mode, level,
    qs: shuffle(bank.map(q => Object.assign({}, q, { order: shuffle([0, 1, 2, 3]) })))
      .slice(0, Math.min(count, bank.length)),
    idx: 0, correct: 0, hearts: 3, streak: 0, xp: 0, locked: false,
  };
  renderQuestion();
  showScreen("screen-quiz");
}

function renderQuestion() {
  const q = quiz.qs[quiz.idx];
  quiz.locked = false;
  $("quiz-topic").textContent = (quiz.mode === "level" ? "第 " + quiz.level + " 关 · " : "") + q.topic;
  $("quiz-progress").textContent = "第 " + (quiz.idx + 1) + " / " + quiz.qs.length + " 题";
  $("quiz-hearts").textContent = quiz.mode === "level" ? "❤️".repeat(quiz.hearts) + "🤍".repeat(3 - quiz.hearts) : "";
  $("quiz-streak").textContent = quiz.streak >= 2 ? "🔥 x" + quiz.streak : "";
  $("quiz-bar").style.width = (quiz.idx / quiz.qs.length * 100) + "%";
  $("quiz-q").textContent = q.q;
  if (q.code) {
    $("quiz-code").style.display = "block";
    $("quiz-code-inner").innerHTML = highlightRust(q.code);
  } else {
    $("quiz-code").style.display = "none";
  }
  const box = $("quiz-options");
  box.innerHTML = "";
  const keys = ["A", "B", "C", "D"];
  q.order.forEach((origIdx, pos) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.innerHTML = '<span class="key">' + keys[pos] + "</span>" + esc(q.options[origIdx]);
    b.addEventListener("click", () => answerQuiz(pos));
    box.appendChild(b);
  });
  $("quiz-explain").style.display = "none";
  $("quiz-next").style.display = "none";
}

function answerQuiz(pos) {
  if (!quiz || quiz.locked) return;
  quiz.locked = true;
  const q = quiz.qs[quiz.idx];
  const correctPos = q.order.indexOf(q.answer);
  const ok = pos === correctPos;
  save.totalAnswered++;
  const btns = $("quiz-options").children;
  btns[correctPos].classList.add("correct");
  if (ok) {
    quiz.correct++; quiz.streak++; save.totalCorrect++;
    const gain = quiz.streak >= 3 ? 15 : 10;
    quiz.xp += gain;
    addXp(gain);
    showExplain(true, "回答正确！" + (quiz.streak >= 3 ? " 🔥 连击加成" : ""), "+" + gain + " XP", q.explain);
  } else {
    btns[pos].classList.add("wrong");
    quiz.streak = 0;
    if (quiz.mode === "level") quiz.hearts--;
    showExplain(false, "答错了，别灰心 —— 看看解析", "+0 XP", q.explain);
  }
  for (const b of btns) b.disabled = true;
  $("quiz-hearts").textContent = quiz.mode === "level" ? "❤️".repeat(quiz.hearts) + "🤍".repeat(3 - quiz.hearts) : "";
  $("quiz-streak").textContent = quiz.streak >= 2 ? "🔥 x" + quiz.streak : "";
  const last = quiz.idx === quiz.qs.length - 1;
  const dead = quiz.mode === "level" && quiz.hearts <= 0;
  $("quiz-next").textContent = (last || dead) ? "查看结果 →" : "下一题 →";
  $("quiz-next").style.display = "block";
  persist();
}

function showExplain(ok, title, xpText, body) {
  const el = $("quiz-explain");
  el.className = "explain " + (ok ? "good" : "bad");
  el.innerHTML = "<b>" + esc(title) + '</b> <span class="xp-gain">' + esc(xpText) + "</span><br>" + esc(body);
  el.style.display = "block";
}

function nextQuiz() {
  if (quiz.mode === "level" && quiz.hearts <= 0) return endQuiz(false, "hearts");
  if (quiz.idx >= quiz.qs.length - 1) {
    const passed = quiz.mode === "practice" ? true : quiz.correct >= PASS_SCORE;
    return endQuiz(passed, "done");
  }
  quiz.idx++;
  renderQuestion();
}

function endQuiz(passed, reason) {
  const total = quiz.qs.length;
  let bonus = 0;
  if (quiz.mode === "level" && passed) {
    bonus = 50;
    quiz.xp += bonus;
    addXp(bonus);
    save.passed[quiz.level] = true;
    const prev = save.best[quiz.level];
    if (!prev || quiz.correct > prev.correct) save.best[quiz.level] = { correct: quiz.correct, total };
    save.unlocked = Math.max(save.unlocked, Math.min(10, quiz.level + 1));
    persist();
  }
  $("quiz-bar").style.width = "100%";
  const emoji = quiz.mode === "practice" ? "🎯" : (passed ? "🏆" : "💔");
  let title, desc;
  if (quiz.mode === "practice") {
    title = "练习完成！";
    desc = "自由练习不计通关，XP 照拿。";
  } else if (reason === "hearts") {
    title = "❤️ 耗尽，挑战失败";
    desc = "第 " + quiz.level + " 关 · " + levelName(quiz.level) + " —— 再接再厉！";
  } else if (passed) {
    title = "🏆 通关！";
    desc = "第 " + quiz.level + " 关 · " + levelName(quiz.level) +
      (quiz.level < 10 ? " —— 第 " + (quiz.level + 1) + " 关已解锁！" : " —— 全部 10 关制霸！🦀");
  } else {
    title = "差一点！";
    desc = "第 " + quiz.level + " 关需要答对 " + PASS_SCORE + " 题才能通关，再试一次吧。";
  }
  $("result-emoji").textContent = emoji;
  $("result-title").textContent = title;
  $("result-desc").textContent = desc;
  $("result-stats").innerHTML =
    statHtml(quiz.correct + " / " + total, "答对") +
    statHtml("+" + quiz.xp + (bonus ? "（含通关 +" + bonus + "）" : ""), "获得 XP") +
    statHtml(save.xp, "总 XP");
  $("result-retry").onclick = () => startQuiz(quiz.mode, quiz.level);
  $("result-levels").style.display = quiz.mode === "level" ? "" : "none";
  showScreen("screen-result");
}

/* ---------------- 代码挑战 ---------------- */
let challenge = null;

function renderChallengeList() {
  if (typeof CODE_CHALLENGES === "undefined") { alert("挑战题库尚未加载。"); return; }
  const wrap = $("challenge-groups");
  wrap.innerHTML = "";
  LEVELS.forEach(l => {
    const items = CODE_CHALLENGES.filter(c => c.level === l.n);
    if (!items.length) return;
    const g = document.createElement("div");
    g.className = "ch-group";
    const doneCount = items.filter(c => save.challengesDone[c.id]).length;
    g.innerHTML = "<h3>" + l.icon + " 第 " + l.n + " 关 · " + esc(l.name) +
      ' <span class="muted">(' + doneCount + "/" + items.length + ")</span></h3>";
    items.forEach(c => {
      const it = document.createElement("div");
      it.className = "ch-item";
      it.innerHTML = '<div><div class="ch-title">' + esc(c.title) + '</div><div class="ch-desc">' +
        esc(c.desc) + '</div></div><div class="ch-done">' +
        (save.challengesDone[c.id] ? "✅ 已完成" : "开始 →") + "</div>";
      it.addEventListener("click", () => startChallenge(c.id));
      g.appendChild(it);
    });
    wrap.appendChild(g);
  });
  showScreen("screen-challenges");
}

function startChallenge(id) {
  challenge = CODE_CHALLENGES.find(c => c.id === id);
  if (!challenge) return;
  challenge._tried = false;
  $("code-topic").textContent = "第 " + challenge.level + " 关 · " + levelName(challenge.level);
  $("code-title").textContent = challenge.title;
  $("code-desc").textContent = challenge.desc;
  const area = $("code-area");
  area.innerHTML = "";
  const parts = challenge.template.split("___");
  const inputs = [];
  parts.forEach((part, i) => {
    const span = document.createElement("span");
    span.innerHTML = highlightRust(part);
    area.appendChild(span);
    if (i < parts.length - 1) {
      const inp = document.createElement("input");
      inp.className = "blank";
      inp.setAttribute("spellcheck", "false");
      inp.setAttribute("autocomplete", "off");
      const longest = Math.max.apply(null, challenge.blanks[i].answers.map(a => a.length));
      inp.style.width = Math.max(60, longest * 9 + 24) + "px";
      inp.placeholder = "___";
      inputs.push(inp);
      area.appendChild(inp);
    }
  });
  challenge._inputs = inputs;
  $("code-feedback").style.display = "none";
  $("code-submit").style.display = "";
  $("code-retry").style.display = "none";
  showScreen("screen-code");
  if (inputs[0]) inputs[0].focus();
}

function norm(s) { return String(s).trim().replace(/\s+/g, " "); }

function submitChallenge() {
  if (!challenge || challenge._tried) return;
  challenge._tried = true;
  const fb = $("code-feedback");
  let correctCount = 0;
  let html = "";
  challenge.blanks.forEach((b, i) => {
    const inp = challenge._inputs[i];
    const val = norm(inp.value);
    const ok = b.answers.some(a => norm(a) === val);
    inp.classList.remove("ok", "bad");
    inp.classList.add(ok ? "ok" : "bad");
    inp.disabled = true;
    if (ok) {
      correctCount++;
      html += '<div class="fb-line">✅ 第 ' + (i + 1) + " 空正确</div>";
    } else {
      html += '<div class="fb-line">❌ 第 ' + (i + 1) + " 空不对 —— 💡 " + esc(b.hint) + "</div>";
    }
  });
  const allOk = correctCount === challenge.blanks.length;
  const already = !!save.challengesDone[challenge.id];
  let gain = 0;
  if (!already) {
    if (allOk) {
      gain = challenge.blanks.length * 10 + 20;
      save.challengesDone[challenge.id] = true;
    } else {
      gain = correctCount * 5;
    }
    if (gain > 0) addXp(gain); else persist();
  } else persist();
  fb.className = "explain " + (allOk ? "good" : "bad");
  fb.innerHTML = "<b>" + (allOk ? (already ? "全部正确！（已完成过，不再加 XP）" : "🎉 完美通关！") : "再想想 —— 讲解看下面") +
    '</b> <span class="xp-gain">' + (gain > 0 ? "+" + gain + " XP" : "+0 XP") + "</span><br>" +
    html + "<br>📖 " + esc(challenge.explain);
  fb.style.display = "block";
  $("code-submit").style.display = "none";
  $("code-retry").style.display = allOk ? "none" : "";
}

/* ---------------- 初始化 ---------------- */
function init() {
  updateHud();
  renderHome();
  $("btn-home").addEventListener("click", () => { renderHome(); showScreen("screen-home"); });
  $("btn-mode-levels").addEventListener("click", renderLevels);
  $("btn-mode-practice").addEventListener("click", () => startQuiz("practice", 0));
  $("btn-mode-code").addEventListener("click", renderChallengeList);
  $("quiz-next").addEventListener("click", nextQuiz);
  $("code-submit").addEventListener("click", submitChallenge);
  $("code-retry").addEventListener("click", () => startChallenge(challenge.id));
  $("code-back").addEventListener("click", renderChallengeList);
  $("result-home").addEventListener("click", () => { renderHome(); showScreen("screen-home"); });
  $("result-levels").addEventListener("click", renderLevels);
  $("btn-reset").addEventListener("click", () => {
    if (confirm("确定要清空所有进度（XP、通关记录）吗？")) {
      localStorage.removeItem(SAVE_KEY);
      save = defaultSave();
      renderHome();
      showScreen("screen-home");
    }
  });
  // 键盘 1-4 快捷答题
  document.addEventListener("keydown", e => {
    if (!$("screen-quiz").classList.contains("active") || !quiz || quiz.locked) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) answerQuiz(n - 1);
    if (e.key === "Enter" && $("quiz-next").style.display !== "none") nextQuiz();
  });
  showScreen("screen-home");
}

document.addEventListener("DOMContentLoaded", init);
