const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.0-flash,gemini-2.5-flash-lite,gemini-2.5-flash')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);

const MODEL_CANDIDATES = [...new Set([DEFAULT_MODEL, ...FALLBACK_MODELS])];

const isRetryableModelError = (status, message = '') => {
  const normalized = message.toLowerCase();
  return (
    status === 404 ||
    status === 429 ||
    normalized.includes('not found') ||
    normalized.includes('quota exceeded') ||
    normalized.includes('unsupported')
  );
};

const buildGeminiError = (status, message, attemptedModels) => {
  const normalized = String(message || '').toLowerCase();
  const isQuotaError = status === 429 || normalized.includes('quota exceeded');
  const isMissingModel = status === 404 || normalized.includes('not found') || normalized.includes('unsupported');

  if (isQuotaError) {
    const error = new Error(
      'Your Gemini API key has no free quota available for the AI tutor right now. Please wait for quota reset, try another Gemini key, or enable billing in Google AI Studio.'
    );
    error.status = 429;
    error.details = { attemptedModels };
    return error;
  }

  if (isMissingModel) {
    const error = new Error(
      'The configured Gemini model is not available for your API key. Please try a different Gemini key or set GEMINI_MODEL to a model your key can access.'
    );
    error.status = 400;
    error.details = { attemptedModels };
    return error;
  }

  const error = new Error(message || 'Gemini request failed');
  error.status = status || 502;
  error.details = { attemptedModels };
  return error;
};

class GeminiService {
  async generateAnswer(apiKey, prompt) {
    const attemptedModels = [];
    let lastError;

    for (const model of MODEL_CANDIDATES) {
      attemptedModels.push(model);
      let response;
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 700,
              },
            }),
          }
        );
      } catch (_error) {
        const error = new Error('Could not reach Gemini. Check your internet connection, API key restrictions, or firewall settings.');
        error.status = 503;
        throw error;
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data?.error?.message || 'Gemini request failed';
        lastError = { status: response.status, message };
        if (isRetryableModelError(response.status, message)) {
          continue;
        }
        throw buildGeminiError(response.status, message, attemptedModels);
      }

      return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim()
        || 'I could not generate an answer for that question.';
    }

    throw buildGeminiError(lastError?.status, lastError?.message, attemptedModels);
  }
}

module.exports = new GeminiService();
