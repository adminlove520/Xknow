# CLAUDE.md - Xknow-CLI

> AI-First Knowledge Management for OpenClaw Lobsters - Based on Karpathy LLM Knowledge Bases concept

## Project Concept

Xknow-CLI is a generic knowledge management system for OpenClaw users:
- **raw/ (Chaos)** -> LLM Compiles to -> **wiki/ (Order)**
- **Obsidian** as the primary IDE/frontend.
- LLM handles writing, maintenance, and inter-document linking.
- For small KBs (<100k tokens), uses full context for intelligent Q&A (beyond RAG).

## Directory Structure

```text
Xknow-CLI/
├── .github/workflows/
│   └── release.yml        # CI/CD (GitHub Action for NPM release)
├── bin/
│   └── xknow-cli.js       # CLI Entry
├── lib/
│   ├── config.js          # Configuration Management (OpenClaw Bridge)
│   ├── compile.js         # Incremental Compilation Logic
│   ├── query.js           # Full Context Q&A
│   ├── lint.js            # KB Health Check (AI Audit)
│   ├── llm.js             # LLM API Proxy
│   └── sync.js            # Sync Logic
├── SKILLS/
│   └── xknow-skill.md     # OpenClaw Skill Definition
└── CLAUDE.md              # AI Agent Project Guide
```

## Core Design Principles

1. **Incremental Compilation**: Only re-compiles modified files using MD5 hashes.
2. **Full Context Querying**: Bypasses traditional RAG by putting full Wiki context into the model's large prompt window.
3. **OpenClaw Bridge**: Seamlessly loads credentials and models from `~/.openclaw/openclaw.json`.
4. **Privacy-First**: Knowledge is stored in a local Obsidian Vault, not on GitHub.

## CLI Commands

```bash
# Setup
pnpm install && pnpm link --global
xknow-cli init
xknow-cli config --list

# core workflow
xknow-cli compile          # Compile raw (chaos) to wiki (order)
xknow-cli query "Question"  # Intelligent Q&A on KB context
xknow-cli lint             # Audit KB health and connections
```

## Developer Notes

- **Language**: Node.js 18+ (ESM).
- **Core Dependencies**: `commander`, `chalk`, `ora`, `openai`, `globby`.
- **Release**: Create a Git tag starting with `v*` to trigger automated NPM release.
- **Config**: Master config in `~/.xknow-clirc`; credentials in `~/.openclaw/openclaw.json`.

## Methodology (Karpathy)

```
raw/ (chaos) -> LLM Compiler (order) -> wiki/ (structure)
                               ↓
                        Intelligent Q&A
                               ↓
                        Knowledge Discovery
```
