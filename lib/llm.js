// lib/llm.js - LLM API Wrapper

import OpenAI from 'openai';
import { getOpenClawApiKey, getOpenClawModel } from './config.js';

let client = null;

/**
 * Get OpenAI client
 */
function getClient() {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY || getOpenClawApiKey();
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  if (!apiKey) {
    throw new Error('API Key not found. Please set OPENAI_API_KEY or configure OpenClaw.');
  }

  client = new OpenAI({
    apiKey,
    baseURL
  });

  return client;
}

/**
 * Call LLM
 * @param {Array} messages - Message list
 * @param {Object} options - Options
 */
export async function callLLM(messages, options = {}) {
  const openai = getClient();
  const model = options.model || getOpenClawModel() || 'gpt-4o';

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens,
    ...options
  });

  return response.choices[0].message.content;
}

/**
 * System Prompt Templates
 */
export const PROMPTS = {
  COMPILE_REFERENCE: `You are a Librarian. Your goal is to create a "Reference" article for a specific source.
1. Provide a concise executive summary.
2. Extract key facts, definitions, and data.
3. List all significant entities (people, tools, concepts).
4. Create [[Wikilinks]] for any concept that deserves its own article.
Output ONLY markdown.`,

  COMPILE_CONCEPT: `You are a Knowledge Architect. Your goal is to synthesize multiple sources into a "Concept" article.
1. Explain the concept's core theory and significance.
2. Synthesize insights from the provided source snippets.
3. Compare different viewpoints if they exist.
4. Use Mermaid diagrams for architecture or workflows if appropriate.
5. Provide a "See Also" section with [[Wikilinks]].
Output ONLY markdown.`,

  QUERY: `You are an expert for the Xknow Knowledge Base. 
Answer the user's question based on the provided wiki content.
Formatting rules:
- Default: Use standard Markdown.
- If requested 'slides': Use Marp (Markdown Presentation Ecosystem) format with '---' separators.
- If requested 'mermaid': Focus on generating a Mermaid diagram.
- Always cite the source files using [Source: filename.md].
Be insightful and professional.`,

  LINT: `You are a Knowledge Librarian. Analyze the provided Wiki Index and content snippets.
Identify:
1. Gaps: What related topics are missing? (Suggest specific web search queries).
2. Redundancy: Which articles should be merged into a "Concept" article?
3. Dead ends: Articles without outgoing [[Wikilinks]].
4. Suggest 3 specific "Next Steps" for the user to improve the KB.
Output in structured Markdown.`
};
