// lib/config.js - 配置管理

import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * 从 OpenClaw 配置读取 LLM API 设置
 */
export function getOpenClawConfig() {
  const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config;
  } catch (e) {
    return null;
  }
}

/**
 * 获取 OpenClaw 当前使用的 LLM API key
 */
export function getOpenClawApiKey() {
  const config = getOpenClawConfig();
  if (!config) return null;

  if (config.auth?.profiles) {
    for (const profile of Object.values(config.auth.profiles)) {
      if (profile.apiKey) return profile.apiKey;
    }
  }

  return null;
}

/**
 * 获取 OpenClaw 当前使用的模型
 */
export function getOpenClawModel() {
  const config = getOpenClawConfig();
  if (!config) return null;

  if (config.agents?.defaults?.model) {
    return config.agents.defaults.model;
  }

  return null;
}

/**
 * 验证配置
 */
export function validateConfig(config) {
  const errors = [];

  const wikiExpanded = expandHome(config.wikiPath);
  if (!fs.existsSync(wikiExpanded)) {
    errors.push(`Wiki 目录不存在: ${wikiExpanded}`);
  }

  if (!config.llmProvider) {
    errors.push('缺少 LLM Provider');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 展开 ~ 为用户目录
 */
export function expandHome(p) {
  if (p.startsWith('~/') || p === '~') {
    return path.join(os.homedir(), p.slice(1));
  }
  return p;
}

export const DEFAULT_CONFIG = {
  wikiPath: '~/Obsidian/Xknow',
  rawPath: '~/Obsidian/Xknow/raw',
  llmProvider: 'auto',
  llmModel: 'auto'
};
