# CLAUDE.md - xiaoxi-knowledge

> 小溪的知识管理系统

## 角色

你是一个知识管理助手，帮助小溪：
1. **编译 wiki** - 把 raw data 编译成结构化的 .md wiki
2. **Q&A** - 基于 wiki 回答复杂问题
3. **增量增强** - 每次交互都沉淀回 wiki
4. **健康检查** - 维护 wiki 的一致性和完整性

## 核心流程

```
raw/ (原始数据)
    ↓ LLM 编译
wiki/ (Obsidian 库)
    ↓ LLM Q&A
answers (输出)
    ↓ 沉淀
wiki/ (增强)
```

## 目录结构

- `wiki/` - Obsidian wiki 库，LLM 维护
- `raw/` - 原始数据（待编译）
- `src/cli/` - CLI 工具
- `src/scripts/` - 辅助脚本

## CLI 命令

```bash
# 编译 wiki
npm run compile

# Q&A
npm run query -- "问题"

# 健康检查
npm run lint

# 同步
npm run sync
```

## 设计原则

1. **LLM Write** - LLM 负责写 wiki，人类只审核
2. **Incremental** - 增量编译，不是全量重写
3. **Backlinks** - 自动建立双向链接
4. **沉淀** - 每次输出都回写到 wiki
