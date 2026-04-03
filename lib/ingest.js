// lib/ingest.js - Ingest source content to raw/

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { expandHome } from './config.js';

/**
 * Ingest source content
 */
export async function ingest(config, source, options = {}) {
  const spinner = ora(chalk.cyan('Ingesting source...')).start();

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
      // Use web_fetch (via global available tools or direct fetch if allowed)
      // For this implementation, we'll assume a helper or direct fetch
      spinner.text = chalk.cyan(`Fetching URL: ${source}`);
      
      // In a real CLI environment, we might use 'fetch' or a library
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Failed to fetch URL: ${response.statusText}`);
      
      const rawHtml = await response.text();
      // Simple HTML to MD conversion (simplified for this demo)
      content = `# Source: ${source}\n\n${rawHtml.substring(0, 5000)}...`; 
      fileName = source.split('/').pop().replace(/[?#].*$/, '') || 'web-page';
      if (!fileName.endsWith('.md')) fileName += '.md';
    } else {
      // Local file
      const sourcePath = path.resolve(source);
      if (!fs.existsSync(sourcePath)) throw new Error(`Local file not found: ${sourcePath}`);
      
      content = fs.readFileSync(sourcePath, 'utf8');
      fileName = path.basename(sourcePath);
    }

    const targetPath = path.join(targetDir, fileName);
    fs.writeFileSync(targetPath, content);

    spinner.succeed(chalk.green(`✓ Ingested to ${category}/${fileName}`));
    console.log(chalk.gray(`  Path: ${targetPath}`));

  } catch (error) {
    spinner.fail(chalk.red(`Ingest failed: ${error.message}`));
  }
}
