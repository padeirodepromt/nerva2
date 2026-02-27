// Tokenizer service with optional high-precision tiktoken integration and a safe heuristic fallback.
// Exports async functions: estimateTokens(text, model) and estimateMessagesTokens(messages, model)
//
// Notes:
// - Uses dynamic import of '@dqbd/tiktoken' if available. This package provides the most accurate token counts
//   for OpenAI/GPT models. If not available or fails, we fall back to a heuristic (1 token ≈ 4 chars).
// - Functions return numbers (token counts). They are async to support dynamic import.
export const estimateTokens = async (text = '', model = 'gpt-4o') => {
  if (!text) return 0;

  // Try to use @dqbd/tiktoken if installed
  try {
    // dynamic import so project doesn't require the package unless used
    const tiktoken = await import('@dqbd/tiktoken');
    // encoding_for_model may throw if model unknown; fallback handled below
    const enc = tiktoken.encoding_for_model(model);
    const encoded = enc.encode(text);
    const length = encoded.length;
    try { enc.free(); } catch (e) { /* ignore free errors */ }
    return length;
  } catch (e) {
    // Fallback heuristic
    return Math.max(1, Math.round(text.length / 4));
  }
};

export const estimateMessagesTokens = async (messages = [], model = 'gpt-4o') => {
  if (!Array.isArray(messages) || messages.length === 0) return 0;
  // messages is an array of { role, content } or similar
  const joined = messages.map(m => (typeof m === 'string' ? m : (m.content || '') )).join('\n');
  return await estimateTokens(joined, model);
};

// backward-compatible alias used across the codebase
export const estimateTokensFallback = estimateTokens;
