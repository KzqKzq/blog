---
id: 'post-css-neumorphism'
title: 'CSS Neumorphism 的现代实现'
description: '基于双层光影、玻璃拟态与噪声纹理，构建轻量而不油腻的触感界面。'
date: '2024-12-08'
readingTime: '6 min'
tags:
  - 'CSS'
  - 'Neumorphism'
  - 'UI'
category: 'tech'
accent: 'amber'
---

## 现代新拟物的 3 个核心
- **光影对冲**：左上高光 + 右下阴影，透明度控制在 0.08~0.16 之间。
- **玻璃雾化**：使用 `backdrop-filter: blur(16px)` + 半透明边框，避免强烈的玻璃边缘。
- **柔软半径**：12px-24px 的圆角让元素“浑然一体”，搭配 0.2s 的过渡。

### 实现清单
1. 统一背景色：#eeeeee 基调，上铺微弱噪声 SVG 纹理。
2. 定义 token：`--shadow-raised`、`--shadow-pressed`、`--shadow-glass`。
3. 微交互：hover 上浮 2~4px，active 轻微按压 + inset 阴影。
4. 可读性：标题用装饰性字体，正文坚持几何无衬线，避免“花哨即视感”。
