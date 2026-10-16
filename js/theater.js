"use strict";
/* ============================================================
 * 内存剧场：单步执行代码，同步看栈 / 堆内存状态变化
 * 每个 step 的 stack / heap 都是该时刻的完整状态（渲染时直接替换）。
 * status: ok / moved / ref / refmut / ended
 * ============================================================ */

const THEATER = [
  {
    id: "T1",
    level: 2,
    title: "Move：所有权的搬家",
    desc: "String 的所有权从 s1 转移到 s2，看看内存里发生了什么。",
    code: [
      "fn main() {",
      '    let s1 = String::from("hello");',
      "    let s2 = s1;",
      '    println!("{}", s2);',
      "}"
    ],
    steps: [
      {
        line: 0,
        note: "main 开始运行，栈和堆都还是空的。",
        stack: [],
        heap: []
      },
      {
        line: 1,
        note: "s1 在栈上安家：它不直接存 hello，而是存着三件套——指向堆的指针、长度和容量。",
        stack: [
          { name: "s1", detail: "ptr → 堆 | len 5 | cap 5", status: "ok" }
        ],
        heap: [
          { label: '"hello"', owner: "s1", status: "ok" }
        ]
      },
      {
        line: 2,
        note: "s2 = s1 触发 move：所有权从 s1 搬到 s2。注意堆上的 hello 纹丝没动，动的只是栈上的“遥控器”；s1 的遥控器当场作废。",
        stack: [
          { name: "s1", detail: "已 move，失效", status: "moved" },
          { name: "s2", detail: "ptr → 堆 | len 5 | cap 5", status: "ok" }
        ],
        heap: [
          { label: '"hello"', owner: "s2", status: "ok" }
        ]
      },
      {
        line: 3,
        note: "打印 s2：hello，正常输出。如果这里写的是 s1，编译器会直接报错——值已经被搬走了。",
        stack: [
          { name: "s1", detail: "已 move，失效", status: "moved" },
          { name: "s2", detail: "ptr → 堆 | len 5 | cap 5", status: "ok" }
        ],
        heap: [
          { label: '"hello"', owner: "s2", status: "ok" }
        ]
      },
      {
        line: 4,
        note: "总结：堆上的 hello 永远只有一份，move 只是把栈上的“遥控器”递给 s2；s1 的遥控器作废；main 结束时 s2 被 drop，堆内存自动回收——Rust 不需要 GC，靠的就是这套规则。",
        stack: [],
        heap: []
      }
    ]
  },
  {
    id: "T2",
    level: 2,
    title: "clone：深拷贝",
    desc: "想要两份一模一样的数据？clone 会把堆上的东西完整复制一份。",
    code: [
      "fn main() {",
      '    let s1 = String::from("hello");',
      "    let s2 = s1.clone();",
      '    println!("{} {}", s1, s2);',
      "}"
    ],
    steps: [
      {
        line: 0,
        note: "main 开始运行，内存空空如也。",
        stack: [],
        heap: []
      },
      {
        line: 1,
        note: "s1 创建：栈上是指针三件套，堆上是 hello。",
        stack: [
          { name: "s1", detail: "ptr → 堆 | len 5", status: "ok" }
        ],
        heap: [
          { label: '"hello"', owner: "s1", status: "ok" }
        ]
      },
      {
        line: 2,
        note: "s1.clone() 把堆上的数据完整复制了一份：现在堆里有两个 hello，s1 和 s2 各管各的，谁都有效。",
        stack: [
          { name: "s1", detail: "ptr → 堆 | len 5", status: "ok" },
          { name: "s2", detail: "ptr → 堆（新的一份）| len 5", status: "ok" }
        ],
        heap: [
          { label: '"hello"', owner: "s1", status: "ok" },
          { label: '"hello"（副本）', owner: "s2", status: "ok" }
        ]
      },
      {
        line: 3,
        note: "两个一起打印：hello hello——s1 没被搬走，所以还能用。",
        stack: [
          { name: "s1", detail: "ptr → 堆 | len 5", status: "ok" },
          { name: "s2", detail: "ptr → 堆（新的一份）| len 5", status: "ok" }
        ],
        heap: [
          { label: '"hello"', owner: "s1", status: "ok" },
          { label: '"hello"（副本）', owner: "s2", status: "ok" }
        ]
      },
      {
        line: 4,
        note: "总结：clone 是深拷贝——堆数据复制一份，代价是多花内存和时间；换来的是两个变量都继续有效。需要复制时用它，但别滥用：能 move 就别 clone。",
        stack: [],
        heap: []
      }
    ]
  },
  {
    id: "T3",
    level: 3,
    title: "不可变借用",
    desc: "多个引用可以同时借用同一份数据——只要没人想改它。",
    code: [
      "fn main() {",
      '    let s = String::from("hi");',
      "    let r1 = &s;",
      "    let r2 = &s;",
      '    println!("{} {} {}", s, r1, r2);',
      "}"
    ],
    steps: [
      {
        line: 0,
        note: "main 开始，内存是空的。",
        stack: [],
        heap: []
      },
      {
        line: 1,
        note: "s 创建：栈上三件套，堆上是 hi。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 2,
        note: "r1 = &s：r1 是栈上的一个引用，指向 s。借用期间 r1 只能读、不能改。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2", status: "ok" },
          { name: "r1", detail: "& → s", status: "ref" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 3,
        note: "r2 = &s：不可变借用可以有多个！r1、r2 同时借用 s，s 自己也还能用。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2", status: "ok" },
          { name: "r1", detail: "& → s", status: "ref" },
          { name: "r2", detail: "& → s", status: "ref" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 4,
        note: "三个一起打印：hi hi hi，全部合法。只要没人想改数据，大家都能看。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2", status: "ok" },
          { name: "r1", detail: "& → s", status: "ref" },
          { name: "r2", detail: "& → s", status: "ref" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 5,
        note: "总结：不可变借用（&）可以同时存在任意多个，代价是借用期间谁都不能修改 s。多个读者、零个写者——这就是 Rust 借用规则的第一条。",
        stack: [],
        heap: []
      }
    ]
  },
  {
    id: "T4",
    level: 3,
    title: "可变借用与 NLL",
    desc: "同一时间只能有一个 &mut；而且借用在最后一次使用后就结束了。",
    code: [
      "fn main() {",
      '    let mut s = String::from("hi");',
      "    let r = &mut s;",
      '    r.push_str("!");',
      '    println!("{}", s);',
      "}"
    ],
    steps: [
      {
        line: 0,
        note: "main 开始，内存是空的。",
        stack: [],
        heap: []
      },
      {
        line: 1,
        note: "mut 的 s 创建：和之前一样，栈上三件套，堆上是 hi。mut 表示它允许被修改。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2（mut）", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 2,
        note: "r = &mut s：r 独占了 s。这段时间 s 本人被“冻结”了——想用 s？先等 r 的借用结束。而且同一时间不可能再有第二个 &mut。",
        stack: [
          { name: "s", detail: "ptr → 堆 | 被 r 独占借用 ⏸", status: "ok" },
          { name: "r", detail: "&mut → s", status: "refmut" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 3,
        note: 'r.push_str("!")：通过 r 改了堆上的数据，hi 变成了 hi!。注意堆变了，但栈上的指针都没动。',
        stack: [
          { name: "s", detail: "ptr → 堆 | 被 r 独占借用 ⏸", status: "ok" },
          { name: "r", detail: "&mut → s", status: "refmut" }
        ],
        heap: [
          { label: '"hi!"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 4,
        note: "r 的最后一次使用是上一行，所以借用在这里已经结束（NLL）：s 解冻，打印 hi! 成功——不用等到大括号结束。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 3（mut）", status: "ok" },
          { name: "r", detail: "&mut → s（借用已结束）", status: "ended" }
        ],
        heap: [
          { label: '"hi!"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 5,
        note: "总结：同一时间只能有一个可变借用（&mut），且不能与不可变借用共存；NLL（非词法作用域生命周期）让借用在最后一次使用后就结束——所以第 5 行 s 又能用了。如果 r 在第 5 行之后还被用到，这里就会编译报错。",
        stack: [],
        heap: []
      }
    ]
  },
  {
    id: "T5",
    level: 2,
    title: "函数传参即 move",
    desc: "把变量传给函数？所有权也跟着搬进去了。",
    code: [
      "fn main() {",
      '    let s = String::from("hi");',
      "    takes(s);",
      "}",
      "fn takes(s: String) {",
      '    println!("{}", s);',
      "}"
    ],
    steps: [
      {
        line: 0,
        note: "main 开始，内存是空的。",
        stack: [],
        heap: []
      },
      {
        line: 1,
        note: "main 的 s 创建：栈上三件套，堆上是 hi。",
        stack: [
          { name: "s（main）", detail: "ptr → 堆 | len 2", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "s（main）", status: "ok" }
        ]
      },
      {
        line: 2,
        note: "takes(s)：调用函数时，s 的所有权被 move 进了函数。main 的 s 当场失效——传参也是搬家，不是借东西看一眼。",
        stack: [
          { name: "s（main）", detail: "已 move 进 takes", status: "moved" }
        ],
        heap: [
          { label: '"hi"', owner: "s（takes）", status: "ok" }
        ]
      },
      {
        line: 5,
        note: "进入 takes 内部：它的参数 s（和 main 的 s 只是同名）现在是合法的所有者，打印 hi 成功。",
        stack: [
          { name: "s（main）", detail: "已 move", status: "moved" },
          { name: "s（takes）", detail: "参数 | ptr → 堆 | len 2", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "s（takes）", status: "ok" }
        ]
      },
      {
        line: 6,
        note: "takes 返回：它的参数 s 离开作用域被 drop，堆上的 hi 被回收。main 里可是什么都没剩下。",
        stack: [
          { name: "s（main）", detail: "已 move", status: "moved" }
        ],
        heap: []
      },
      {
        line: 3,
        note: "总结：函数传参就是 move——所有权进了函数，main 就永远失去了 s。想让函数用完还回来？要么让函数返回所有权，要么传引用 &s。",
        stack: [
          { name: "s（main）", detail: "已 move", status: "moved" }
        ],
        heap: []
      }
    ]
  },
  {
    id: "T6",
    level: 2,
    title: "函数返回所有权",
    desc: "函数可以把所有权“交出来”，调用者直接接住。",
    code: [
      "fn main() {",
      "    let s = make();",
      '    println!("{}", s);',
      "}",
      "fn make() -> String {",
      '    String::from("hi")',
      "}"
    ],
    steps: [
      {
        line: 0,
        note: "main 开始，内存是空的。",
        stack: [],
        heap: []
      },
      {
        line: 1,
        note: "执行到 let s = make()：先跳进 make 函数里干活，s 要等函数返回才有值。",
        stack: [],
        heap: []
      },
      {
        line: 5,
        note: "make 在堆上创建了 hi——注意这行没有分号，它就是函数的返回值，所有权暂时在返回值手里。",
        stack: [
          { name: "临时值", detail: "make 的返回值 | ptr → 堆", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "make 的返回值", status: "ok" }
        ]
      },
      {
        line: 1,
        note: "make 返回的瞬间，所有权直接“交”给了 main 的 s：堆上的 hi 原地不动，只是换了主人，没有拷贝。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 2,
        note: "打印 s：hi，成功。s 是货真价实的所有者，想怎么用都行。",
        stack: [
          { name: "s", detail: "ptr → 堆 | len 2", status: "ok" }
        ],
        heap: [
          { label: '"hi"', owner: "s", status: "ok" }
        ]
      },
      {
        line: 3,
        note: "总结：函数可以通过返回值把所有权“交出来”——这是转移所有权的第二种方式（第一种是 move 进函数）。靠着这套规则，内存管理全自动完成，不需要 GC。",
        stack: [],
        heap: []
      }
    ]
  }
];
