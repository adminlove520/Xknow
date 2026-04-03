# Xknow-CLI 🧠

> AI-First Knowledge Management for OpenClaw Users - Based on Karpathy LLM Knowledge Bases concept

**Xknow-CLI** is an automated knowledge management tool designed for AI agents and their owners. It follows the principle: **"LLM writes and maintains the Wiki, Humans ask and discover."**

## Key Features

- 🚀 **Incremental Compilation**: Only processes new or modified raw data using MD5 hashing.
- 🔍 **Context-Aware Q&A**: Leverages the full KB context for deep queries (beyond standard RAG limitations).
- 🛡️ **AI Health Check**: Automatically audits your Wiki for orphans, duplicates, and missing connections.
- 🖇️ **OpenClaw Integration**: Automatically bridges your existing OpenClaw credentials and model settings.
- 📂 **Obsidian Friendly**: Uses Obsidian as the IDE/frontend for your knowledge. Your data stays local.

## Directory Structure

```text
~/Obsidian/Xknow-Wiki/       # Your Knowledge Base (Local)
├── raw/                     # Chaos: Your raw input (articles, papers, notes)
├── wiki/                    # Order: LLM-compiled structured wiki pages
├── INDEX.md                 # Global navigation index
└── .xknow-history.json      # Compilation state & history
```

## Quick Start

### 1. Install

**Via NPM:**
```bash
npm install -g xknow-cli
```

**Via PNPM:**
```bash
pnpm add -g xknow-cli
```

**For Development:**
```bash
pnpm install && pnpm link --global
```

### 2. Initialize

```bash
xknow-cli init
```

### 3. Feed the Chaos

Drop your raw Markdown, PDF (via extract), or text files into `~/Obsidian/Xknow-Wiki/raw/notes/` (or other subdirs).

### 4. Compile to Order

```bash
xknow-cli compile
```

### 5. Ask Anything

```bash
xknow-cli query "What are the core design patterns used in my recent projects?"
```

## Karpathy Methodology

According to Andrej Karpathy's [Twitter insights](https://x.com/karpathy/status/2039805659525644595):

1. **LLM as Editor**: Writing and maintaining the Wiki is the LLM's job, not yours.
2. **Beyond RAG**: For KBs within 100k tokens, providing the full context to a large LLM outperforms traditional RAG.
3. **Autonomous Links**: The LLM automatically generates [[Wikilinks]] and back-references between concepts.

## Development

- Built with Node.js 18+ (ES Modules)
- Uses `commander`, `chalk`, `ora`, `openai`, `globby`
- CI/CD: Automated NPM release via GitHub Actions on `v*` tag.

## License

MIT
