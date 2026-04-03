---
name: xknowledge
description: "小溪的知识管理 CLI - 基于 Karpathy LLM Knowledge Bases 理念。用于编译 wiki、Q&A 查询、健康检查。触发词：知识管理、wiki、compile、lint、xknow"
---

# xknowledge CLI - 小溪知识管理

> 基于 Karpathy LLM Knowledge Bases 理念
> 
> **核心**：LLM 编译 wiki → Q&A → 沉淀增强

## 配置

### 1. LLM API（自动从 OpenClaw 读取）

xknow 会自动读取 OpenClaw 的 API key 和模型：
- API Key：从 `~/.openclaw/openclaw.json` 读取
- 模型：从 `agents.defaults.model` 读取

### 2. Obsidian Vault

```bash
# 初始化（创建独立 Vault）
xknow init

# 查看配置
xknow config --list
```

**Vault 位置**：`~/Obsidian/xiaoxi-knowledge/`

**目录结构**：
```
~/Obsidian/xiaoxi-knowledge/
├── raw/               # 原始数据
│   ├── articles/      # 文章
│   ├── papers/       # 论文
│   ├── repos/        # 代码仓库
│   └── notes/        # 随手记
├── INDEX.md          # Wiki 索引
├── Claude/           # Claude 架构学习
├── Agent/            # Agent 设计
├── Engineering/     # 工程实践
└── Life/            # 生活记录
```

## CLI 命令

### init - 初始化 Vault
```bash
xknow init              # 创建 Obsidian Vault
xknow init --force     # 强制重新创建
```

### config - 配置
```bash
xknow config --list     # 查看配置（包含 OpenClaw 信息）
```

### compile - 编译
```bash
xknow compile                  # 编译所有 raw → wiki
xknow compile --source notes   # 只编译笔记
xknow compile --source articles # 只编译文章
```

### query - Q&A
```bash
xknow query "什么是 SuperDreams 架构?"
```

### lint - 健康检查
```bash
xknow lint  # 检查孤立文件、重复内容
```

## Karpathy 方法论

```
raw/ → LLM 增量编译 → wiki/
                      ↓
                Q&A 探索
                      ↓
              输出 + 沉淀 → wiki/
```

### 关键设计

| 环节 | 做法 |
|------|------|
| **Ingest** | raw → LLM 编译，不是复制 |
| **Wiki** | LLM 写和维护，人类辅助 |
| **Q&A** | wiki 够大后直接问，不用 RAG |
| **沉淀** | 每次输出回写到 wiki |

## 使用场景

### 场景 1：初始化新环境
```
用户：初始化知识管理
小溪：xknow init → 创建 Obsidian Vault
```

### 场景 2：整理新知识
```
用户：我今天学了 LLM Agents 的 memory 系统
小溪：
1. 写笔记到 ~/Obsidian/xiaoxi-knowledge/raw/notes/
2. xknow compile --source notes → LLM 编译到 wiki
3. 建立 backlinks 和索引
```

### 场景 3：查询知识
```
用户：之前关于 OpenClaw 的记忆在哪里？
小溪：xknow query "OpenClaw 架构相关记忆"
```

### 场景 4：健康检查
```
用户：我的 wiki 健康吗？
小溪：xknow lint → 检查孤立文件、重复内容
```

## 隐私原则

- **数据在本地**：~/Obsidian/xiaoxi-knowledge/
- **Git 不存储数据**：只存 CLI/Skill 代码
- **API Key 来自 OpenClaw**：不额外配置
