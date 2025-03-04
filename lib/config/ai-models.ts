export type AIModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-3.7-sonnet"
  | "claude-3.5-sonnet"
  | "deepseek-reasoner";

type Provider = "openai" | "anthropic" | "deepseek";

interface BaseModelConfig {
  id: AIModel;
  provider: Provider;
  displayName: string;
}

interface ProviderConfig {
  provider: Provider;
  apiKeyEnv: string;
  baseEndpoint: string;
  useSDK?: boolean;
  headers: (apiKey: string) => Record<string, string>;
  body: (modelId: AIModel, prompt: string, systemPrompt: string) => Record<string, any>;
  responseParser: (response: any) => string;
}

const PROVIDER_CONFIGS: Record<Provider, ProviderConfig> = {
  openai: {
    provider: "openai",
    apiKeyEnv: "OPENAI_API_KEY",
    baseEndpoint: "https://api.openai.com/v1/chat/completions",
    useSDK: true,
    headers: apiKey => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
    responseParser: response => response.choices[0].message.content,
  },
  anthropic: {
    provider: "anthropic",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    baseEndpoint: "https://api.anthropic.com/v1/messages",
    headers: apiKey => ({
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    }),
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nUser prompt: ${prompt}`,
        },
      ],
      temperature: 0.7,
    }),
    responseParser: response => response.content[0].text,
  },
  deepseek: {
    provider: "deepseek",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    baseEndpoint: "https://api.deepseek.com/v1/chat/completions",
    useSDK: true,
    headers: apiKey => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (modelId, prompt, systemPrompt) => ({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 8000,
    }),
    responseParser: response => response.choices[0].message.content,
  },
};

export const MODEL_CONFIGS: Record<AIModel, BaseModelConfig> = {
  "gpt-4o": {
    id: "gpt-4o",
    provider: "openai",
    displayName: "gpt-4o",
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    provider: "openai",
    displayName: "gpt-4o-mini",
  },
  "claude-3.7-sonnet": {
    id: "claude-3.7-sonnet",
    provider: "anthropic",
    displayName: "claude-3.7-sonnet",
  },
  "claude-3.5-sonnet": {
    id: "claude-3.5-sonnet",
    provider: "anthropic",
    displayName: "claude-3.5-sonnet",
  },
  "deepseek-reasoner": {
    id: "deepseek-reasoner",
    provider: "deepseek",
    displayName: "deepseek-r1",
  },
};

export const AI_MODELS = Object.values(MODEL_CONFIGS).map(config => ({
  ...config,
  ...PROVIDER_CONFIGS[config.provider],
}));

export const getAIModelConfig = (modelId: AIModel) => {
  const config = AI_MODELS.find(model => model.id === modelId);
  if (!config) {
    throw new Error(`Unsupported model: ${modelId}`);
  }
  return config;
};
