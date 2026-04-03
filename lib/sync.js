// lib/sync.js - 同步到 Obsidian

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

/**
 * 同步到 Obsidian
 *
 * Karpathy 的方法论：
 * - Obsidian 作为 IDE 前端
 * - wiki/ 直接作为 Obsidian Vault
 * - raw/ 作为原始数据备份
 *
 * @param {Object} config - 配置
 * @param {Object} options - 选项
 */
export async function sync(config, options = {}) {
  const spinner = ora(chalk.cyan('正在同步到 Obsidian...')).start();

  try {
    const wikiPath = config.wikiPath;
    let obsidianPath = options.obsidian;

    // 如果没有指定，尝试从配置读取
    if (!obsidianPath) {
      obsidianPath = path.join(os.homedir(), 'Documents', 'Obsidian', 'xiaoxi-knowledge');
    }

    // 检查 wiki 目录
    if (!fs.existsSync(wikiPath)) {
      spinner.fail(chalk.red(`Wiki 目录不存在: ${wikiPath}`));
      return;
    }

    // 检查 Obsidian Vault
    if (!fs.existsSync(obsidianPath)) {
      console.log(chalk.yellow(`\n⚠ Obsidian Vault 不存在: ${obsidianPath}`));
      console.log(chalk.gray('  请确保 Obsidian 已打开此目录作为 Vault'));
      console.log(chalk.gray('  或者使用 --obsidian 参数指定路径\n'));
    }

    // 同步文件
    const files = syncDirectory(wikiPath, obsidianPath);

    spinner.succeed(chalk.green('✓ 同步完成'));
    console.log(chalk.gray(`\n  同步了 ${files} 个文件到 Obsidian\n`));

  } catch (error) {
    spinner.fail(chalk.red(`同步失败: ${error.message}`));
  }
}

// 递归同步目录
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
      // 跳过 raw/ 目录
      if (entry.name === 'raw') continue;

      count += syncDirectory(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // 检查是否需要更新
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
