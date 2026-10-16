/* ============================================================
 * Rust Quest · 编译器找茬模式题库
 * 玩法：展示一段编译失败的代码，玩家点击有问题的行，
 * 提交后展示仿 rustc 报错、修复方法与讲解。
 * 约定：code 必须真的编译失败；bugLines 是 rustc 会指向的行
 * （0-based），必须是已存在的行上的问题（不是缺行）。
 * ============================================================ */
const BUGS = [
  {
    id: "B1",
    level: 3,
    title: "借用检查器发火了",
    code: [
      "fn main() {",
      "    let mut s = String::from(\"hi\");",
      "    let r = &s;",
      "    s.push_str(\"!\");",
      "    println!(\"{}\", r);",
      "}"
    ],
    bugLines: [3],
    hint: "r 还活着的时候，能动 s 吗？",
    rustc: "error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable",
    fix: "把第 5 行对 r 的使用移到 push_str 之前，让不可变借用先结束；或者干脆去掉 r。",
    explain: "r 的最后一次使用在第 5 行，所以第 4 行的可变借用和它冲突了。NLL 规则下，一次借用会活到它的最后一次使用为止。"
  },
  {
    id: "B2",
    level: 2,
    title: "值已经被搬走了",
    code: [
      "fn main() {",
      "    let s1 = String::from(\"a\");",
      "    let s2 = s1;",
      "    println!(\"{}\", s1);",
      "}"
    ],
    bugLines: [3],
    hint: "第 3 行之后，s1 还是原来的 s1 吗？",
    rustc: "error[E0382]: borrow of moved value: `s1`",
    fix: "把第 4 行改成 println!(\"{}\", s2)；或者第 3 行用 s1.clone() 克隆一份再赋值。",
    explain: "String 没有实现 Copy，第 3 行是移动（move）不是复制，s1 的所有权已经转给 s2，s1 失效了。"
  },
  {
    id: "B3",
    level: 3,
    title: "悬垂引用",
    code: [
      "fn main() {",
      "    let r;",
      "    {",
      "        let s = String::from(\"x\");",
      "        r = &s;",
      "    }",
      "    println!(\"{}\", r);",
      "}"
    ],
    bugLines: [4],
    hint: "大括号结束时，s 还在吗？r 指向谁？",
    rustc: "error[E0597]: `s` does not live long enough",
    fix: "把 s 的声明移到外层作用域，让它和 r 活得一样久；或者直接在内层用完 r，不要让它逃出去。",
    explain: "s 在第 6 行大括号结束时就被 drop 了，而 r 要活到第 7 行。引用指向的数据必须活得比引用更久，这是借用检查器的铁律。"
  },
  {
    id: "B4",
    level: 3,
    title: "又要变又不变",
    code: [
      "fn main() {",
      "    let mut s = String::from(\"hi\");",
      "    let r1 = &s;",
      "    let r2 = &mut s;",
      "    println!(\"{} {}\", r1, r2);",
      "}"
    ],
    bugLines: [3],
    hint: "r1 还在看 s 的时候，r2 想改 s，借用检查器答应吗？",
    rustc: "error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable",
    fix: "先把 r1 用完（比如提前 println!(\"{}\", r1)），让不可变借用结束后再创建 r2；或者 r2 也改成不可变借用。",
    explain: "借用三选一：要么多个不可变借用，要么一个可变借用，不能混着来。r1 的最后一次使用在第 5 行，所以第 4 行的可变借用撞上了它。"
  },
  {
    id: "B5",
    level: 4,
    title: "数组越界",
    code: [
      "fn main() {",
      "    let a = [1, 2, 3];",
      "    println!(\"{}\", a[5]);",
      "}"
    ],
    bugLines: [2],
    hint: "数组只有 3 个元素，编译器数得过来。",
    rustc: "error: this operation will panic at runtime — index out of bounds: the length is 3 but the index is 5（编译期 unconditional_panic，直接拒绝编译）",
    fix: "把下标改成 0~2 范围内的值；如果下标来自变量，先检查它小于 a.len()。",
    explain: "下标是常量时，新版 rustc 在编译期就能算出越界，连运行的机会都不给，直接报错。这是编译器在帮你提前排雷。"
  },
  {
    id: "B6",
    level: 5,
    title: "match 漏了分支",
    code: [
      "enum C { R, G, B }",
      "fn main() {",
      "    let c = C::R;",
      "    match c {",
      "        C::R => println!(\"red\"),",
      "        C::G => println!(\"green\"),",
      "    }",
      "}"
    ],
    bugLines: [3],
    hint: "C 有几个成员？match 处理了几个？",
    rustc: "error[E0004]: non-exhaustive patterns: `C::B` not covered",
    fix: "补上 C::B 的分支，或者加一个通配分支 `_ => ...` 兜底。",
    explain: "match 必须穷尽所有可能，这是 Rust 类型安全的招牌特性之一。漏掉 C::B，编译器绝不放行。"
  },
  {
    id: "B7",
    level: 6,
    title: "? 用错了地方",
    code: [
      "fn main() {",
      "    let s = std::fs::read_to_string(\"a.txt\")?;",
      "    println!(\"{}\", s);",
      "}"
    ],
    bugLines: [1],
    hint: "? 是把错误“向上抛”，抛给谁？main 接得住吗？",
    rustc: "error[E0277]: the `?` operator can only be used in a function that returns `Result` or `Option`",
    fix: "把逻辑搬到返回 Result 的函数里再用 ?；或者在 main 里用 match / unwrap 处理这个 Result。",
    explain: "? 的本质是\"出错就提前 return Err\"，所以它只能出现在返回 Result 或 Option 的函数里。main 返回的是 ()，没地方抛。"
  },
  {
    id: "B8",
    level: 7,
    title: "类型对不上",
    code: [
      "fn main() {",
      "    let mut v = vec![1, 2, 3];",
      "    v.push(\"four\");",
      "}"
    ],
    bugLines: [2],
    hint: "v 里装的是什么类型？\"four\" 又是什么类型？",
    rustc: "error[E0308]: mismatched types — expected `i32`, found `&str`",
    fix: "push(4) 保持 i32；或者一开始就声明 let mut v: Vec<String> 并 push \"four\".to_string()。",
    explain: "vec![1, 2, 3] 让编译器推断出 v 是 Vec<i32>，Vec 里所有元素必须是同一类型，字符串塞不进去。"
  },
  {
    id: "B9",
    level: 8,
    title: "泛型缺约束",
    code: [
      "fn largest<T>(a: T, b: T) -> T {",
      "    if a > b { a } else { b }",
      "}"
    ],
    bugLines: [1],
    hint: "T 可以是任何类型，任何类型都能比大小吗？",
    rustc: "error[E0369]: binary operation `>` cannot be applied to type `T`",
    fix: "给 T 加上约束：fn largest<T: PartialOrd>(a: T, b: T) -> T。",
    explain: "泛型函数必须对\"所有可能的 T\"都成立，而 > 只对实现了 PartialOrd 的类型有意义。不加约束，编译器不敢放行。"
  },
  {
    id: "B10",
    level: 9,
    title: "生命周期没标",
    code: [
      "fn longest(x: &str, y: &str) -> &str {",
      "    if x.len() > y.len() { x } else { y }",
      "}"
    ],
    bugLines: [0],
    hint: "返回的引用，到底是借了 x 还是借了 y？编译器猜不出来。",
    rustc: "error[E0106]: missing lifetime specifier",
    fix: "标上生命周期：fn longest<'a>(x: &'a str, y: &'a str) -> &'a str，告诉编译器返回的引用和参数活得一样久。",
    explain: "返回引用时，编译器必须知道它借用了谁。这里 x 和 y 都有可能，省略规则 cover 不了，只能手动标注。"
  }
];
