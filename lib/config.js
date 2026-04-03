// lib/config.js - Configuration Management

import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Read LLM API settings from OpenClaw configuration
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
 * Get the current LLM API key used by OpenClaw
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
 * Get the current model used by OpenClaw
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
 * Validate configuration
 */
export function validateConfig(config) {
  const errors = [];

  const wikiExpanded = expandHome(config.wikiPath);
  if (!fs.existsSync(wikiExpanded)) {
    errors.push(`Wiki directory does not exist: ${wikiExpanded}`);
  }

  if (!config.llmProvider) {
    errors.push('Missing LLM Provider');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Expand ~ to home directory
 */
export function expandHome(p) {
  if (p.startsWith('~/') || p === '~') {
    return path.join(os.homedir(), p.slice(1));
  }
  return p;
}

export const DEFAULT_CONFIG = {
  wikiPath: '~/Obsidian/Xknow-Wiki',
  rawPath: '~/Obsidian/Xknow-Wiki/raw',
  llmProvider: 'auto',
  llmModel: 'auto'
};
