/* 生命周期时间线：bars 描述每个变量/引用的存活区间（行下标 0-based，闭区间）。
   kind: var(变量) / ref(引用)；bad: true 表示这个存活区间是非法的（红色）。
   notes: 行下标 -> 该行的讲解（稀疏）。 */
const LIFELINES = [
  {
    id: "F1", level: 9,
    title: "悬垂引用：r 活得比 s 久",
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
    bars: [
      { label: "r", from: 1, to: 6, kind: "ref", bad: true },
      { label: "s", from: 3, to: 5, kind: "var" }
    ],
    notes: {
      "1": "r 在这里声明，存活区间一直延伸到第 7 行的使用处。",
      "3": "s 在内层作用域创建，只活到第 6 行的 }。",
      "4": "r 借用了 s——但 r 的区间（蓝条…红色条）超出了 s 的区间！",
      "5": "s 在这里 drop，r 瞬间成了悬垂引用。编译器：想都别想。"
    },
    explain: "引用的存活区间绝不能超过它指向的数据。r 要用到第 7 行，但 s 在第 6 行就没了——这就是悬垂引用，Rust 在编译期直接拦下。"
  },
  {
    id: "F2", level: 3,
    title: "NLL：借用在最后一次使用后结束",
    code: [
      "fn main() {",
      "    let mut s = String::from(\"hi\");",
      "    let r = &s;",
      "    println!(\"{}\", r);",
      "    s.push_str(\"!\");",
      "}"
    ],
    bars: [
      { label: "s", from: 1, to: 5, kind: "var" },
      { label: "&s (r)", from: 2, to: 3, kind: "ref" }
    ],
    notes: {
      "2": "不可变借用开始。",
      "3": "r 最后一次使用——借用在这里结束（NLL），而不是作用域末尾！",
      "4": "借用已结束，s 恢复自由，可以可变借用了。"
    },
    explain: "NLL（非词法作用域生命周期）：借用的结束点是它的最后一次使用，而不是花括号的末尾。这就是为什么第 5 行能通过编译。"
  },
  {
    id: "F3", level: 2,
    title: "move：s1 的区间提前结束",
    code: [
      "fn main() {",
      "    let s1 = String::from(\"a\");",
      "    let s2 = s1;",
      "    println!(\"{}\", s2);",
      "}"
    ],
    bars: [
      { label: "s1", from: 1, to: 2, kind: "var" },
      { label: "s2", from: 2, to: 3, kind: "var" }
    ],
    notes: {
      "1": "s1 诞生。",
      "2": "move 发生：s1 的区间到此为止，s2 接管。",
      "3": "只有 s2 还活着，s1 已经是过去式了。"
    },
    explain: "move 会提前终结一个变量的存活区间。之后再用 s1，编译器会告诉你它已经'死'了。"
  },
  {
    id: "F4", level: 9,
    title: "结构体里的引用：x 不能比 s 活得久",
    code: [
      "struct R<'a> { r: &'a str }",
      "fn main() {",
      "    let s = String::from(\"hi\");",
      "    let x = R { r: &s };",
      "    println!(\"{}\", x.r);",
      "}"
    ],
    bars: [
      { label: "s", from: 2, to: 5, kind: "var" },
      { label: "x（含 &s）", from: 3, to: 5, kind: "ref" }
    ],
    notes: {
      "0": "R<'a> 的声明就是在说：'我体内的引用不能比 'a 活得久'。",
      "3": "x 借用了 s——x 的区间必须被 s 的区间完全包住。",
      "5": "两个一起结束，岁月静好，编译通过。"
    },
    explain: "结构体存引用必须标注生命周期，编译器用它检查'结构体不能比它借用的数据活得更久'。这里 x 的区间完全落在 s 的区间内，所以合法。"
  },
  {
    id: "F5", level: 10,
    title: "move 闭包：s 被搬进线程",
    code: [
      "use std::thread;",
      "fn main() {",
      "    let s = String::from(\"hi\");",
      "    let h = thread::spawn(move || {",
      "        println!(\"{}\", s);",
      "    });",
      "    h.join().unwrap();",
      "}"
    ],
    bars: [
      { label: "s（main 中）", from: 2, to: 3, kind: "var" },
      { label: "s（线程中）", from: 3, to: 6, kind: "var" }
    ],
    notes: {
      "3": "move 把 s 的所有权搬进闭包——main 里的 s 区间到此结束。",
      "4": "线程里的 s 继续活着，即使 main 先返回也不怕。",
      "6": "join 等线程结束，s 在这里 drop，干净。"
    },
    explain: "线程可能比 main 活得久，所以闭包必须用 move 把数据'带走'而不是借用。看区间：main 里的 s 在第 4 行就结束了，之后只有线程里的 s 有效。"
  }
];
