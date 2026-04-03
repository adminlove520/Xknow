# CLAUDE.md - Xknow

> 小溪的知识管理系统 - 基于 Karpathy LLM Knowledge Bases 理念

## 项目背景

哥哥想用类似 Karpathy 的方法论建立知识管理系统：
- **raw data** → LLM 编译成 **wiki (.md)**
- **Obsidian** 作为 IDE 前端
- LLM 负责写和维护 wiki，人类很少直接编辑
- wiki 够大后直接 Q&A，不需要 RAG

## 目录结构

```
Xknow/
├── bin/
│   └── xknow.js          # CLI 入口
├── lib/
│   ├── config.js         # 配置管理（从 OpenClaw 读取 API）
│   ├── compile.js        # 编译 raw → wiki
│   ├── query.js          # Q&A 查询
│   ├── lint.js           # 健康检查
│   └── sync.js           # 同步
├── SKILLS/
│   └── xknow-skill.md    # OpenClaw Skill
├── scripts/              # 辅助脚本
└── CLAUDE.md             # AI 助手指南
```

## Obsidian Vault 位置

```
~/Obsidian/Xknow/         # Wiki 在这里
~/.xknowledgerc           # 配置在这里
```

## CLI 命令

```bash
# 安装
pnpm link --global

# 配置
xknow config --list       # 查看配置
xknow config --wiki ~/path  # 设置 Wiki 路径

# 初始化
xknow init               # 创建 Obsidian Vault

# 编译
xknow compile                    # 编译所有
xknow compile --source notes    # 只编译笔记

# Q&A
xknow query "什么是 SuperDreams?"

# 健康检查
xknow lint
```

## LLM API

**自动从 OpenClaw 读取**：
- API Key：从 `~/.openclaw/openclaw.json` 读取
- 模型：从 `agents.defaults.model` 读取

## 隐私原则

**绝不上传**：
- ~/Obsidian/Xknow/ - Wiki 数据
- ~/.xknowledgerc - 配置

**只上传 Git**：
- CLI/Skill 代码
- 不包含任何数据

## Karpathy 方法论

```
raw/ → LLM 增量编译 → wiki/
                      ↓
                Q&A 探索
                      ↓
              输出 + 沉淀 → wiki/
```

关键洞察：
- "You rarely ever write or edit the wiki manually, it's the domain of the LLM"
- wiki 够大后直接问，不用 RAG
- LLM 会自动维护索引和摘要
