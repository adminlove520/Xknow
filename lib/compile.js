// lib/compile.js - 编译 raw/ 数据到 wiki/

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

/**
 * 编译 raw/ 数据到 wiki/
 *
 * Karpathy 的方法论：
 * 1. 读取 raw/ 中的原始数据
 * 2. LLM 增量编译（不是全量重写）
 * 3. 生成摘要、backlinks、分类、概念文章
 * 4. 输出到 wiki/
 *
 * @param {Object} config - 配置
 * @param {Object} options - 选项
 */
export async function compile(config, options = {}) {
  const spinner = ora(chalk.cyan('开始编译 wiki...')).start();

  try {
    const { validateConfig } = await import('./config.js');
    const validation = validateConfig(config);

    if (!validation.valid) {
      spinner.fail(chalk.red('配置验证失败:'));
      validation.errors.forEach(e => console.log(chalk.yellow(`  - ${e}`)));
      return;
    }

    const source = options.source || 'all';
    const sources = source === 'all'
      ? ['articles', 'papers', 'notes', 'repos']
      : [source];

    // 编译每个来源
    for (const src of sources) {
      const rawDir = path.join(config.rawPath, src);
      if (!fs.existsSync(rawDir)) {
        console.log(chalk.yellow(`⚠ 目录不存在: ${rawDir}`));
        continue;
      }

      const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.md'));
      console.log(chalk.gray(`\n📂 ${src}: ${files.length} 文件`));

      for (const file of files) {
        const filePath = path.join(rawDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // TODO: 调用 LLM 编译
        // 1. 理解内容
        // 2. 提取关键信息
        // 3. 生成摘要
        // 4. 建立链接
        // 5. 写入 wiki/

        console.log(chalk.gray(`  - ${file}`));
      }
    }

    spinner.succeed(chalk.green('✓ 编译完成'));

  } catch (error) {
    spinner.fail(chalk.red(`编译失败: ${error.message}`));
  }
}

/**
 * 增量编译 - 只编译新文件或修改过的文件
 */
export async function compileIncremental(config) {
  // TODO: 实现增量编译逻辑
  // 1. 记录上次编译的文件列表
  // 2. 对比修改时间
  // 3. 只编译新增/修改的文件
}
