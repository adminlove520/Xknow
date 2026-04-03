// lib/config.js - 配置管理

export function loadConfig() {
  // 已在 bin/xknowledge.js 中实现
  // 此文件提供配置验证和默认值
}

export function validateConfig(config) {
  const errors = [];

  // 检查目录是否存在
  const fs = require('fs');

  if (!fs.existsSync(config.wikiPath)) {
    errors.push(`Wiki 目录不存在: ${config.wikiPath}`);
  }

  if (!fs.existsSync(config.rawPath)) {
    errors.push(`Raw 目录不存在: ${config.rawPath}`);
  }

  // 检查 LLM 配置
  if (!config.llmProvider) {
    errors.push('缺少 LLM Provider');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export const DEFAULT_CONFIG = {
  wikiPath: './wiki',
  rawPath: './raw',
  llmProvider: 'openai',
  llmModel: 'gpt-4'
};
