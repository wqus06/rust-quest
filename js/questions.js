const QUESTIONS = [
  // ===== 第 1 关：变量与可变性 =====
  {
    id: "L1-01",
    level: 1,
    topic: "变量默认不可变",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let x = 5;\n    x = 6;\n    println!(\"{}\", x);\n}",
    options: ["能，输出 6", "不能，x 默认不可变，需要加 mut", "能，输出 5", "运行时 panic"],
    answer: 1,
    explain: "Rust 里变量默认不可变，想修改必须用 let mut 声明。这里直接给 x 赋值，编译器会报错：cannot assign twice to immutable variable。"
  },
  {
    id: "L1-02",
    level: 1,
    topic: "mut 关键字",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let mut x = 5;\n    x = x + 1;\n    println!(\"{}\", x);\n}",
    options: ["5", "6", "编译错误", "未定义行为"],
    answer: 1,
    explain: "用 let mut 声明后变量就可以修改，x 从 5 变成 6，最后打印 6。"
  },
  {
    id: "L1-03",
    level: 1,
    topic: "类型推断",
    q: "下面代码中 x 的类型是什么？",
    code: "fn main() {\n    let x = 5;\n    println!(\"{}\", x);\n}",
    options: ["u32", "f64", "i32", "编译器无法推断，需要手动标注"],
    answer: 2,
    explain: "整数字面量默认被推断为 i32。Rust 编译器很聪明，能根据字面量自动推断类型，不用每次都手写。"
  },
  {
    id: "L1-04",
    level: 1,
    topic: "变量遮蔽",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x = 5;\n    let x = x + 1;\n    println!(\"{}\", x);\n}",
    options: ["5", "编译错误：重复定义", "6", "运行时 panic"],
    answer: 2,
    explain: "Rust 允许用 let 重新声明同名变量，这叫遮蔽（shadowing）。后面的 x 把前面的盖住，值变为 6。"
  },
  {
    id: "L1-05",
    level: 1,
    topic: "遮蔽可以改变类型",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let x = 5;\n    let x = \"hello\";\n    println!(\"{}\", x);\n}",
    options: ["不能，x 已经是整数类型", "能，输出 5", "不能，遮蔽只允许同类型", "能，输出 hello"],
    answer: 3,
    explain: "遮蔽是声明一个全新的变量，所以类型也可以变——x 从 i32 变成了 &str。这是遮蔽和 mut 的关键区别，记住它。"
  },
  {
    id: "L1-06",
    level: 1,
    topic: "mut 不允许改变类型",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let mut x = 5;\n    x = \"hello\";\n    println!(\"{}\", x);\n}",
    options: ["不能，mut 变量也不能改变类型", "能，输出 hello", "能，输出 5", "运行时 panic"],
    answer: 0,
    explain: "mut 只允许修改值，不允许改变类型。x 一旦被推断为 i32，就永远是 i32，想换类型只能用遮蔽重新声明。"
  },
  {
    id: "L1-07",
    level: 1,
    topic: "const 常量",
    q: "关于 const，下列说法正确的是？",
    code: "const MAX_POINTS: u32 = 100_000;\nfn main() {\n    println!(\"{}\", MAX_POINTS);\n}",
    options: ["const 必须标注类型", "const 可以不标注类型", "const 的值可以在运行时计算", "const 默认是可变的"],
    answer: 0,
    explain: "const 必须显式标注类型，且值必须是编译期就能确定的常量。常量永远不可变，这是它和 let 最大的不同。"
  },
  {
    id: "L1-08",
    level: 1,
    topic: "字面量超出类型范围",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let x: u8 = 300;\n    println!(\"{}\", x);\n}",
    options: ["能，输出 300", "运行时 panic", "不能，300 超出 u8 的表示范围", "能，输出 44（溢出回绕）"],
    answer: 2,
    explain: "u8 的最大值是 255，字面量 300 在编译期就会被拒绝（literal out of range）。Rust 宁可在编译时报错，也不让你带着溢出运行。"
  },
  {
    id: "L1-09",
    level: 1,
    topic: "遮蔽会“洗掉”mut",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let mut x = 5;\n    let x = x;\n    x = 6;\n    println!(\"{}\", x);\n}",
    options: ["能，输出 6", "能，输出 5", "不能，遮蔽要求类型不同", "不能，新的 x 是不可变的"],
    answer: 3,
    explain: "let x = x 声明了一个全新的不可变变量，它遮蔽了原来的 mut x。所以 x = 6 会报错：新绑定的变量默认不可变，mut 不会“继承”过来。"
  },
  {
    id: "L1-10",
    level: 1,
    topic: "const 不能引用变量",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let x = 5;\n    const Y: i32 = x;\n    println!(\"{}\", Y);\n}",
    options: ["不能，const 的初始值不能引用 let 变量", "能，输出 5", "能，Y 会变成可变变量", "运行时 panic"],
    answer: 0,
    explain: "const 的值必须在编译期完全确定，不能引用运行时的 let 变量。想复用运行时的值，直接用普通的 let 绑定就行。"
  },
  // ===== 第 2 关：所有权 =====
  {
    id: "L2-01",
    level: 2,
    topic: "移动语义 move",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1;\n    println!(\"{}\", s1);\n}",
    options: ["能，输出 hello", "能，输出空字符串", "不能，s1 的所有权已移动给 s2", "运行时 panic"],
    answer: 2,
    explain: "String 的赋值是移动（move）而非拷贝：s1 的所有权转移给了 s2，此后 s1 不再有效。这就是 Rust 所有权的核心规则。"
  },
  {
    id: "L2-02",
    level: 2,
    topic: "clone 深拷贝",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1.clone();\n    println!(\"{}\", s1);\n}",
    options: ["编译错误", "空字符串", "hello", "运行时 panic"],
    answer: 2,
    explain: "clone() 会深拷贝堆上的数据，s1 和 s2 各自拥有一份独立的数据，互不影响，所以 s1 照样能打印。"
  },
  {
    id: "L2-03",
    level: 2,
    topic: "Copy 类型",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x = 5;\n    let y = x;\n    println!(\"{}\", x);\n}",
    options: ["编译错误：x 已移动", "5", "0", "运行时 panic"],
    answer: 1,
    explain: "i32 实现了 Copy trait，赋值时会按位复制而不是移动，所以 x 依然有效。只有 Copy 类型才有这个待遇。"
  },
  {
    id: "L2-04",
    level: 2,
    topic: "函数传参转移所有权",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let s = String::from(\"hi\");\n    take(s);\n    println!(\"{}\", s);\n}\nfn take(s: String) {\n    println!(\"{}\", s);\n}",
    options: ["能，输出两行 hi", "能，只输出一行 hi", "运行时 panic", "不能，s 的所有权已移入函数"],
    answer: 3,
    explain: "把 String 按值传给函数，所有权就转移进了函数。函数返回后 s 被释放，外面不能再用它——传参也是一种移动。"
  },
  {
    id: "L2-05",
    level: 2,
    topic: "函数返回所有权",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let s = give();\n    println!(\"{}\", s);\n}\nfn give() -> String {\n    String::from(\"hey\")\n}",
    options: ["编译错误", "hey", "空字符串", "运行时 panic"],
    answer: 1,
    explain: "函数返回值的所有权会转移给调用者。give() 创建的 String 交到 s 手里，打印 hey，完全合法。"
  },
  {
    id: "L2-06",
    level: 2,
    topic: "元组返回多个值",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let s = String::from(\"hello\");\n    let (s2, len) = calc(s);\n    println!(\"{} {}\", s2, len);\n}\nfn calc(s: String) -> (String, usize) {\n    let len = s.len();\n    (s, len)\n}",
    options: ["编译错误", "hello 5", "hello 0", "运行时 panic"],
    answer: 1,
    explain: "想在函数用完 String 后还继续用它，可以把所有权通过元组再返回出来。这是 Rust 早期没有引用时的常见手法，现在一般直接传引用。"
  },
  {
    id: "L2-07",
    level: 2,
    topic: "连续移动",
    q: "下面代码中，最后仍然有效的变量是？",
    code: "fn main() {\n    let s1 = String::from(\"a\");\n    let s2 = s1;\n    let s3 = s2;\n    println!(\"{}\", s3);\n}",
    options: ["s1", "s2", "s3", "三个都有效"],
    answer: 2,
    explain: "所有权像接力棒一样依次传递：s1 → s2 → s3，每次移动前一个就失效，最后只有 s3 有效。"
  },
  {
    id: "L2-08",
    level: 2,
    topic: "哪些类型是 Copy",
    q: "以下哪个类型没有实现 Copy？",
    options: ["String", "i32", "bool", "char"],
    answer: 0,
    explain: "String 在堆上管理数据，拷贝代价高，所以没有实现 Copy；i32、bool、char 都是固定大小的栈上数据，实现了 Copy。"
  },
  {
    id: "L2-09",
    level: 2,
    topic: "移动后重新赋值",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let mut s = String::from(\"a\");\n    let t = s;\n    s = String::from(\"b\");\n    println!(\"{}{}\", s, t);\n}",
    options: ["ab", "aa", "编译错误：s 已移动", "ba"],
    answer: 3,
    explain: "s 的所有权虽然移给了 t，但 s 是 mut 的，重新赋值会给它一块全新的有效内存。所以 s 是“b”、t 是“a”，输出 ba。"
  },
  {
    id: "L2-10",
    level: 2,
    topic: "作用域结束释放",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let s1 = String::from(\"hi\");\n    {\n        let s2 = s1;\n        println!(\"{}\", s2);\n    }\n    println!(\"{}\", s1);\n}",
    options: ["能，输出两行 hi", "不能，s1 的所有权已移入内层作用域", "能，只输出一行 hi", "运行时 panic"],
    answer: 1,
    explain: "所有权移入内层作用域后，内层结束时 s2 被释放，s1 早已失效。移动不分作用域内外，规则都一样。"
  },
  // ===== 第 3 关：借用与引用 =====
  {
    id: "L3-01",
    level: 3,
    topic: "不可变借用",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let s = String::from(\"hello\");\n    println!(\"{}\", len(&s));\n    println!(\"{}\", s);\n}\nfn len(s: &String) -> usize {\n    s.len()\n}",
    options: ["编译错误", "5 加空字符串", "运行时 panic", "5 加 hello（两行）"],
    answer: 3,
    explain: "&s 是不可变借用，函数只借用不拿走所有权，所以之后 s 还能继续用。先打印长度 5，再打印 hello。"
  },
  {
    id: "L3-02",
    level: 3,
    topic: "可变借用",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let mut s = String::from(\"hi\");\n    add(&mut s);\n    println!(\"{}\", s);\n}\nfn add(s: &mut String) {\n    s.push_str(\"!\");\n}",
    options: ["hi", "编译错误", "hi!", "运行时 panic"],
    answer: 2,
    explain: "&mut s 是可变借用，函数可以通过它修改原数据。注意原变量本身也必须声明为 mut，两边都要“可变”。"
  },
  {
    id: "L3-03",
    level: 3,
    topic: "借用规则",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let mut s = String::from(\"a\");\n    let r1 = &s;\n    let r2 = &mut s;\n    println!(\"{}{}\", r1, r2);\n}",
    options: ["能", "不能，不可变借用和可变借用不能同时存在", "能，但输出乱码", "运行时 panic"],
    answer: 1,
    explain: "借用规则：在同一作用域里，要么多个不可变借用，要么一个可变借用，两者不能混用。这是 Rust 杜绝数据竞争的根本手段。"
  },
  {
    id: "L3-04",
    level: 3,
    topic: "多个不可变借用",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let s = String::from(\"a\");\n    let r1 = &s;\n    let r2 = &s;\n    println!(\"{}{}\", r1, r2);\n}",
    options: ["不能，s 只能被借用一次", "不能，r1 和 r2 冲突", "运行时 panic", "能，输出 aa"],
    answer: 3,
    explain: "多个不可变借用是允许的，因为只读不会产生数据竞争。限制只针对“可变”借用。"
  },
  {
    id: "L3-05",
    level: 3,
    topic: "NLL 非词法生命周期",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let mut s = String::from(\"a\");\n    let r = &s;\n    println!(\"{}\", r);\n    s.push_str(\"b\");\n    println!(\"{}\", s);\n}",
    options: ["能，输出 a 和 ab（两行）", "不能，r 的借用还没结束", "能，输出 a 和 a（两行）", "运行时 panic"],
    answer: 0,
    explain: "在 NLL（非词法生命周期）下，借用的有效期只到最后一次使用为止。r 在 push_str 之前就用完了，所以之后可以修改 s，合法。"
  },
  {
    id: "L3-06",
    level: 3,
    topic: "悬垂引用",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let r = dangle();\n    println!(\"{}\", r);\n}\nfn dangle() -> &String {\n    let s = String::from(\"x\");\n    &s\n}",
    options: ["不能，不能返回指向局部变量的引用", "能，输出 x", "能，输出空字符串", "运行时 panic"],
    answer: 0,
    explain: "s 在函数结束时被释放，返回 &s 会形成悬垂引用，Rust 编译器直接拒绝。想返回就返回 String 本身（转移所有权）。"
  },
  {
    id: "L3-07",
    level: 3,
    topic: "解引用",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x = 5;\n    let y = &x;\n    println!(\"{}\", *y);\n}",
    options: ["编译错误", "某个内存地址", "5", "运行时 panic"],
    answer: 2,
    explain: "*y 是解引用操作：顺着引用找到它指向的值。y 指向 x，所以 *y 就是 5。"
  },
  {
    id: "L3-08",
    level: 3,
    topic: "可变借用传参",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let mut n = 1;\n    inc(&mut n);\n    println!(\"{}\", n);\n}\nfn inc(n: &mut i32) {\n    *n += 1;\n}",
    options: ["1", "编译错误", "2", "运行时 panic"],
    answer: 2,
    explain: "inc 拿到 n 的可变借用，*n += 1 直接修改了 n 本身，所以输出 2。*n 是“顺着引用找到原变量”。"
  },
  {
    id: "L3-09",
    level: 3,
    topic: "不同作用域的可变借用",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let mut s = String::from(\"a\");\n    {\n        let r1 = &mut s;\n        r1.push_str(\"b\");\n    }\n    {\n        let r2 = &mut s;\n        r2.push_str(\"c\");\n    }\n    println!(\"{}\", s);\n}",
    options: ["不能，s 不能被可变借用两次", "能，输出 ab", "运行时 panic", "能，输出 abc"],
    answer: 3,
    explain: "借用规则限制的是“同时存在”的可变借用。两个可变借用在不同作用域里一前一后出现，互不重叠，所以合法，最终 s 是 abc。"
  },
  {
    id: "L3-10",
    level: 3,
    topic: "未使用的可变借用也算借用",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let mut s = String::from(\"a\");\n    let r1 = &s;\n    let r2 = &s;\n    let _r3 = &mut s;\n    println!(\"{}{}\", r1, r2);\n}",
    options: ["能，_r3 没被使用所以不算借用", "不能，可变借用与不可变借用冲突", "能，输出 aa", "运行时 panic"],
    answer: 1,
    explain: "即使 _r3 之后没被使用，&mut s 在创建的那一刻就与 r1、r2 的不可变借用冲突了。借用检查看的是借用是否“同时存活”，而不是变量名用没用过。"
  },
  // ===== 第 4 关：复合类型 =====
  {
    id: "L4-01",
    level: 4,
    topic: "元组访问",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let t = (1, \"a\", 3.0);\n    println!(\"{}\", t.1);\n}",
    options: ["1", "a", "3.0", "编译错误"],
    answer: 1,
    explain: "元组用点号加下标访问，下标从 0 开始数。t.1 就是第二个元素“a”。元组里可以混装不同类型。"
  },
  {
    id: "L4-02",
    level: 4,
    topic: "元组解构",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let (a, b) = (1, 2);\n    println!(\"{}\", a + b);\n}",
    options: ["3", "12", "编译错误", "运行时 panic"],
    answer: 0,
    explain: "let (a, b) = ... 叫解构：一次把元组里的值分别绑到 a 和 b 上。a + b 就是 1 + 2 = 3。"
  },
  {
    id: "L4-03",
    level: 4,
    topic: "数组索引",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let arr = [10, 20, 30];\n    println!(\"{}\", arr[1]);\n}",
    options: ["10", "30", "20", "编译错误"],
    answer: 2,
    explain: "数组索引从 0 开始，arr[1] 是第二个元素 20。数组里所有元素必须是同一种类型。"
  },
  {
    id: "L4-04",
    level: 4,
    topic: "数组重复语法",
    q: "let arr = [0; 5]; 定义的数组长度是？",
    code: "fn main() {\n    let arr = [0; 5];\n    println!(\"{}\", arr.len());\n}",
    options: ["0", "1", "编译错误", "5"],
    answer: 3,
    explain: "[0; 5] 是“值; 个数”的简写，表示 5 个 0，所以 len() 为 5。注意分号，不是逗号。"
  },
  {
    id: "L4-05",
    level: 4,
    topic: "结构体定义与实例化",
    q: "下面代码的输出是什么？",
    code: "struct User {\n    name: String,\n    age: u32,\n}\nfn main() {\n    let u = User { name: String::from(\"wei\"), age: 20 };\n    println!(\"{} {}\", u.name, u.age);\n}",
    options: ["编译错误：字段需要 pub", "20 wei", "wei 20", "运行时 panic"],
    answer: 2,
    explain: "结构体用 struct 定义，实例化时按“字段名: 值”填写，用点号访问字段。同一模块内访问字段不需要 pub。"
  },
  {
    id: "L4-06",
    level: 4,
    topic: "结构体更新语法",
    q: "下面代码的输出是什么？",
    code: "struct P { x: i32, y: i32 }\nfn main() {\n    let p1 = P { x: 1, y: 2 };\n    let p2 = P { x: 10, ..p1 };\n    println!(\"{} {}\", p2.x, p2.y);\n}",
    options: ["10 2", "1 2", "10 10", "编译错误"],
    answer: 0,
    explain: "..p1 表示“其余字段照抄 p1”。p2.x 被显式设为 10，p2.y 沿用 p1 的 2，所以输出 10 2。"
  },
  {
    id: "L4-07",
    level: 4,
    topic: "编译期越界检查",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let arr = [1, 2, 3];\n    println!(\"{}\", arr[5]);\n}",
    options: ["能，运行后 panic", "不能，编译器在编译期就发现索引一定越界", "能，输出 0", "运行后输出乱码"],
    answer: 1,
    explain: "Rust 编译器能在编译期算出 arr[5] 一定越界（数组长度 3 写死了），于是直接报编译错误，连运行的机会都不给。只有当索引是运行时才确定的值（比如 Vec 的 v[i]），才会留到运行时 panic。"
  },
  {
    id: "L4-08",
    level: 4,
    topic: "元组结构体",
    q: "下面代码的输出是什么？",
    code: "struct Color(i32, i32, i32);\nfn main() {\n    let c = Color(255, 0, 0);\n    println!(\"{}\", c.0);\n}",
    options: ["255", "编译错误：元组结构体不能这样访问", "(255, 0, 0)", "运行时 panic"],
    answer: 0,
    explain: "元组结构体（tuple struct）没有字段名，实例化像调用函数，访问也像元组一样用 c.0。它常用来给现有类型起个新名字。"
  },
  {
    id: "L4-09",
    level: 4,
    topic: "字段初始化简写",
    q: "下面代码能编译通过吗？",
    code: "struct User { name: String, age: u32 }\nfn main() {\n    let name = String::from(\"wei\");\n    let age = 20u32;\n    let u = User { name, age };\n    println!(\"{} {}\", u.name, u.age);\n}",
    options: ["不能，字段必须写成 name: name 的形式", "能，但输出乱码", "运行时 panic", "能，输出 wei 20"],
    answer: 3,
    explain: "当变量名和字段名相同时，可以简写成 User { name, age }，等价于 name: name。这是 Rust 推荐的写法，更简洁。"
  },
  {
    id: "L4-10",
    level: 4,
    topic: "结构体更新语法的部分移动",
    q: "下面代码能编译通过吗？",
    code: "struct User { name: String, age: u32 }\nfn main() {\n    let u1 = User { name: String::from(\"a\"), age: 1 };\n    let u2 = User { age: 2, ..u1 };\n    println!(\"{}\", u1.name);\n}",
    options: ["能，输出 a", "不能，u1.name 的所有权已移动给 u2", "能，输出空字符串", "运行时 panic"],
    answer: 1,
    explain: "..u1 会把 u1 里没被覆盖的字段逐个移动给 u2。String 不能 Copy，所以 u1.name 被移走后，u1 就不再完整可用了。"
  },
  // ===== 第 5 关：枚举与模式匹配 =====
  {
    id: "L5-01",
    level: 5,
    topic: "枚举基础",
    q: "下面代码的输出是什么？",
    code: "enum Dir { Up, Down }\nfn main() {\n    let d = Dir::Up;\n    match d {\n        Dir::Up => println!(\"up\"),\n        Dir::Down => println!(\"down\"),\n    }\n}",
    options: ["down", "编译错误", "up", "运行时 panic"],
    answer: 2,
    explain: "枚举的变体用 :: 引用，match 会根据实际值走对应的分支。d 是 Dir::Up，所以打印 up。"
  },
  {
    id: "L5-02",
    level: 5,
    topic: "Option 枚举",
    q: "Option<i32> 有哪两个变体？",
    options: ["Some 和 None", "Ok 和 Err", "True 和 False", "Just 和 Nothing"],
    answer: 0,
    explain: "Option<T> 是标准库定义的枚举：Some(T) 表示有值，None 表示没有值。Ok 和 Err 是 Result 的变体，别搞混。"
  },
  {
    id: "L5-03",
    level: 5,
    topic: "match 穷尽性",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let n = 2;\n    match n {\n        1 => println!(\"one\"),\n        2 => println!(\"two\"),\n    }\n}",
    options: ["能", "不能，match 必须穷尽所有可能", "能，但有警告", "运行时 panic"],
    answer: 1,
    explain: "match 必须覆盖所有可能的情况。n 是 i32，这里漏掉了除 1、2 之外的值。加上 _ => ... 分支即可通过。"
  },
  {
    id: "L5-04",
    level: 5,
    topic: "if let",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x = Some(5);\n    if let Some(v) = x {\n        println!(\"{}\", v);\n    }\n}",
    options: ["编译错误", "None", "什么都不输出", "5"],
    answer: 3,
    explain: "if let 是只关心一种模式时的简写：x 是 Some(5)，模式匹配成功，v 绑定为 5，于是打印 5。"
  },
  {
    id: "L5-05",
    level: 5,
    topic: "match 绑定值",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x = Some(5);\n    match x {\n        Some(v) => println!(\"got {}\", v),\n        None => println!(\"none\"),\n    }\n}",
    options: ["none", "got None", "编译错误", "got 5"],
    answer: 3,
    explain: "Some(v) 模式会把里面的值绑定给 v，所以打印 got 5。模式匹配不只是“判断”，还能顺手把数据取出来。"
  },
  {
    id: "L5-06",
    level: 5,
    topic: "match 守卫",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let n = Some(7);\n    match n {\n        Some(x) if x > 10 => println!(\"big\"),\n        Some(x) => println!(\"small {}\", x),\n        None => println!(\"none\"),\n    }\n}",
    options: ["big", "small 7", "none", "编译错误"],
    answer: 1,
    explain: "if x > 10 叫匹配守卫（match guard）：第一个分支模式对上了但守卫不成立，就落到第二个分支，输出 small 7。"
  },
  {
    id: "L5-07",
    level: 5,
    topic: "通配符 _",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let n = 99;\n    match n {\n        1 => println!(\"one\"),\n        _ => println!(\"other\"),\n    }\n}",
    options: ["one", "编译错误", "other", "运行时 panic"],
    answer: 2,
    explain: "_ 是通配符模式，匹配其他所有情况，保证了 match 的穷尽性。n 是 99，所以走 _ 分支打印 other。"
  },
  {
    id: "L5-08",
    level: 5,
    topic: "枚举关联数据",
    q: "下面代码的输出是什么？",
    code: "enum Msg { Text(String), Quit }\nfn main() {\n    let m = Msg::Text(String::from(\"hi\"));\n    match m {\n        Msg::Text(s) => println!(\"text: {}\", s),\n        Msg::Quit => println!(\"quit\"),\n    }\n}",
    options: ["text: hi", "quit", "编译错误", "text: "],
    answer: 0,
    explain: "枚举变体可以携带数据。Msg::Text(s) 模式把里面的 String 绑定给 s，于是打印 text: hi。"
  },
  {
    id: "L5-09",
    level: 5,
    topic: "if let 会移动所有权",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let opt = Some(String::from(\"hi\"));\n    if let Some(s) = opt {\n        println!(\"{}\", s);\n    }\n    println!(\"{:?}\", opt);\n}",
    options: ["能，输出 hi 和 Some(\"hi\")", "能，但第二个打印输出 None", "运行时 panic", "不能，opt 在 if let 中被移动了"],
    answer: 3,
    explain: "if let Some(s) = opt 会把 opt 里 String 的所有权移动给 s，之后 opt 就不能再用了。如需保留，要写成 if let Some(s) = &opt 来借用。"
  },
  {
    id: "L5-10",
    level: 5,
    topic: "用引用匹配避免移动",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let opt = Some(String::from(\"hi\"));\n    match &opt {\n        Some(s) => println!(\"{}\", s),\n        None => println!(\"none\"),\n    }\n    println!(\"{:?}\", opt);\n}",
    options: ["能，输出 hi 和 Some(\"hi\")", "不能，match 会移动 opt", "能，但第二个打印报错", "运行时 panic"],
    answer: 0,
    explain: "match &opt 是对引用做匹配，s 绑定的是 &String，没有移动所有权，所以之后 opt 照常用。这是“只看不动”的常用技巧。"
  },
  // ===== 第 6 关：错误处理 =====
  {
    id: "L6-01",
    level: 6,
    topic: "Result 枚举",
    q: "Result<T, E> 有哪两个变体？",
    options: ["Ok 和 Err", "Some 和 None", "Good 和 Bad", "Yes 和 No"],
    answer: 0,
    explain: "Result<T, E> 表示可能失败的操作：Ok(T) 装着成功的值，Err(E) 装着错误信息。Rust 用它代替异常机制。"
  },
  {
    id: "L6-02",
    level: 6,
    topic: "unwrap 取值",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x: Result<i32, &str> = Ok(42);\n    println!(\"{}\", x.unwrap());\n}",
    options: ["编译错误", "42", "Ok(42)", "运行时 panic"],
    answer: 1,
    explain: "unwrap 在 Ok 时直接取出里面的值 42；如果是 Err 就会 panic。只在“确定不会失败”时用它。"
  },
  {
    id: "L6-03",
    level: 6,
    topic: "unwrap 遇到 Err",
    q: "下面代码运行时的结果是？",
    code: "fn main() {\n    let x: Result<i32, &str> = Err(\"boom\");\n    println!(\"{}\", x.unwrap());\n}",
    options: ["输出 boom", "输出 0", "panic 并打印错误信息", "编译错误"],
    answer: 2,
    explain: "对 Err 调用 unwrap 会直接 panic，程序崩溃。所以 unwrap 只适合“绝不可能失败”的场合，比如测试代码。"
  },
  {
    id: "L6-04",
    level: 6,
    topic: "expect",
    q: "expect 和 unwrap 的区别是？",
    code: "fn main() {\n    let x: Result<i32, &str> = Ok(1);\n    println!(\"{}\", x.expect(\"x 一定是 Ok\"));\n}",
    options: ["expect 不会 panic", "expect 只能用于 Option", "expect 速度更快", "expect 允许自定义 panic 时的错误信息"],
    answer: 3,
    explain: "expect(msg) 和 unwrap 一样：成功取值、失败 panic。区别是 panic 时会打印你给的 msg，方便定位问题，代码可读性也更好。"
  },
  {
    id: "L6-05",
    level: 6,
    topic: "? 运算符",
    q: "下面代码中 ? 的作用是？",
    code: "fn read() -> Result<String, std::io::Error> {\n    let s = std::fs::read_to_string(\"a.txt\")?;\n    Ok(s)\n}\nfn main() {\n    match read() {\n        Ok(s) => println!(\"read ok\"),\n        Err(_) => println!(\"read err\"),\n    }\n}",
    options: ["把错误转换成 panic", "忽略错误继续执行", "如果出错就提前返回 Err，成功则取出 Ok 里的值", "把 Result 转成 Option"],
    answer: 2,
    explain: "? 是错误传播的语法糖：Ok 就拆包取值，Err 就直接把错误返回给调用者，省掉了冗长的 match 样板代码。"
  },
  {
    id: "L6-06",
    level: 6,
    topic: "? 需要返回 Result 的函数",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let s = std::fs::read_to_string(\"a.txt\")?;\n    println!(\"{}\", s);\n}",
    options: ["能", "不能，main 没有返回 Result，不能用 ?", "能，但文件不存在时会 panic", "运行时 panic"],
    answer: 1,
    explain: "? 只能用在返回 Result（或 Option）的函数里。普通 main 返回 ()，所以这里编译不过——这是初学者最常踩的坑之一。"
  },
  {
    id: "L6-07",
    level: 6,
    topic: "match 处理 Result",
    q: "下面代码的输出是什么？（假设 a.txt 不存在）",
    code: "fn main() {\n    match std::fs::read_to_string(\"a.txt\") {\n        Ok(s) => println!(\"ok: {}\", s),\n        Err(_e) => println!(\"err\"),\n    }\n}",
    options: ["ok: ", "panic", "err", "编译错误"],
    answer: 2,
    explain: "文件不存在时 read_to_string 返回 Err，match 走到 Err 分支打印 err，程序正常结束不崩溃。这就是显式处理错误的写法。"
  },
  {
    id: "L6-08",
    level: 6,
    topic: "unwrap_or",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let x: Result<i32, &str> = Err(\"e\");\n    println!(\"{}\", x.unwrap_or(0));\n}",
    options: ["0", "panic", "e", "编译错误"],
    answer: 0,
    explain: "unwrap_or 在 Err 时不 panic，而是返回你给的默认值 0。适合“失败了就用兜底值”的场景，比 unwrap 温柔得多。"
  },
  {
    id: "L6-09",
    level: 6,
    topic: "main 返回 Result",
    q: "下面代码能编译通过吗？",
    code: "fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let s = std::fs::read_to_string(\"a.txt\")?;\n    println!(\"{}\", s);\n    Ok(())\n}",
    options: ["不能，main 必须返回 ()", "不能，? 不能用于 io::Error", "运行时 panic", "能，这样 main 里也可以用 ?"],
    answer: 3,
    explain: "main 允许返回 Result<(), E>（E 要实现 Debug），这样 main 里就能用 ? 做错误传播。出 main 返回 Err 时会打印错误并以非零状态退出。"
  },
  {
    id: "L6-10",
    level: 6,
    topic: "unwrap_or_else 惰性求值",
    q: "关于 unwrap_or 和 unwrap_or_else，下列说法正确的是？",
    options: ["unwrap_or 的默认值总是先算出来，unwrap_or_else 只在出错时才调用闭包", "两者完全一样", "unwrap_or_else 只能用于 Option", "unwrap_or 性能更好"],
    answer: 0,
    explain: "unwrap_or(默认值) 会先把默认值算出来再调用，不管成功失败；unwrap_or_else(|| ...) 只在 Err 时才执行闭包。默认值计算很贵时用后者。"
  },
  // ===== 第 7 关：集合与迭代器 =====
  {
    id: "L7-01",
    level: 7,
    topic: "Vec::new 和 push",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let mut v = Vec::new();\n    v.push(1);\n    v.push(2);\n    println!(\"{}\", v.len());\n}",
    options: ["0", "编译错误：Vec 需要标注类型", "2", "运行时 panic"],
    answer: 2,
    explain: "Vec::new 创建空的动态数组，push 从尾部添加元素。注意 v 必须是 mut 的，类型会从 push 的值推断出来。"
  },
  {
    id: "L7-02",
    level: 7,
    topic: "vec! 宏",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let v = vec![1, 2, 3];\n    println!(\"{}\", v[0] + v[2]);\n}",
    options: ["6", "编译错误", "运行时 panic", "4"],
    answer: 3,
    explain: "vec![1, 2, 3] 是快速创建 Vec 的宏。v[0] + v[2] = 1 + 3 = 4。"
  },
  {
    id: "L7-03",
    level: 7,
    topic: "String 操作",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let mut s = String::from(\"hello\");\n    s.push_str(\" world\");\n    println!(\"{}\", s);\n}",
    options: ["hello", "hello world", "编译错误", "helloworld"],
    answer: 1,
    explain: "push_str 在字符串尾部追加一个 &str。注意 push 是追加单个 char，push_str 追加字符串切片，别混了。"
  },
  {
    id: "L7-04",
    level: 7,
    topic: "Vec 越界访问",
    q: "下面代码运行时的结果是？",
    code: "fn main() {\n    let v = vec![1, 2, 3];\n    println!(\"{}\", v[10]);\n}",
    options: ["输出 0", "输出乱码", "编译错误", "panic：索引越界"],
    answer: 3,
    explain: "和数组一样，Vec 用 [] 越界访问会直接 panic。想安全访问就用 v.get(10)，它返回 Option，越界时是 None。"
  },
  {
    id: "L7-05",
    level: 7,
    topic: "iter 与 into_iter",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let v = vec![1, 2, 3];\n    for x in v.iter() {\n        println!(\"{}\", x);\n    }\n    println!(\"{}\", v.len());\n}",
    options: ["能，v 的所有权没有被拿走", "不能，for 循环移动了 v", "能，但 v 变为空", "运行时 panic"],
    answer: 0,
    explain: "v.iter() 是不可变借用迭代，只借不拿，所以循环后 v 照常用。如果是 v.into_iter() 或直接 for x in v，所有权会被拿走。"
  },
  {
    id: "L7-06",
    level: 7,
    topic: "HashMap",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    use std::collections::HashMap;\n    let mut m = HashMap::new();\n    m.insert(\"a\", 1);\n    m.insert(\"b\", 2);\n    println!(\"{}\", m[\"a\"]);\n}",
    options: ["1", "编译错误", "None", "运行时 panic"],
    answer: 0,
    explain: "HashMap 用 insert 存键值对，用 m[\"a\"] 按键取值。和 Vec 不同，HashMap 不在预导入（prelude）里，需要 use 引入。"
  },
  {
    id: "L7-07",
    level: 7,
    topic: "迭代器 map",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let v = vec![1, 2, 3];\n    let v2: Vec<i32> = v.iter().map(|x| x * 2).collect();\n    println!(\"{:?}\", v2);\n}",
    options: ["[1, 2, 3]", "编译错误", "[2, 4, 6]", "运行时 panic"],
    answer: 2,
    explain: "map 对每个元素做变换得到新迭代器，collect 把它收集回 Vec。链式调用是 Rust 迭代器的标志性写法，多读几遍就顺了。"
  },
  {
    id: "L7-08",
    level: 7,
    topic: "collect 类型标注",
    q: "下面代码为什么需要标注 Vec<i32>？",
    code: "fn main() {\n    let v: Vec<i32> = (1..4).collect();\n    println!(\"{:?}\", v);\n}",
    options: ["collect 能收集成多种集合类型，不标注编译器无法确定", "不标注会运行时 panic", "标注只是为了可读性", "编译错误：collect 不能用于 Range"],
    answer: 0,
    explain: "collect 可以收集成 Vec、HashSet、String 等多种类型，编译器猜不出来目标类型，必须显式告诉它。这是 collect 最常见的编译错误来源。"
  },
  {
    id: "L7-09",
    level: 7,
    topic: "get 与索引的区别",
    q: "v.get(10) 和 v[10] 的区别是？",
    options: ["没区别", "get 更快", "v[10] 返回 Option", "get 返回 Option（越界时是 None），v[10] 越界会 panic"],
    answer: 3,
    explain: "get 是安全访问：越界返回 None；[] 是直接索引：越界直接 panic。下标不确定是否有效时，用 get 再配合 match 或 unwrap_or 处理。"
  },
  {
    id: "L7-10",
    level: 7,
    topic: "for 循环拿走所有权",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let v = vec![String::from(\"a\")];\n    for s in v {\n        println!(\"{}\", s);\n    }\n    println!(\"{}\", v.len());\n}",
    options: ["能", "不能，for s in v 拿走了 v 的所有权", "能，但 v 变为空", "运行时 panic"],
    answer: 1,
    explain: "for s in v 等价于 v.into_iter()，会拿走 v 的所有权。想保留 v 就写 for s in &v（或 v.iter()），只借用不拿走。"
  },
  // ===== 第 8 关：泛型与 Trait =====
  {
    id: "L8-01",
    level: 8,
    topic: "泛型函数",
    q: "下面代码的输出是什么？",
    code: "fn id<T>(x: T) -> T {\n    x\n}\nfn main() {\n    println!(\"{}\", id(5));\n    println!(\"{}\", id(\"hi\"));\n}",
    options: ["编译错误：T 只能是一种类型", "5 和 5（两行）", "5 和 hi（两行）", "运行时 panic"],
    answer: 2,
    explain: "泛型函数在每次调用时单态化：id(5) 生成 i32 版本，id(\"hi\") 生成 &str 版本，互不干扰。一次定义，到处复用。"
  },
  {
    id: "L8-02",
    level: 8,
    topic: "泛型结构体",
    q: "下面代码能编译通过吗？",
    code: "struct Point<T> { x: T, y: T }\nfn main() {\n    let p = Point { x: 1, y: 2.0 };\n    println!(\"{} {}\", p.x, p.y);\n}",
    options: ["能", "不能，x 和 y 必须是同一种类型 T", "能，输出 1 2", "运行时 panic"],
    answer: 1,
    explain: "struct Point<T> 里两个字段共享同一个类型参数 T。x 是 i32、y 是 f64，对不上就报错。想要不同类型就定义 struct Point<T, U>。"
  },
  {
    id: "L8-03",
    level: 8,
    topic: "trait 定义与实现",
    q: "下面代码的输出是什么？",
    code: "trait Speak {\n    fn speak(&self);\n}\nstruct Dog;\nimpl Speak for Dog {\n    fn speak(&self) { println!(\"woof\"); }\n}\nfn main() {\n    Dog.speak();\n}",
    options: ["编译错误：trait 方法必须有默认实现", "什么都不输出", "woof", "运行时 panic"],
    answer: 2,
    explain: "trait 定义共享行为（方法签名），impl Trait for Type 为具体类型实现它，之后就能像普通方法一样调用。trait 是 Rust 抽象的核心。"
  },
  {
    id: "L8-04",
    level: 8,
    topic: "derive Debug",
    q: "下面代码能编译通过吗？",
    code: "#[derive(Debug)]\nstruct P { x: i32 }\nfn main() {\n    let p = P { x: 1 };\n    println!(\"{:?}\", p);\n}",
    options: ["不能，结构体不能用 {:?} 打印", "不能，derive 要写在 struct 下面", "运行时 panic", "能，输出 P { x: 1 }"],
    answer: 3,
    explain: "#[derive(Debug)] 让编译器自动实现 Debug trait，这样就能用 {:?} 打印结构体做调试。几乎每个自定义类型都值得派生 Debug。"
  },
  {
    id: "L8-05",
    level: 8,
    topic: "trait bound",
    q: "下面代码中 <T: std::fmt::Display> 的含义是？",
    code: "fn show<T: std::fmt::Display>(x: T) {\n    println!(\"{}\", x);\n}",
    options: ["T 必须实现 Display trait，否则不能用 {} 打印", "T 必须是 String 类型", "T 必须是数字类型", "这是定义新 trait 的语法"],
    answer: 0,
    explain: "T: Display 叫 trait bound（约束）：要求调用者传入的类型必须实现了 Display，否则编译器拒绝。泛型不是“什么都能传”，约束才是它的灵魂。"
  },
  {
    id: "L8-06",
    level: 8,
    topic: "impl Trait 参数",
    q: "fn f(x: impl Display) 和 fn f<T: Display>(x: T) 的关系是？",
    options: ["完全不同", "impl Trait 是泛型的语法糖，含义相同", "impl Trait 只能用于返回值", "impl Trait 性能更差"],
    answer: 1,
    explain: "参数位置的 impl Trait 就是泛型的简写，编译器会把它展开成带 trait bound 的泛型函数。写起来短，心智负担小。"
  },
  {
    id: "L8-07",
    level: 8,
    topic: "trait 默认方法",
    q: "下面代码的输出是什么？",
    code: "trait Greet {\n    fn hello(&self) { println!(\"hi\"); }\n}\nstruct Cat;\nimpl Greet for Cat {}\nfn main() {\n    Cat.hello();\n}",
    options: ["编译错误：impl 块不能为空", "什么都不输出", "hi", "运行时 panic"],
    answer: 2,
    explain: "trait 方法可以有默认实现，impl Greet for Cat {} 不写方法体就直接沿用默认的 hi。想定制再覆盖它。"
  },
  {
    id: "L8-08",
    level: 8,
    topic: "多重约束",
    q: "下面代码能编译通过吗？",
    code: "fn f<T: Clone + std::fmt::Debug>(x: T) {\n    let y = x.clone();\n    println!(\"{:?}\", y);\n}\nfn main() { f(5); }",
    options: ["能", "不能，一个泛型只能有一个约束", "不能，i32 没有实现 Clone", "运行时 panic"],
    answer: 0,
    explain: "用 + 可以叠加多个 trait bound。i32 同时实现了 Clone 和 Debug，所以 f(5) 合法。约束多了还能用 where 子句换行写。"
  },
  {
    id: "L8-09",
    level: 8,
    topic: "Display 不能 derive",
    q: "下面代码能编译通过吗？",
    code: "#[derive(std::fmt::Display)]\nstruct P { x: i32 }\nfn main() {\n    println!(\"{}\", P { x: 1 });\n}",
    options: ["能，输出 P { x: 1 }", "能，输出 1", "运行时 panic", "不能，Display 不能用 derive 自动实现"],
    answer: 3,
    explain: "只有 Debug 等少数 trait 能 derive，Display 必须手写实现——因为“怎么展示给用户看”只有你自己知道，编译器不敢替你决定。"
  },
  {
    id: "L8-10",
    level: 8,
    topic: "孤儿规则",
    q: "下面代码能编译通过吗？",
    code: "impl std::fmt::Display for Vec<i32> {\n    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {\n        write!(f, \"vec\")\n    }\n}\nfn main() {}",
    options: ["能", "不能，孤儿规则：不能为外部类型实现外部 trait", "能，但有警告", "运行时 panic"],
    answer: 1,
    explain: "孤儿规则要求：要么 trait 是你定义的，要么类型是你定义的。Display 和 Vec<i32> 都是标准库的，所以不允许——这是为了保证实现的全局唯一性。"
  },
  // ===== 第 9 关：生命周期 =====
  {
    id: "L9-01",
    level: 9,
    topic: "引用的有效性",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let r;\n    {\n        let x = 5;\n        r = &x;\n    }\n    println!(\"{}\", r);\n}",
    options: ["能，输出 5", "运行时 panic", "不能，x 活得没 r 久", "能，输出乱码"],
    answer: 2,
    explain: "引用的寿命不能超过它指向的数据。x 在内层作用域结束时就被释放了，r 再指向它就是悬垂引用，编译器直接拒绝。"
  },
  {
    id: "L9-02",
    level: 9,
    topic: "生命周期标注的含义",
    q: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str 中 'a 的含义是？",
    options: ["x、y 和返回值引用的数据至少活得一样久", "函数最多活 'a 这么久", "这是一种新的引用类型", "表示参数可以为空"],
    answer: 0,
    explain: "生命周期标注描述的是引用之间的关系：'a 告诉编译器，返回的引用和 x、y 指向的数据“同生共死”，不能比它们活得更久。它不改变任何实际的寿命，只是声明关系。"
  },
  {
    id: "L9-03",
    level: 9,
    topic: "生命周期省略",
    q: "下面代码能编译通过吗？",
    code: "fn first(s: &str) -> &str {\n    &s[0..1]\n}\nfn main() {\n    println!(\"{}\", first(\"hello\"));\n}",
    options: ["不能，返回引用必须写生命周期标注", "能，省略规则自动补上标注", "能，但运行时 panic", "不能，&s[0..1] 语法错误"],
    answer: 1,
    explain: "生命周期省略规则：如果只有一个输入引用，输出引用的生命周期就和它一样。first 符合这条规则，所以不用手写 'a。"
  },
  {
    id: "L9-04",
    level: 9,
    topic: "'static 生命周期",
    q: "'static 生命周期的含义是？",
    options: ["引用只能活 1 秒", "和 static 变量完全一样", "表示引用永远不可变", "引用指向的数据在整个程序运行期间都有效"],
    answer: 3,
    explain: "'static 是最长的生命周期：数据从程序启动活到结束。字符串字面量比如“hello”就存在二进制文件里，是典型的 'static 数据。"
  },
  {
    id: "L9-05",
    level: 9,
    topic: "结构体中的生命周期",
    q: "下面代码能编译通过吗？",
    code: "struct R<'a> { r: &'a str }\nfn main() {\n    let s = String::from(\"hi\");\n    let x = R { r: &s };\n    println!(\"{}\", x.r);\n}",
    options: ["不能，结构体不能包含引用", "能，但输出乱码", "运行时 panic", "能，输出 hi"],
    answer: 3,
    explain: "结构体里存引用必须标注生命周期：R<'a> 声明“这个结构体不能比它借用的数据活得更久”，编译器会替你检查。这是 Rust 里最常见的生命周期写法。"
  },
  {
    id: "L9-06",
    level: 9,
    topic: "为什么需要标注",
    q: "下面代码能编译通过吗？",
    code: "fn longest(x: &str, y: &str) -> &str {\n    if x.len() > y.len() { x } else { y }\n}",
    options: ["能", "不能，编译器不知道返回的引用和哪个参数同寿命", "能，但有警告", "运行时 panic"],
    answer: 1,
    explain: "两个输入引用、一个输出引用时，省略规则不够用了——编译器分不清返回的是 x 还是 y，必须手写 <'a> 告诉它。这就是生命周期标注存在的意义。"
  },
  {
    id: "L9-07",
    level: 9,
    topic: "省略规则",
    q: "以下哪个函数不需要手写生命周期标注？",
    options: ["fn f(x: &str, y: &str) -> &str", "fn f(x: &str) -> &str", "fn f() -> &str", "都需要手写"],
    answer: 1,
    explain: "省略规则第一条：只有一个输入引用时，输出引用的生命周期自动和它相同。A 有两个输入引用分不清，C 没有输入引用无从推断，都必须手写。"
  },
  {
    id: "L9-08",
    level: 9,
    topic: "方法中的生命周期",
    q: "下面代码能编译通过吗？",
    code: "struct R<'a> { r: &'a str }\nimpl<'a> R<'a> {\n    fn get(&self) -> &str { self.r }\n}\nfn main() {\n    let s = String::from(\"hi\");\n    let x = R { r: &s };\n    println!(\"{}\", x.get());\n}",
    options: ["不能，方法返回引用必须标注", "能，输出 hi", "能，但输出乱码", "运行时 panic"],
    answer: 1,
    explain: "impl<'a> R<'a> 把生命周期带进来后，方法里的省略规则照常工作：&self 是唯一的输入引用，返回值自动和它同寿命，不用再写一遍。"
  },
  {
    id: "L9-09",
    level: 9,
    topic: "返回局部引用",
    q: "下面代码能编译通过吗？",
    code: "fn make() -> &str {\n    let s = String::from(\"hi\");\n    &s\n}\nfn main() {\n    println!(\"{}\", make());\n}",
    options: ["能，输出 hi", "能，输出空字符串", "运行时 panic", "不能，不能返回指向局部变量的引用"],
    answer: 3,
    explain: "s 是函数内的局部变量，函数结束就释放了，返回 &s 就是悬垂引用。想返回就返回 String 本身（转移所有权），别返回引用。"
  },
  {
    id: "L9-10",
    level: 9,
    topic: "生命周期取短者",
    q: "下面代码能编译通过吗？",
    code: "fn pick<'a>(x: &'a str, y: &'a str, b: bool) -> &'a str {\n    if b { x } else { y }\n}\nfn main() {\n    let a = String::from(\"a\");\n    let result;\n    {\n        let b = String::from(\"b\");\n        result = pick(&a, &b, true);\n    }\n    println!(\"{}\", result);\n}",
    options: ["不能，返回值的寿命不能超过 b 的寿命", "能，输出 a", "能，但输出乱码", "运行时 panic"],
    answer: 0,
    explain: "'a 必须同时满足 x 和 y 的寿命，取的是两者中较短的那个。b 在内层作用域结束就释放了，所以 result 不能活着出来——即使实际走的是 x 分支，编译器也按最坏情况检查。"
  },
  // ===== 第 10 关：智能指针与并发 =====
  {
    id: "L10-01",
    level: 10,
    topic: "Box 智能指针",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let b = Box::new(5);\n    println!(\"{}\", *b);\n}",
    options: ["5", "编译错误", "某个内存地址", "运行时 panic"],
    answer: 0,
    explain: "Box::new(5) 把 5 装箱到堆上，*b 解引用拿到里面的值 5。Box 是最简单的智能指针，也是递归类型（比如链表）的必备工具。"
  },
  {
    id: "L10-02",
    level: 10,
    topic: "移出 Box",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let b = Box::new(String::from(\"hi\"));\n    let s = *b;\n    println!(\"{}\", s);\n}",
    options: ["编译错误：不能移出 Box", "Box<String>", "运行时 panic", "hi"],
    answer: 3,
    explain: "Box 是唯一允许“移出内容”的智能指针：*b 把堆上的 String 所有权直接拿出来，b 随即失效。其他智能指针可没这个特权。"
  },
  {
    id: "L10-03",
    level: 10,
    topic: "Rc 引用计数",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let a = std::rc::Rc::new(5);\n    let b = std::rc::Rc::clone(&a);\n    println!(\"{}\", std::rc::Rc::strong_count(&a));\n}",
    options: ["1", "3", "编译错误", "2"],
    answer: 3,
    explain: "Rc::clone 只增加引用计数、不深拷贝数据，a 和 b 共享同一份数据，计数为 2。注意要写 Rc::clone(&a)，别写成 a.clone()（虽然效果一样，但前者意图更清晰）。"
  },
  {
    id: "L10-04",
    level: 10,
    topic: "thread::spawn",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let h = std::thread::spawn(|| {\n        1 + 1\n    });\n    println!(\"{}\", h.join().unwrap());\n}",
    options: ["编译错误", "0", "运行时 panic", "2"],
    answer: 3,
    explain: "thread::spawn 在新线程里跑闭包，返回 JoinHandle；join() 等它结束并拿回返回值（包在 Result 里，unwrap 取出）。所以输出 2。"
  },
  {
    id: "L10-05",
    level: 10,
    topic: "Rc 与 Arc",
    q: "多线程之间共享数据应该用哪个智能指针？",
    options: ["Rc", "Arc", "Box", "都行"],
    answer: 1,
    explain: "Rc 的引用计数不是线程安全的，多线程共享要用 Arc（Atomic Rc），它用原子操作保证计数正确。多线程 + Rc 是编译器会拦下来的错误。"
  },
  {
    id: "L10-06",
    level: 10,
    topic: "RefCell 运行时借用检查",
    q: "下面代码运行时的结果是？",
    code: "fn main() {\n    let x = std::cell::RefCell::new(5);\n    let a = x.borrow_mut();\n    let b = x.borrow_mut();\n    println!(\"{} {}\", a, b);\n}",
    options: ["输出 5 5", "编译错误", "panic：已经存在可变借用", "输出 0 0"],
    answer: 2,
    explain: "RefCell 把借用检查推迟到运行时：同时存在两个可变借用时直接 panic。用 RefCell 就是“编译器信你，运行时盯着你”——单线程内部可变性的代价。"
  },
  {
    id: "L10-07",
    level: 10,
    topic: "move 闭包",
    q: "下面代码能编译通过吗？",
    code: "fn main() {\n    let s = String::from(\"hi\");\n    let h = std::thread::spawn(move || {\n        println!(\"{}\", s);\n    });\n    h.join().unwrap();\n}",
    options: ["不能，闭包不能捕获变量", "能，move 把 s 的所有权转移进线程", "不能，s 在主线程还得用", "运行时 panic"],
    answer: 1,
    explain: "新线程可能比主线程活得久，所以 spawn 要求闭包是 'static 的：move 关键字把 s 的所有权转移进去，满足要求。spawn 后主线程就不能再用 s 了。"
  },
  {
    id: "L10-08",
    level: 10,
    topic: "Mutex",
    q: "下面代码的输出是什么？",
    code: "fn main() {\n    let m = std::sync::Mutex::new(5);\n    {\n        let mut g = m.lock().unwrap();\n        *g += 1;\n    }\n    println!(\"{}\", m.lock().unwrap());\n}",
    options: ["5", "编译错误", "运行时 panic", "6"],
    answer: 3,
    explain: "Mutex::lock() 拿到守卫（自动上锁），*g += 1 修改里面的值，守卫离开作用域自动解锁。最终输出 6。记住：lock 返回的是 Result，要处理（这里用 unwrap）。"
  },
  {
    id: "L10-09",
    level: 10,
    topic: "Rc<RefCell<T>> 组合",
    q: "Rc<RefCell<T>> 组合的用途是？",
    options: ["单线程内多个所有者共享并修改同一份数据", "多线程共享可变数据", "替代 Box", "让编译器跳过所有权检查"],
    answer: 0,
    explain: "Rc 解决“多个所有者”，RefCell 解决“不可变绑定下修改数据”（内部可变性），组合起来就是单线程共享可变数据的经典套餐。多线程版本是 Arc<Mutex<T>>。"
  },
  {
    id: "L10-10",
    level: 10,
    topic: "Arc<Mutex<T>> 多线程计数",
    q: "下面代码的输出是什么？",
    code: "use std::sync::{Arc, Mutex};\nuse std::thread;\nfn main() {\n    let c = Arc::new(Mutex::new(0));\n    let mut hs = vec![];\n    for _ in 0..10 {\n        let c2 = Arc::clone(&c);\n        hs.push(thread::spawn(move || {\n            let mut g = c2.lock().unwrap();\n            *g += 1;\n        }));\n    }\n    for h in hs { h.join().unwrap(); }\n    println!(\"{}\", c.lock().unwrap());\n}",
    options: ["0", "1", "10", "不确定（有数据竞争）"],
    answer: 2,
    explain: "10 个线程各拿一个 Arc 克隆指向同一个 Mutex，每次 +1 都持有锁，所以没有数据竞争，最终稳稳地输出 10。这是 Rust 并发的标准范式。"
  }
];
