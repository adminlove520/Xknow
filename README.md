# xiaoxi-knowledge 🧠

> 小溪的知识管理系统 - LLM Knowledge Base
> 
> 基于 Karpathy 的 LLM Knowledge Bases 理念

## 核心理念

- **raw data** → LLM 编译成 **wiki (.md)**
- **Obsidian** 作为 IDE 前端查看
- LLM 负责写和维护 wiki，人类负责审核
- wiki 够大后直接 Q&A，不需要 RAG

## 目录结构

```
xiaoxi-knowledge/
├── CLAUDE.md           # 项目说明
├── README.md            # 本文件
│
├── src/                # 源代码 (CLI/Scripts)
│   ├── cli/            # 命令行工具
│   └── scripts/         # 辅助脚本
│
├── wiki/               # LLM 编译的 wiki (Obsidian 库)
│   ├── 00-General/     # 通用知识
│   ├── 01-AI/          # AI 相关
│   │   ├── Claude/     # Claude 架构学习
│   │   └── Agent/      # Agent 设计
│   ├── 02-Engineering/ # 工程实践
│   └── 03-Life/       # 生活记录
│
└── raw/                # 原始数据 (待编译)
    ├── articles/       # 文章
    ├── papers/         # 论文
    ├── repos/          # 代码仓库
    └── notes/          # 随手记
```

## 设计原则

1. **LLM Write, Human Review** — LLM 负责写和维护，人类审核
2. **Incremental Compile** — 增量编译，不是全量重写
3. **Backlinks** — 笔记之间自动建立双向链接
4. **Incremental Enhance** — 每次 Q&A 输出都沉淀回 wiki

## CLI 命令

```bash
# 编译 wiki
npm run compile

# Q&A
npm run query -- "问题"

# 健康检查
npm run lint

# 同步到 Obsidian
npm run sync
```

## License

MIT
