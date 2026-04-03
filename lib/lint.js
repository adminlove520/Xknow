// lib/lint.js - Wiki 健康检查

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

/**
 * Wiki 健康检查
 *
 * Karpathy 的方法论：
 * - 检查不一致的数据
 * - 填补缺失的数据
 * - 寻找有趣的连接
 * - 发现新文章候选
 *
 * @param {Object} config - 配置
 */
export async function lint(config) {
  const spinner = ora(chalk.cyan('正在检查 wiki 健康度...')).start();

  try {
    const wikiDir = config.wikiPath;
    const issues = [];
    const suggestions = [];

    // 1. 收集所有 wiki 文件
    const files = collectMdFiles(wikiDir);

    if (files.length === 0) {
      spinner.info(chalk.yellow('Wiki 为空，请先运行 compile'));
      return;
    }

    console.log(chalk.gray(`\n📊 Wiki 统计: ${files.length} 文件\n`));

    // 2. 检查孤立文件（没有 backlink）
    const orphans = findOrphanFiles(wikiDir, files);
    if (orphans.length > 0) {
      issues.push({
        type: 'orphan',
        message: `${orphans.length} 个孤立文件没有 backlinks`,
        files: orphans
      });
    }

    // 3. 检查重复内容
    const duplicates = findDuplicates(wikiDir, files);
    if (duplicates.length > 0) {
      issues.push({
        type: 'duplicate',
        message: `${duplicates.length} 个文件可能有重复内容`,
        files: duplicates
      });
    }

    // 4. 生成建议
    const newTopics = suggestNewTopics(wikiDir, files);
    if (newTopics.length > 0) {
      suggestions.push({
        type: 'new-topic',
        message: `${newTopics.length} 个新主题候选`,
        topics: newTopics
      });
    }

    // 5. 输出报告
    spinner.succeed(chalk.green('✓ 健康检查完成'));

    if (issues.length > 0) {
      console.log(chalk.bold('\n🔴 发现的问题:'));
      issues.forEach(issue => {
        console.log(chalk.red(`  ⚠ ${issue.message}`));
      });
    }

    if (suggestions.length > 0) {
      console.log(chalk.bold('\n💡 建议:'));
      suggestions.forEach(s => {
        console.log(chalk.cyan(`  ✨ ${s.message}`));
      });
    }

    if (issues.length === 0 && suggestions.length === 0) {
      console.log(chalk.green('\n✅ Wiki 非常健康！'));
    }

  } catch (error) {
    spinner.fail(chalk.red(`健康检查失败: ${error.message}`));
  }
}

// 收集所有 .md 文件
function collectMdFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'raw') {
      collectMdFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// 查找孤立文件
function findOrphanFiles(wikiDir, files) {
  // TODO: 读取每个文件，查找 [[wikilinks]] 或 backlinks
  return [];
}

// 查找重复
function findDuplicates(wikiDir, files) {
  // TODO: 计算相似度
  return [];
}

// 建议新主题
function suggestNewTopics(wikiDir, files) {
  // TODO: 分析文件，识别潜在的新主题
  return [];
}
