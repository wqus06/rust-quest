const CODE_CHALLENGES = [
  // ===== 第 1 关：变量与可变性 =====
  {
    id: "C1-1",
    level: 1,
    title: "让变量可变",
    desc: "补全下划线处，使代码编译通过并输出 6。",
    template: "fn main() {\n    ___ x = 5;\n    x += 1;\n    println!(\"{}\", x);\n}",
    blanks: [
      { answers: ["let mut"], hint: "声明可变变量需要两个关键字" }
    ],
    explain: "变量默认不可变，加上 mut 才能修改它的值。let mut 是 Rust 里最常用的声明之一。"
  },
  {
    id: "C1-2",
    level: 1,
    title: "遮蔽旧变量",
    desc: "补全下划线处，使代码编译通过并输出 6。",
    template: "fn main() {\n    let x = 5;\n    ___ x = x + 1;\n    println!(\"{}\", x);\n}",
    blanks: [
      { answers: ["let"], hint: "重新声明同名变量用的关键字" }
    ],
    explain: "用 let 重新声明同名变量叫遮蔽（shadowing），新 x 的值是 6，旧 x 被盖住。"
  },
  // ===== 第 2 关：所有权 =====
  {
    id: "C2-1",
    level: 2,
    title: "深拷贝字符串",
    desc: "补全下划线处，使 s1 和 s2 都能正常打印 hello。",
    template: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1.___();\n    println!(\"{} {}\", s1, s2);\n}",
    blanks: [
      { answers: ["clone"], hint: "深拷贝的方法名，5 个字母" }
    ],
    explain: "clone() 会深拷贝堆上数据，s1 和 s2 各自独立，之后 s1 照样能用。"
  },
  {
    id: "C2-2",
    level: 2,
    title: "函数交还所有权",
    desc: "补全下划线处，使代码编译通过并输出 hi。",
    template: "fn main() {\n    let s = make();\n    println!(\"{}\", s);\n}\nfn make() -> ___ {\n    String::from(\"hi\")\n}",
    blanks: [
      { answers: ["String"], hint: "返回值的类型，一个标准库类型名" }
    ],
    explain: "函数返回 String 会把所有权转移给调用者，main 里的 s 就能正常使用。"
  },
  // ===== 第 3 关：借用与引用 =====
  {
    id: "C3-1",
    level: 3,
    title: "不可变借用传参",
    desc: "补全下划线处，使代码编译通过并输出 5，且之后还能继续用 s。",
    template: "fn main() {\n    let s = String::from(\"hello\");\n    println!(\"{}\", len(___s));\n}\nfn len(s: &String) -> usize {\n    s.len()\n}",
    blanks: [
      { answers: ["&"], hint: "借用的符号，单个字符" }
    ],
    explain: "&s 是不可变借用，只借不拿，所有权还留在 main 里，所以 s 之后照常用。"
  },
  {
    id: "C3-2",
    level: 3,
    title: "可变借用传参",
    desc: "补全下划线处，使代码编译通过并输出 hi!。",
    template: "fn main() {\n    let mut s = String::from(\"hi\");\n    add(___ s);\n    println!(\"{}\", s);\n}\nfn add(s: &mut String) {\n    s.push_str(\"!\");\n}",
    blanks: [
      { answers: ["&mut"], hint: "可变借用需要两个符号连写" }
    ],
    explain: "想让函数修改原数据，传参时要用 &mut，同时原变量也要声明为 mut，两边都要“可变”。"
  },
  // ===== 第 4 关：复合类型 =====
  {
    id: "C4-1",
    level: 4,
    title: "取出元组元素",
    desc: "补全下划线处，使代码编译通过并输出 10。",
    template: "fn main() {\n    let t = (\"a\", 10, 3.5);\n    println!(\"{}\", t.___);\n}",
    blanks: [
      { answers: ["1"], hint: "下标从 0 开始数" }
    ],
    explain: "元组用点号加下标访问，t.1 就是第二个元素 10。"
  },
  {
    id: "C4-2",
    level: 4,
    title: "结构体更新语法",
    desc: "补全下划线处，使代码编译通过并输出 a 2。",
    template: "struct User {\n    name: String,\n    age: u32,\n}\nfn main() {\n    let u1 = User { name: String::from(\"a\"), age: 1 };\n    let u2 = User { age: 2, ..___ };\n    println!(\"{} {}\", u2.name, u2.age);\n}",
    blanks: [
      { answers: ["u1"], hint: "其余字段照抄哪个变量？" }
    ],
    explain: "..u1 表示其余字段照抄 u1，u2.name 沿用“a”，age 被显式设为 2。"
  },
  // ===== 第 5 关：枚举与模式匹配 =====
  {
    id: "C5-1",
    level: 5,
    title: "if let 匹配",
    desc: "补全下划线处，使代码编译通过并输出 5。",
    template: "fn main() {\n    let x = Some(5);\n    ___ let Some(v) = x {\n        println!(\"{}\", v);\n    }\n}",
    blanks: [
      { answers: ["if"], hint: "只关心一种模式时的条件关键字" }
    ],
    explain: "if let 是只匹配一种模式时的简写，x 是 Some(5) 时 v 绑定为 5。"
  },
  {
    id: "C5-2",
    level: 5,
    title: "match 兜底分支",
    desc: "补全下划线处，使代码编译通过并输出 other。",
    template: "fn main() {\n    let n = 99;\n    match n {\n        1 => println!(\"one\"),\n        ___ => println!(\"other\"),\n    }\n}",
    blanks: [
      { answers: ["_"], hint: "匹配其他所有情况的通配符，单个字符" }
    ],
    explain: "_ 是通配符模式，兜底匹配所有情况，也保证了 match 的穷尽性。"
  },
  // ===== 第 6 关：错误处理 =====
  {
    id: "C6-1",
    level: 6,
    title: "问号运算符",
    desc: "补全下划线处，使出错时自动返回 Err，成功时取出文件内容。",
    template: "fn read() -> Result<String, std::io::Error> {\n    let s = std::fs::read_to_string(\"a.txt\")___;\n    Ok(s)\n}\nfn main() {\n    match read() {\n        Ok(_) => println!(\"ok\"),\n        Err(_) => println!(\"err\"),\n    }\n}",
    blanks: [
      { answers: ["?"], hint: "错误传播的语法糖，单个符号" }
    ],
    explain: "? 遇到 Err 就提前返回错误，遇到 Ok 就拆包取值，是错误传播最常用的写法。"
  },
  {
    id: "C6-2",
    level: 6,
    title: "失败时用默认值",
    desc: "补全下划线处，使代码编译通过并输出 0（而不是 panic）。",
    template: "fn main() {\n    let x: Result<i32, &str> = Err(\"e\");\n    println!(\"{}\", x.___(0));\n}",
    blanks: [
      { answers: ["unwrap_or"], hint: "方法名：unwrap 加上下划线加 or" }
    ],
    explain: "unwrap_or 在 Err 时返回你给的默认值，适合“失败了就用兜底值”的场景。"
  },
  // ===== 第 7 关：集合与迭代器 =====
  {
    id: "C7-1",
    level: 7,
    title: "vec! 宏",
    desc: "补全下划线处，使代码编译通过并输出 3。",
    template: "fn main() {\n    let v = ___![1, 2, 3];\n    println!(\"{}\", v.len());\n}",
    blanks: [
      { answers: ["vec"], hint: "创建 Vec 的宏名，3 个字母" }
    ],
    explain: "vec! 是快速创建 Vec 的宏，vec![1, 2, 3] 等价于新建后逐个 push。"
  },
  {
    id: "C7-2",
    level: 7,
    title: "借用迭代",
    desc: "补全下划线处，使循环结束后 v 还能继续使用。",
    template: "fn main() {\n    let v = vec![1, 2, 3];\n    for x in v.___() {\n        println!(\"{}\", x);\n    }\n    println!(\"{}\", v.len());\n}",
    blanks: [
      { answers: ["iter"], hint: "只借不拿的迭代方法，4 个字母" }
    ],
    explain: "v.iter() 是不可变借用迭代，所有权还在 v 手里；直接 for x in v 会拿走所有权。"
  },
  // ===== 第 8 关：泛型与 Trait =====
  {
    id: "C8-1",
    level: 8,
    title: "声明泛型参数",
    desc: "补全下划线处，使代码编译通过并输出 5。",
    template: "fn first___(x: T) -> T {\n    x\n}\nfn main() {\n    println!(\"{}\", first(5));\n}",
    blanks: [
      { answers: ["<T>"], hint: "声明类型参数的尖括号写法" }
    ],
    explain: "fn first<T>(x: T) -> T 声明了一个类型参数 T，调用时编译器自动推断具体类型。"
  },
  {
    id: "C8-2",
    level: 8,
    title: "派生 Debug",
    desc: "补全下划线处，使代码编译通过并输出 P { x: 1 }。",
    template: "#[___(Debug)]\nstruct P {\n    x: i32,\n}\nfn main() {\n    println!(\"{:?}\", P { x: 1 });\n}",
    blanks: [
      { answers: ["derive"], hint: "自动实现 trait 的属性名，6 个字母" }
    ],
    explain: "#[derive(Debug)] 让编译器自动实现 Debug，这样就能用 {:?} 打印结构体。"
  },
  // ===== 第 9 关：生命周期 =====
  {
    id: "C9-1",
    level: 9,
    title: "手写生命周期标注",
    desc: "补全下划线处，使代码编译通过并输出 abc。",
    template: "fn longest<'a>(x: ___, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\nfn main() {\n    println!(\"{}\", longest(\"a\", \"abc\"));\n}",
    blanks: [
      { answers: ["&'a str"], hint: "和 y 一样的引用类型" }
    ],
    explain: "两个输入引用、一个输出引用时必须手写标注，'a 说明返回的引用和 x、y 同寿命。"
  },
  {
    id: "C9-2",
    level: 9,
    title: "结构体生命周期参数",
    desc: "补全下划线处，使代码编译通过并输出 hi。",
    template: "struct R<___> {\n    r: &'a str,\n}\nfn main() {\n    let s = String::from(\"hi\");\n    let x = R { r: &s };\n    println!(\"{}\", x.r);\n}",
    blanks: [
      { answers: ["'a"], hint: "生命周期参数的写法，一个撇号加字母" }
    ],
    explain: "结构体里存引用必须先声明生命周期参数 R<'a>，告诉编译器这个结构体不能比它借用的数据活得更久。"
  },
  // ===== 第 10 关：智能指针与并发 =====
  {
    id: "C10-1",
    level: 10,
    title: "Box 装箱",
    desc: "补全下划线处，使代码编译通过并输出 5。",
    template: "fn main() {\n    let b = ___(5);\n    println!(\"{}\", *b);\n}",
    blanks: [
      { answers: ["Box::new"], hint: "类型名加双冒号加 new" }
    ],
    explain: "Box::new(5) 把 5 放到堆上，*b 解引用取出里面的值。"
  },
  {
    id: "C10-2",
    level: 10,
    title: "move 闭包进线程",
    desc: "补全下划线处，使代码编译通过并输出 hi。",
    template: "fn main() {\n    let s = String::from(\"hi\");\n    let h = std::thread::spawn(___ || {\n        println!(\"{}\", s);\n    });\n    h.join().unwrap();\n}",
    blanks: [
      { answers: ["move"], hint: "把捕获变量的所有权转移进闭包的关键字，4 个字母" }
    ],
    explain: "thread::spawn 要求闭包是 'static 的，move 把 s 的所有权转移进线程，满足要求。"
  }
];
