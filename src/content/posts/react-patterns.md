---
id: 'post-react-patterns'
title: 'React 设计模式最佳实践'
description: '从 Compound Components、Render Props 到自定义 Hooks，拆解如何让组件体系既柔韧又易维护。'
date: '2024-12-10'
readingTime: '8 min'
tags:
  - 'React'
  - '模式'
  - '前端架构'
category: 'tech'
accent: 'brand'
featured: true
---

## 为什么还要谈设计模式
UI 复杂度增长的第一信号是 props 四处漂移。约束数据流、约束边界，组件才有“质感”。

### 关键模式
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。
### 关键模式1
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。
### 关键模式2
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。
### 关键模式3
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。
### 关键模式4
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。
### 关键模式5
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。


### 实战建议
1. 先画状态机，再决定 props；避免“猜测式” API。
2. 多用不可变数据与 memo，保留组件的可预测性。
3. 给每个模式写 1 条使用准则，团队评审时对照执行。
