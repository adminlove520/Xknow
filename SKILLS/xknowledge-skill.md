---
name: xknowledge
description: "小溪的知识管理 CLI - 基于 Karpathy LLM Knowledge Bases 理念。用于编译 wiki、Q&A 查询、健康检查。触发词：知识管理、wiki、compile、lint"
---

# xknowledge CLI - 小溪知识管理

> 基于 Karpathy LLM Knowledge Bases 理念

## 配置

本地配置在 `~/.xknowledgerc`（JSON 格式）

```json
{
  "wikiPath": "~/Obsidian/xiaoxi-knowledge",
  "rawPath": "~/Obsidian/xiaoxi-knowledge/raw",
  "llmProvider": "openai",
  "llmModel": "gpt-4"
}
```

## CLI 命令

### 1. 配置
```bash
xknow config --list           # 查看配置
xknow config --provider openai # 设置 LLM
```

### 2. 编译 wiki
```bash
xknow compile                  # 编译所有 raw → wiki
xknow compile --source notes   # 只编译笔记
```

### 3. Q&A 查询
```bash
xknow query "什么是 SuperDreams 架构?"  # 基于 wiki Q&A
```

### 4. 健康检查
```bash
xknow lint                     # 检查 wiki 健康度
```

### 5. 同步
```bash
xknow sync                    # 同步到 Obsidian
```

## Karpathy 方法论

```
raw/ → LLM 增量编译 → wiki/
                      ↓
                Q&A 探索
                      ↓
              输出 + 沉淀 → wiki/
```

关键洞察：
- LLM 负责写 wiki，人类很少直接编辑
- wiki 够大后直接问，不用 RAG
- 每次 Q&A 输出都沉淀回 wiki

## 使用场景

### 场景 1：整理新学的知识
```
用户：我今天学了 LLM Agents 的 memory 系统
小溪：用 xknow compile --source notes 编译新笔记
```

### 场景 2：查询知识
```
用户：之前关于 OpenClaw 的记忆在哪里？
小溪：xknow query "OpenClaw 相关记忆"
```

### 场景 3：健康检查
```
用户：我的 wiki 健康吗？
小溪：xknow lint → 检查孤立文件、重复内容
```
