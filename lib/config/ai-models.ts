export type AIModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-3-7-sonnet-20250219"
  | "claude-3-5-sonnet-20241022"
  | "deepseek-reasoner";

type Provider = "openai" | "anthropic" | "deepseek";

interface AIModelConfig {
  id: AIModel;
  provider: Provider;
  displayName: string;
  apiKeyEnv: string;
  body: (modelId: AIModel, prompt: string, systemPrompt: string) => Record<string, any>;
}

const AI_MODEL_CONFIGS: Record<AIModel, AIModelConfig> = {
  "gpt-4o": {
    id: "gpt-4o",
    provider: "openai",
    displayName: "gpt-4o",
    apiKeyEnv: "OPENAI_API_KEY",
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 16384,
      response_format: { type: "json_object" },
    }),
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    provider: "openai",
    displayName: "gpt-4o-mini",
    apiKeyEnv: "OPENAI_API_KEY",
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 16384,
      response_format: { type: "json_object" },
    }),
  },
  "claude-3-7-sonnet-20250219": {
    id: "claude-3-7-sonnet-20250219",
    provider: "anthropic",
    displayName: "claude-3.7-sonnet",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      max_tokens: 20000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  },
  "claude-3-5-sonnet-20241022": {
    id: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    displayName: "claude-3.5-sonnet",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  },
  "deepseek-reasoner": {
    id: "deepseek-reasoner",
    provider: "deepseek",
    displayName: "deepseek-r1",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 8000,
    }),
  },
};

export const AI_MODELS = Object.values(AI_MODEL_CONFIGS);

export const getAIModelConfig = (modelId: AIModel) => {
  const config = AI_MODEL_CONFIGS[modelId];
  if (!config) {
    throw new Error(`Unsupported model: ${modelId}`);
  }
  return config;
};
