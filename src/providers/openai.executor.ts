import OpenAI from "openai";
import type { LLMExecutor as ILLMExecutor, Message } from "../interfaces.js";

/**
 * Executor that uses the official OpenAI Node.js SDK.
 * Supports OpenAI's chat completions API with proper error handling,
 * automatic retries, and type safety provided by the SDK.
 */
export class OpenAIExecutor implements ILLMExecutor {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly temperature: number;
  private readonly maxTokens: number;

  constructor(options: {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}) {
    this.client = new OpenAI();
    this.model = options.model || '';
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens ?? 4096;
  }

  async call(conversation: Message[]): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: conversation.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: this.temperature,
      max_completion_tokens: this.maxTokens,
    });

    const content = completion.choices?.[0]?.message?.content;
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
