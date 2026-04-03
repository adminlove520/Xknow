# Xknow-CLI 🧠

> AI-First Knowledge Management for OpenClaw Users - Based on Karpathy LLM Knowledge Bases concept

**Xknow-CLI** is an automated knowledge management tool designed for AI agents and their owners. It follows the principle: **"LLM writes and maintains the Wiki, Humans ask and discover."**

## Key Features

- 🚀 **Incremental Compilation**: Only processes new or modified raw data using MD5 hashing.
- 🔍 **Context-Aware Q&A**: Leverages the full KB context for deep queries (beyond standard RAG limitations).
- 🛡️ **AI Health Check**: Automatically audits your Wiki for orphans, duplicates, and missing connections.
- 🔌 **MCP Support**: Native Model Context Protocol server support for integration with AI agents (Claude Desktop, OpenClaw, etc.).
- 🖇️ **OpenClaw Integration**: Automatically bridges your existing OpenClaw credentials and model settings (found in `~/.openclaw/openclaw.json`).
- 📂 **Obsidian Friendly**: Uses Obsidian as the IDE/frontend for your knowledge. Your data stays local.

## Model Context Protocol (MCP) Integration

Xknow-CLI acts as an MCP server, allowing AI agents to directly use your knowledge base as a set of tools.

### Setup in Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "xknow": {
      "command": "node",
      "args": ["/PATH/TO/Xknow/bin/xknow-mcp.js"]
    }
  }
}
```

### Available MCP Tools
- `xknow_query`: Intelligent Q&A on your Wiki.
- `xknow_search`: Fast local keyword lookup.
- `xknow_compile`: Transform raw chaos into ordered knowledge.
- `xknow_ingest`: Add new sources to your knowledge base.
- `xknow_lint`: Perform an AI librarian health audit.

## Configuration & Credentials

**Xknow-CLI** is designed to work with **zero configuration** for OpenClaw users. It automatically looks for your API keys and models in:
`~/.openclaw/openclaw.json`

### Manual Setup (Without OpenClaw)

If you're not an OpenClaw user, you can set the following environment variables:

```bash
export OPENAI_API_KEY="your-api-key"
export OPENAI_BASE_URL="https://api.openai.com/v1"
export OPENAI_MODEL="gpt-4o"
```

You can verify your configuration at any time by running:
```bash
xknow-cli config --list
```

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

### 5. Ask Anything (AI Synthesis)

```bash
xknow-cli query "What are the core design patterns used in my recent projects?" --format slides --save
```

### 6. Fast Search (Local/Offline)

```bash
xknow-cli search "LLM"
```

### 7. Diagnose Setup

```bash
xknow-cli doctor
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
