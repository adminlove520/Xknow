# xiaoxi-knowledge 🧠

> 小溪的知识管理 CLI/Skill - 基于 Karpathy LLM Knowledge Bases 理念

**目的**：给小溪用的知识管理工具，不是数据存储仓库

## 目录结构

```
xiaoxi-knowledge/          # ← Git 仓库只存这些
├── SKILLS/                # OpenClaw Skill
│   └── xknowledge-skill.md
├── bin/                   # CLI 入口
│   └── xknowledge.js
├── lib/                   # 核心功能
│   ├── config.js
│   ├── compile.js
│   ├── query.js
│   ├── lint.js
│   └── sync.js
├── scripts/               # 辅助脚本
├── CLAUDE.md              # AI 助手指南
├── README.md
└── package.json

# 本地数据（不在 git 里！）
~/Obsidian/xiaoxi-knowledge/  # wiki 在这里
~/.xknowledgerc              # 配置在这里
```

## 设计原则

1. **本地优先** - 数据在本地 Obsidian，不上传 git
2. **LLM 主导** - LLM 负责写 wiki，人类辅助
3. **增量编译** - 不是全量重写
4. **隐私优先** - 敏感数据绝不上传

## CLI 命令

```bash
# 安装
pnpm link --global

# 配置
xknow config --list

# 编译 wiki
xknow compile --source notes

# Q&A
xknow query "问题"

# 健康检查
xknow lint

# 同步
xknow sync
```

## Karpathy 方法论

```
raw/ → LLM 增量编译 → wiki/
                      ↓
                Q&A 探索
                      ↓
              输出 + 沉淀 → wiki/
```

## License

MIT
