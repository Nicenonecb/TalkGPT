# TalkGPT

TalkGPT 是一个面向语言学习的本地部署对话应用，通过接入 OpenAI API 提供场景化对话、语音合成与学习记录管理。

## 功能亮点

- 场景化对话：内置主题场景，快速开启学习对话
- 会话管理：支持多会话切换，历史记录存储在浏览器 IndexedDB
- 语音合成：支持 OpenAI TTS，可配置语音模型、声音与语速
- 学习工具：生词本与收藏句子，方便复盘与积累

## 技术栈

- Next.js 14 + React 18
- Ant Design + Tailwind CSS
- IndexedDB 本地存储
- @lobehub/tts 语音合成 SDK

## 快速开始

1. 安装依赖

```bash
npm install
```

2. 启动开发环境

```bash
npm run dev
```

3. 访问应用

打开 http://localhost:3000

## 应用内配置

进入应用的“配置”面板，填写并保存以下信息：

- OpenAI API Key
- OpenAI Base URL（支持代理或镜像地址）
- 语言模型、语音模型、声音、随机度、语速、学习语言

配置会存储在浏览器 IndexedDB，仅在本地生效。

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 目录结构

- app/api：API 封装（文本对话、语音合成、本地存储）
- app/components：通用组件
- app/config：配置项与场景数据
- app/util：上下文与状态管理
- app/home、app/chat、app/sentences、app/vocabulary：功能页面

## 部署

推荐使用 Vercel 部署，保持默认的 Next.js 构建流程即可。
