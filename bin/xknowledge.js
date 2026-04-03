#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { expandHome, getOpenClawApiKey, getOpenClawModel } from '../lib/config.js';

const program = new Command();

// 配置路径
const CONFIG_PATH = path.join(os.homedir(), '.xknowledgerc');

// 默认路径
const DEFAULT_WIKI_PATH = '~/Obsidian/xiaoxi-knowledge';
const DEFAULT_RAW_PATH = '~/Obsidian/xiaoxi-knowledge/raw';

// 加载配置
function loadConfig() {
  let config = {
    wikiPath: DEFAULT_WIKI_PATH,
    rawPath: DEFAULT_RAW_PATH,
    llmProvider: 'auto',
    llmModel: 'auto',
    apiKey: null
  };

  // 1. 加载文件配置
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      config = { ...config, ...fileConfig };
    } catch (e) {
      console.error(chalk.yellow('⚠ 配置文件解析失败，使用默认值'));
    }
  }

  // 2. 自动从 OpenClaw 获取 LLM 配置
  if (config.llmProvider === 'auto' || config.llmModel === 'auto') {
    const openaiKey = getOpenClawApiKey();
    const model = getOpenClawModel();

    if (openaiKey) config.apiKey = openaiKey;
    if (model) config.llmModel = model;
    config.llmProvider = 'openai';  // OpenClaw 用的是 OpenAI 兼容 API
  }

  return config;
}

// 保存配置
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// 检查/创建 Obsidian Vault
function ensureObsidianVault(vaultPath) {
  const expanded = expandHome(vaultPath);
  
  if (!fs.existsSync(expanded)) {
    console.log(chalk.cyan(`\n📁 创建 Obsidian Vault: ${expanded}`));
    fs.mkdirSync(expanded, { recursive: true });
    
    // 创建基础目录结构
    const dirs = ['raw/articles', 'raw/papers', 'raw/repos', 'raw/notes'];
    for (const d of dirs) {
      fs.mkdirSync(path.join(expanded, d), { recursive: true });
    }
    
    // 创建 wiki 索引
    const indexContent = `# xiaoxi-knowledge Wiki

## 目录

- [[Claude/]] - Claude 架构学习
- [[Agent/]] - Agent 设计
- [[Engineering/]] - 工程实践
- [[Life/]] - 生活记录

---
*由 xknowledge CLI 管理*
`;
    fs.writeFileSync(path.join(expanded, 'INDEX.md'), indexContent);
    
    console.log(chalk.green('✅ Obsidian Vault 创建完成！'));
    console.log(chalk.gray(`   请用 Obsidian 打开: ${expanded}`));
    return true;
  }
  
  console.log(chalk.green(`\n✅ Obsidian Vault 已存在: ${expanded}`));
  return false;
}

// 检查 Obsidian 是否安装
function checkObsidianInstalled() {
  const paths = [
    // Windows
    path.join(os.homedir(), 'AppData', 'Local', 'Obsidian', 'Obsidian.exe'),
    // Mac
    '/Applications/Obsidian.app',
    // Linux
    '/usr/bin/obsidian'
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return { installed: true, path: p };
    }
  }

  return { installed: false, path: null };
}

program
  .name('xknow')
  .description('xiaoxi-knowledge CLI - LLM Knowledge Base Management')
  .version('0.1.0');

// config 命令
program
  .command('config')
  .description('配置或查看当前设置')
  .option('-w, --wiki <path>', 'Wiki 目录路径')
  .option('-r, --raw <path>', 'Raw 数据目录路径')
  .option('-l, --list', '查看当前配置')
  .option('--init', '初始化 Obsidian Vault')
  .action((options) => {
    const config = loadConfig();

    if (options.list) {
      const obsidian = checkObsidianInstalled();
      console.log(chalk.bold.green('\n🛠 当前生效配置:'));
      console.log(chalk.gray('--------------------------------'));
      console.log(`${chalk.yellow('Wiki Path:  ')} ${expandHome(config.wikiPath)}`);
      console.log(`${chalk.yellow('Raw Path:   ')} ${expandHome(config.rawPath)}`);
      console.log(`${chalk.yellow('LLM:        ')} ${config.llmProvider} / ${config.llmModel}`);
      console.log(`${chalk.yellow('API Key:   ')} ${config.apiKey ? '****' + config.apiKey.slice(-4) : '(未设置)'}`);
      console.log(chalk.gray('--------------------------------'));
      console.log(`${chalk.yellow('Obsidian:   ')} ${obsidian.installed ? chalk.green('✓ 已安装') : chalk.red('✗ 未安装')}`);
      if (obsidian.installed) {
        console.log(chalk.gray(`   ${obsidian.path}`));
      }
      console.log(chalk.gray('--------------------------------\n'));
      return;
    }

    if (options.init) {
      ensureObsidianVault(config.wikiPath);
      return;
    }

    if (options.wiki) config.wikiPath = options.wiki;
    if (options.raw) config.rawPath = options.raw;

    saveConfig(config);
    console.log(chalk.green('✔ 配置已更新:'));
    console.log(chalk.cyan(`  Wiki Path: ${config.wikiPath}`));
    console.log(chalk.cyan(`  Raw Path: ${config.rawPath}`));
  });

// compile 命令
program
  .command('compile')
  .description('编译 raw/ 数据到 wiki/')
  .option('-s, --source <source>', '指定来源 (articles|papers|notes|repos)')
  .action(async (options) => {
    const config = loadConfig();
    const { compile } = await import('../lib/compile.js');
    compile(config, options);
  });

// query 命令
program
  .command('query')
  .description('基于 wiki 进行 Q&A')
  .argument('<question>', '要查询的问题')
  .action(async (question) => {
    const config = loadConfig();
    const { query } = await import('../lib/query.js');
    query(config, question);
  });

// lint 命令
program
  .command('lint')
  .description('Wiki 健康检查')
  .action(async () => {
    const config = loadConfig();
    const { lint } = await import('../lib/lint.js');
    lint(config);
  });

// init 命令
program
  .command('init')
  .description('初始化 Obsidian Vault')
  .option('-f, --force', '强制重新创建')
  .action(async (options) => {
    const config = loadConfig();
    
    if (options.force) {
      console.log(chalk.yellow('\n⚠ 强制重新创建（将清空现有数据！）'));
    }
    
    ensureObsidianVault(config.wikiPath);
  });

program.parse(process.argv);
