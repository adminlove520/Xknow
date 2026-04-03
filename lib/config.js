// lib/config.js - 配置管理

import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * 从 OpenClaw 配置读取 LLM API 设置
 * 
 * OpenClaw 配置位置：
 * - Windows: %USERPROFILE%\.openclaw\openclaw.json
 * - Mac/Linux: ~/.openclaw/openclaw.json
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

  // 尝试从 auth.profiles 读取
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

  // 尝试从 agents.defaults.model 读取
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
  const fs = require('fs');

  // 检查 wiki 目录
  const wikiExpanded = expandHome(config.wikiPath);
  if (!fs.existsSync(wikiExpanded)) {
    errors.push(`Wiki 目录不存在: ${wikiExpanded}`);
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
  wikiPath: '~/Obsidian/xiaoxi-knowledge',
  rawPath: '~/Obsidian/xiaoxi-knowledge/raw',
  llmProvider: 'auto',  // auto = 从 OpenClaw 读取
  llmModel: 'auto'       // auto = 从 OpenClaw 读取
};
