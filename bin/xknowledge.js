#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';

const program = new Command();

// 配置路径
const CONFIG_PATH = path.join(os.homedir(), '.xknowledgerc');

// 环境变量
const ENV_VARS = {
  wikiPath: 'XKNOWLEDGE_WIKI_PATH',
  rawPath: 'XKNOWLEDGE_RAW_PATH',
  llmProvider: 'XKNOWLEDGE_LLM_PROVIDER',
  llmModel: 'XKNOWLEDGE_LLM_MODEL'
};

// 加载配置
function loadConfig() {
  let config = {
    wikiPath: './wiki',
    rawPath: './raw',
    llmProvider: 'openai',
    llmModel: 'gpt-4'
  };

  // 1. 加载文件配置
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      config = { ...config, ...fileConfig };
    } catch (e) {
      console.error(chalk.red('⚠ 配置文件解析失败，将使用默认值'));
    }
  }

  // 2. 环境变量覆盖
  if (process.env[ENV_VARS.wikiPath]) config.wikiPath = process.env[ENV_VARS.wikiPath];
  if (process.env[ENV_VARS.rawPath]) config.rawPath = process.env[ENV_VARS.rawPath];
  if (process.env[ENV_VARS.llmProvider]) config.llmProvider = process.env[ENV_VARS.llmProvider];
  if (process.env[ENV_VARS.llmModel]) config.llmModel = process.env[ENV_VARS.llmModel];

  return config;
}

// 保存配置
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
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
  .option('-p, --provider <provider>', 'LLM Provider')
  .option('-m, --model <model>', 'LLM Model')
  .option('-l, --list', '查看当前配置')
  .action((options) => {
    const config = loadConfig();

    if (options.list) {
      console.log(chalk.bold.green('\n🛠 当前生效配置:'));
      console.log(chalk.gray('--------------------------------'));
      console.log(`${chalk.yellow('Wiki Path:  ')} ${config.wikiPath}`);
      console.log(`${chalk.yellow('Raw Path:   ')} ${config.rawPath}`);
      console.log(`${chalk.yellow('LLM:        ')} ${config.llmProvider} / ${config.llmModel}`);
      console.log(chalk.gray('--------------------------------\n'));
      return;
    }

    if (options.wiki) config.wikiPath = options.wiki;
    if (options.raw) config.rawPath = options.raw;
    if (options.provider) config.llmProvider = options.provider;
    if (options.model) config.llmModel = options.model;

    saveConfig(config);
    console.log(chalk.green('✔ 配置已更新:'));
    console.log(chalk.cyan(`  Wiki Path:  ${config.wikiPath}`));
    console.log(chalk.cyan(`  Raw Path:   ${config.rawPath}`));
    console.log(chalk.cyan(`  LLM:       ${config.llmProvider} / ${config.llmModel}`));
  });

// compile 命令
program
  .command('compile')
  .description('编译 raw/ 数据到 wiki/')
  .option('-s, --source <source>', '指定来源 (articles|papers|notes)')
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

// sync 命令
program
  .command('sync')
  .description('同步到 Obsidian')
  .option('-o, --obsidian <path>', 'Obsidian Vault 路径')
  .action(async (options) => {
    const config = loadConfig();
    const { sync } = await import('../lib/sync.js');
    sync(config, options);
  });

program.parse(process.argv);
