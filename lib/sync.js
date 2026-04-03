// lib/sync.js - 同步到 Obsidian

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * 同步到 Obsidian
 */
export async function sync(config, options = {}) {
  const spinner = ora(chalk.cyan('正在同步到 Obsidian...')).start();

  try {
    const wikiPath = config.wikiPath;
    let obsidianPath = options.obsidian;

    if (!obsidianPath) {
      obsidianPath = path.join(os.homedir(), 'Documents', 'Obsidian', 'Xknow');
    }

    if (!fs.existsSync(wikiPath)) {
      spinner.fail(chalk.red(`Wiki 目录不存在: ${wikiPath}`));
      return;
    }

    if (!fs.existsSync(obsidianPath)) {
      console.log(chalk.yellow(`\n⚠ Obsidian Vault 不存在: ${obsidianPath}`));
      console.log(chalk.gray('  请先运行 xknow init\n'));
    }

    const files = syncDirectory(wikiPath, obsidianPath);

    spinner.succeed(chalk.green('✓ 同步完成'));
    console.log(chalk.gray(`\n  同步了 ${files} 个文件到 Obsidian\n`));

  } catch (error) {
    spinner.fail(chalk.red(`同步失败: ${error.message}`));
  }
}

function syncDirectory(src, dest) {
  let count = 0;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'raw') continue;
      count += syncDirectory(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const needUpdate = !fs.existsSync(destPath) ||
        fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime;

      if (needUpdate) {
        fs.copyFileSync(srcPath, destPath);
        count++;
      }
    }
  }

  return count;
}
