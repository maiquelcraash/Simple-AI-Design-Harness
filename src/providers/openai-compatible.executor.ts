import type { LLMExecutor as ILLMExecutor, Message } from "../interfaces.js";

/**
 * HTTP-based executor compatible with OpenAI's chat completions API.
 * Works with: OpenAI, Ollama (http mode), LM Studio, vLLM, Together AI,
 * Groq, Mistral, and any other OpenAI-compatible endpoint.
 *
 * No external dependencies — uses native fetch (Node 18+).
 */
export class OpenAICompatibleExecutor implements ILLMExecutor {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly apiKey: string | undefined;
  private readonly temperature: number;
  private readonly maxTokens: number;

  constructor(options: {
    baseUrl?: string;
    model?: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}) {
    this.baseUrl = (options.baseUrl ?? "http://localhost:11434/v1").replace(/\/$/, "");
    this.model = options.model ?? "qwen3.5:9b";
    this.apiKey = options.apiKey;
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens ?? 4096;
  }

  async call(conversation: Message[]): Promise<string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const body = {
      model: this.model,
      messages: conversation.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      stream: false,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LLM API error (${response.status}): ${errorText}`
      );
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("LLM returned empty response");
    }

    return this.cleanResponse(content.trim());
  }

  /**
   * Strips thinking blocks from the response if present.
   */
  private cleanResponse(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  }
}
