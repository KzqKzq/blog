---
id: 'post-typescript-tips'
title: 'TypeScript 深度心法'
description: '从类型编排到 API 设计的落地策略，让 TS 成为守护质量的“静态防护网”。'
date: '2024-12-05'
readingTime: '7 min'
tags:
  - 'TypeScript'
  - 'DX'
  - '工程'
category: 'tech'
accent: 'cool'
---

## 三个实践切口
- 声明数据契约：先写 interface，再写实现，保持领域词汇一致。
- 类型收敛：公共 API 尽量输出只读、精简的类型，内部再扩展。
- 工具类型：利用 `satisfies`、`ReturnType`、`Extract` 做安全推导。

### 工程落地
1. 开启 `strict`，并用 `tsc --noEmit` 作为 CI 的“第二道保险”。
2. 公共模块导出类型别名，避免外部依赖内部实现细节。
3. 用 ESLint 的 unused-vars 规则约束“无意的 any”与“悬空的 props”。
