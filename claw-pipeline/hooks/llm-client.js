/**
 * LLM Summarization Client for Session Compaction
 * Uses the configured LLM to summarize conversation history
 */

class LLMClient {
  constructor(options = {}) {
    this.model = options.model || 'compact';
    this.apiUrl = options.apiUrl || process.env.LLM_SUMMARIZE_URL;
    this.apiKey = options.apiKey || process.env.LLM_API_KEY;
  }
  
  async summarize(prompt, options = {}) {
    // This would use the configured LLM API
    // Placeholder implementation
    if (!this.apiUrl) {
      // Fallback to simple extraction-based summary
      return this.simpleSummary(prompt);
    }
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens || 2000,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || this.simpleSummary(prompt);
  }
  
  simpleSummary(text) {
    // Fallback: return first 500 chars
    return '[Summary unavailable - see original messages.]\n\n' + text.substring(0, 500);
  }
}

module.exports = { LLMClient };
