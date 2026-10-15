# 🦀 Rust Quest · 边玩边学 Rust 语法

一个超轻量的 Rust 语法学习小游戏：**纯静态页面**（HTML + CSS + 原生 JS，零依赖、零构建），
直接部署在 **GitHub Pages** 上就能玩。

## 玩法

- ⚔️ **闯关模式**：10 个关卡（变量与可变性 → 所有权 → 借用 → 复合类型 → 枚举与模式匹配 →
  错误处理 → 集合与迭代器 → 泛型与 Trait → 生命周期 → 智能指针与并发）。
  每关 8 道选择题，3 颗 ❤️，答对 6 题通关并解锁下一关。
- 🎯 **自由练习**：随机 10 题刷 XP，不掉 ❤️。
- ⌨️ **代码挑战**：补全代码中的 `___`，提交即时判定，考的是真·语法手感。
- 每道题都有**中文解析** —— 答错了也能学到东西。
- XP、等级称号（铁锈学徒 → 锈蚀宗师）、连击加成，进度保存在浏览器 localStorage。

## 本地运行

```bash
cd rust-quest
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

直接用浏览器打开 `index.html` 也能玩（file:// 协议下 localStorage 可能受限，建议用上面的方式）。

## 部署到 GitHub Pages

1. 在 GitHub 新建**公开**仓库（例如 `rust-quest`），把本目录所有文件推到 `main` 分支根目录。
2. 仓库 → Settings → Pages → Source 选择 **Deploy from a branch**，
   Branch 选 `main` / `(root)`，点 Save。
3. 等 1～2 分钟，访问 `https://<你的用户名>.github.io/rust-quest/` 即可游玩。

## 加题

- 选择题：编辑 `js/questions.js`，往 `QUESTIONS` 数组追加，格式见文件内示例
 （`id` / `level` 1-10 / `topic` / `q` / `code`(可选) / `options`(4个) / `answer`(下标) / `explain`）。
- 代码填空：编辑 `js/challenges.js`，往 `CODE_CHALLENGES` 追加，
  用 `___` 标记填空位，`blanks` 按顺序给出可接受答案和提示。

注意：题目里的 Rust 代码请保证能通过编译（edition 2021），答案务必准确 —— 这是学习工具。

## License

MIT
