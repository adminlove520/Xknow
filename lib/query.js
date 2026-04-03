// lib/query.js - 基于 wiki 进行 Q&A

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

/**
 * Q&A 查询
 *
 * Karpathy 的方法论：
 * - wiki 够大后直接问，不需要 RAG
 * - LLM 会自动读取相关文档
 * - 可以进一步研究答案
 * - 输出可以沉淀回 wiki
 *
 * @param {Object} config - 配置
 * @param {string} question - 查询问题
 */
export async function query(config, question) {
  const spinner = ora(chalk.cyan('正在思考...')).start();

  try {
    // 1. 读取 wiki 索引
    const wikiDir = config.wikiPath;
    const indexFile = path.join(wikiDir, 'INDEX.md');

    if (!fs.existsSync(indexFile)) {
      spinner.fail(chalk.red('Wiki 索引不存在，请先运行 compile'));
      return;
    }

    // TODO: 实现 LLM Q&A
    // 1. 构建 prompt，包含问题 + wiki 索引
    // 2. 调用 LLM
    // 3. 返回答案
    // 4. 询问是否沉淀到 wiki

    console.log(chalk.bold(`\n❓ ${question}\n`));
    console.log(chalk.gray('(Q&A 功能待实现，需要配置 LLM API)'));

    spinner.stop();

  } catch (error) {
    spinner.fail(chalk.red(`查询失败: ${error.message}`));
  }
}

/**
 * 深度研究 - 对问题进行深入研究
 */
export async function research(config, question) {
  // TODO: 实现深度研究
  // 1. 分解问题为子问题
  // 2. 对每个子问题进行查询
  // 3. 整合答案
  // 4. 生成报告
}
