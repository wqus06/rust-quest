/* 代码排序题库：lines 会被打乱，玩家点击排回正确顺序 */
const ORDERS = [
  {
    id: "O1", level: 1,
    title: "可变变量三步走",
    hint: "先声明，再修改，最后打印。",
    lines: [
      "fn main() {",
      "    let mut x = 5;",
      "    x += 1;",
      "    println!(\"{}\", x);",
      "}"
    ]
  },
  {
    id: "O2", level: 2,
    title: "把所有权交给函数",
    hint: "main 里创建 String，调用函数时 move 进去，函数负责打印。",
    lines: [
      "fn main() {",
      "    let s = String::from(\"hi\");",
      "    takes(s);",
      "}",
      "fn takes(s: String) {",
      "    println!(\"{}\", s);",
      "}"
    ]
  },
  {
    id: "O3", level: 5,
    title: "match 全分支",
    hint: "match 的每个分支用逗号分隔，别忘了兜底分支。",
    lines: [
      "fn main() {",
      "    let n = 2;",
      "    match n {",
      "        1 => println!(\"one\"),",
      "        2 => println!(\"two\"),",
      "        _ => println!(\"other\"),",
      "    }",
      "}"
    ]
  },
  {
    id: "O4", level: 6,
    title: "用 ? 传递错误",
    hint: "? 把 Err 直接返回给调用者，成功则拆出 Ok 里的值。",
    lines: [
      "fn read() -> Result<String, std::io::Error> {",
      "    let s = std::fs::read_to_string(\"a.txt\")?;",
      "    Ok(s)",
      "}"
    ]
  },
  {
    id: "O5", level: 4,
    title: "定义并使用结构体",
    hint: "先定义 struct，再在 main 里构造实例。",
    lines: [
      "struct User {",
      "    name: String,",
      "    age: u8,",
      "}",
      "fn main() {",
      "    let u = User { name: String::from(\"a\"), age: 20 };",
      "    println!(\"{}\", u.name);",
      "}"
    ]
  },
  {
    id: "O6", level: 8,
    title: "为结构体实现 Trait",
    hint: "顺序：trait 定义 → 结构体 → impl Trait for 结构体。",
    lines: [
      "trait Speak {",
      "    fn speak(&self);",
      "}",
      "struct Dog;",
      "impl Speak for Dog {",
      "    fn speak(&self) {",
      "        println!(\"woof\");",
      "    }",
      "}"
    ]
  },
  {
    id: "O7", level: 7,
    title: "借用遍历 Vec",
    hint: "用 &v 借用遍历，这样 v 之后还能用。",
    lines: [
      "fn main() {",
      "    let v = vec![1, 2, 3];",
      "    for x in &v {",
      "        println!(\"{}\", x);",
      "    }",
      "}"
    ]
  },
  {
    id: "O8", level: 10,
    title: "开一个线程",
    hint: "先 use，再 spawn，最后 join 等它跑完。",
    lines: [
      "use std::thread;",
      "fn main() {",
      "    let h = thread::spawn(|| {",
      "        println!(\"hi\");",
      "    });",
      "    h.join().unwrap();",
      "}"
    ]
  }
];
