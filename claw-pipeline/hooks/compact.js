/**
 * CLAW-CODE Session Compaction — OpenClaw Implementation
 * Auto-summarizes long conversation history to stay within token budgets
 */

const { LLMClient } = require('./llm-client.js');

const DEFAULT_PRESERVE_RECENT = 20;
const DEFAULT_MAX_TOKENS = 4000;
const DEFAULT_THRESHOLD_TOKENS = 50000;
const COMPACT_INVOCATION = '## Conversation Summary (auto-generated)\n\n';

/**
 * Check if compaction is needed and compact if so
 * @param {Array} messages - Conversation history messages
 * @param {Object} options - { preserveRecent, maxTokens, threshold, model }
 * @returns {Object} { compacted: bool, savedTokens: number, newHistory: Array, summary: string }
 */
async function maybeCompact(messages, options = {}) {
  const {
    preserveRecent = DEFAULT_PRESERVE_RECENT,
    maxTokens = DEFAULT_MAX_TOKENS,
    threshold = DEFAULT_THRESHOLD_TOKENS
  } = options;
  
  const estimatedTokens = estimateTokens(messages);
  
  if (estimatedTokens < threshold) {
    return { compacted: false, reason: 'Below threshold' };
  }
  
  return compactSession(messages, { preserveRecent, maxTokens });
}

/**
 * Compact session history
 */
async function compactSession(messages, options = {}) {
  const {
    preserveRecent = DEFAULT_PRESERVE_RECENT,
    maxTokens = DEFAULT_MAX_TOKENS
  } = options;
  
  if (messages.length <= preserveRecent) {
    return { compacted: false, reason: 'Below minimum length' };
  }
  
  const recentMessages = messages.slice(-preserveRecent);
  const oldMessages = messages.slice(0, -preserveRecent);
  
  // Build summary prompt
  const summaryPrompt = buildSummaryPrompt(oldMessages, maxTokens);
  
  // Call LLM to summarize
  let summary;
  try {
    const llm = new LLMClient();
    summary = await llm.summarize(summaryPrompt);
  } catch (e) {
    // Fallback: simple concatenation
    summary = fallbackSummary(oldMessages);
  }
  
  const oldTokens = estimateTokens(oldMessages);
  const summaryTokens = estimateTokens([{ role: 'assistant', content: summary }]);
  const savedTokens = oldTokens - summaryTokens;
  
  const newHistory = [
    { 
      role: 'system', 
      content: COMPACT_INVOCATION + summary + '\n\n---\n[Earlier ' + oldMessages.length + ' messages summarized from ~' + oldTokens + ' tokens]'
    },
    ...recentMessages
  ];
  
  return {
    compacted: true,
    savedTokens,
    newHistory,
    summary,
    originalMessageCount: messages.length,
    newMessageCount: newHistory.length,
    preservedRecent: preserveRecent
  };
}

function buildSummaryPrompt(messages, maxTokens) {
  const text = messages
    .map(m => `[${m.role}]: ${m.content}`)
    .join('\n\n')
    .substring(0, maxTokens * 4); // rough chars estimate
  
  return `Summarize this conversation history concisely. Preserve ALL important information: user goals, key decisions, completed work, current state, outstanding issues, tool results, file changes, and any relevant context.

Conversation:
${text}

Respond with a structured summary covering: User Goals, Key Decisions, Completed Work, Current State, Outstanding Issues.`;
}

function fallbackSummary(messages) {
  const userMsgs = messages.filter(m => m.role === 'user');
  const assistantMsgs = messages.filter(m => m.role === 'assistant');
  return `[Summary of ${messages.length} messages: ${userMsgs.length} user messages, ${assistantMsgs.length} assistant responses. See earlier messages for details.]`;
}

function estimateTokens(messages) {
  // Rough estimate: ~4 chars per token
  const text = messages.map(m => m.content || '').join(' ');
  return Math.ceil(text.length / 4);
}

module.exports = { maybeCompact, compactSession, estimateTokens };
