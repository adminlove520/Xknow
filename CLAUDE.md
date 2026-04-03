# CLAUDE.md - xiaoxi-knowledge

> 小溪的知识管理系统 - 基于 Karpathy LLM Knowledge Bases 理念

## 项目背景

哥哥想用类似 Karpathy 的方法论建立知识管理系统：
- **raw data** → LLM 编译成 **wiki (.md)**
- **Obsidian** 作为 IDE 前端
- LLM 负责写和维护 wiki，人类很少直接编辑
- wiki 够大后直接 Q&A，不需要 RAG

## 目录结构

```
xiaoxi-knowledge/
├── bin/
│   └── xknowledge.js     # CLI 入口
├── lib/
│   ├── config.js          # 配置管理
│   ├── compile.js        # 编译 raw → wiki
│   ├── query.js          # Q&A 查询
│   ├── lint.js           # 健康检查
│   └── sync.js           # 同步到 Obsidian
├── wiki/                 # Obsidian Vault (公开上传)
│   └── ...               # 编译后的知识
└── raw/                  # 原始数据 (本地，不上传!)
    ├── articles/
    ├── papers/
    └── notes/
```

## 隐私原则

**绝对不上传**：
- memory/ - 个人日志和决策
- MEMORY.md, SOUL.md, USER.md, TOOLS.md - 身份和密钥信息
- raw/ - 原始数据
- .env - 任何密钥

**只上传**：
- wiki/ - 编译后的知识
- src/ - CLI 代码

## CLI 命令

```bash
# 配置
xknow config --list              # 查看配置
xknow config --provider openai   # 设置 LLM

# 编译
xknow compile                    # 编译所有
xknow compile --source articles  # 只编译文章

# Q&A
xknow query "什么是 SuperDreams?"

# 健康检查
xknow lint

# 同步
xknow sync --obsidian ~/Documents/Obsidian/my-vault
```

## 设计原则

1. **LLM Write, Human Review** - LLM 负责写 wiki，人类审核
2. **Incremental Compile** - 增量编译，不是全量重写
3. **Backlinks** - 笔记之间自动建立双向链接
4. **沉淀** - 每次 Q&A 输出都回写到 wiki
5. **隐私优先** - 敏感数据绝不上传

## Karpathy 方法论参考

```
raw/ → LLM 增量编译 → wiki/
                      ↓
                Q&A 探索
                      ↓
              输出 + 沉淀 → wiki/ (增强)
```

关键洞察：
- "You rarely ever write or edit the wiki manually, it's the domain of the LLM"
- wiki 够大(~100文章/400K words)后直接问，不用 RAG
- LLM 会自动维护索引和摘要
