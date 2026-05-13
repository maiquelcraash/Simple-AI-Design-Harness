import type { LLMExecutor } from "../interfaces.js";
import { KiroCliExecutor } from "./kiro-cli.executor.js";
import { OllamaCliExecutor } from "./ollama-cli.executor.js";
import { OpenAICompatibleExecutor } from "./openai-compatible.executor.js";

export type ProviderType = "kiro" | "ollama-cli" | "openai" | "ollama-http";

export interface ProviderConfig {
  provider: ProviderType;
  model?: string;
  baseUrl?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  think?: boolean;
}

/**
 * Factory that creates the appropriate LLMExecutor based on configuration.
 *
 * Supported providers:
 * - "kiro"        → shells out to kiro-cli (original behavior)
 * - "ollama-cli"  → shells out to `ollama run <model> "<prompt>"`
 * - "ollama-http" → uses Ollama's OpenAI-compatible HTTP API (localhost:11434)
 * - "openai"      → uses OpenAI's API (or any compatible endpoint)
 */
export function createExecutor(config: ProviderConfig): LLMExecutor {
  switch (config.provider) {
    case "kiro":
      return new KiroCliExecutor();

    case "ollama-cli":
      return new OllamaCliExecutor({
        model: config.model,
        think: config.think ?? false,
      });

    case "ollama-http":
      return new OpenAICompatibleExecutor({
        baseUrl: config.baseUrl ?? "http://localhost:11434/v1",
        model: config.model ?? "qwen3.5:4b",
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });

    case "openai":
      return new OpenAICompatibleExecutor({
        baseUrl: config.baseUrl ?? "https://api.openai.com/v1",
        model: config.model ?? "gpt-4o",
        apiKey: config.apiKey ?? process.env["OPENAI_API_KEY"],
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });

    default:
      throw new Error(
        `Unknown provider: "${config.provider}". ` +
        `Supported: kiro, ollama-cli, ollama-http, openai`
      );
  }
}

export function parseConfig(argv: string[] = process.argv): ProviderConfig {
  const getFlag = (name: string): string | undefined => {
    const prefix = `--${name}=`;
    const arg = argv.find((a) => a.startsWith(prefix));
    return arg ? arg.slice(prefix.length) : undefined;
  };

  const hasFlag = (name: string): boolean => argv.includes(`--${name}`);

  const provider = (getFlag("provider") ?? process.env["AI_PROVIDER"] ?? "ollama-cli") as ProviderType;
  const model = getFlag("model") ?? process.env["AI_MODEL"];
  const baseUrl = getFlag("base-url") ?? process.env["AI_BASE_URL"];
  const apiKey = getFlag("api-key") ?? process.env["AI_API_KEY"];
  const temperature = getFlag("temperature") ?? process.env["AI_TEMPERATURE"];
  const maxTokens = getFlag("max-tokens") ?? process.env["AI_MAX_TOKENS"];
  const think = hasFlag("think");

  return {
    provider,
    model: model || undefined,
    baseUrl: baseUrl || undefined,
    apiKey: apiKey || undefined,
    temperature: temperature ? parseFloat(temperature) : undefined,
    maxTokens: maxTokens ? parseInt(maxTokens, 10) : undefined,
    think,
  };
}
