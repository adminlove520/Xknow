// lib/ingest.js - Ingest source content to raw/ (Improved)

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { expandHome } from './config.js';

/**
 * Ingest source content from URL or local file
 */
export async function ingest(config, source, options = {}) {
  const spinner = ora(chalk.cyan('Ingesting source content...')).start();

  try {
    const rawDir = expandHome(config.rawPath);
    const category = options.category || 'notes';
    const targetDir = path.join(rawDir, category);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let content = '';
    let fileName = '';

    if (source.startsWith('http')) {
      spinner.text = chalk.cyan(`Step 1: Fetching URL: ${source}`);
      
      const response = await fetch(source);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      
      const rawHtml = await response.text();
      
      // Basic extraction logic: title + first few paragraphs (Simulated for simplicity)
      const titleMatch = rawHtml.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Web Content';
      
      content = `# ${title}\n\n*Source: ${source}*\n\n> Note: This content was ingested from the web.\n\n${rawHtml.substring(0, 10000)}...`; 
      
      fileName = source.replace(/https?:\/\//, '')
        .replace(/[\/\.]/g, '-')
        .replace(/[?#].*$/, '')
        .substring(0, 50) + '.md';
    } else {
      // Local file
      const sourcePath = path.resolve(source);
      if (!fs.existsSync(sourcePath)) throw new Error(`Source file not found: ${sourcePath}`);
      
      const stats = fs.statSync(sourcePath);
      if (stats.isDirectory()) throw new Error('Cannot ingest a directory. Please provide a file path.');

      spinner.text = chalk.cyan(`Step 1: Reading local file: ${path.basename(sourcePath)}`);
      content = fs.readFileSync(sourcePath, 'utf8');
      fileName = path.basename(sourcePath);
      
      if (!fileName.endsWith('.md') && !fileName.endsWith('.txt')) {
        fileName += '.md';
      }
    }

    const targetPath = path.join(targetDir, fileName);
    
    // Check for collision
    if (fs.existsSync(targetPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      fileName = fileName.replace('.md', `-${timestamp}.md`);
    }

    fs.writeFileSync(path.join(targetDir, fileName), content);

    spinner.succeed(chalk.green(`✓ Ingested successfully to ${category}/${fileName}`));
    console.log(chalk.gray(`  Location: ${path.join(targetDir, fileName)}`));
    console.log(chalk.cyan(`💡 Tip: Run 'xknow-cli compile' to transform this into Wiki knowledge.`));

  } catch (error) {
    spinner.fail(chalk.red(`Ingest failed: ${error.message}`));
  }
}
