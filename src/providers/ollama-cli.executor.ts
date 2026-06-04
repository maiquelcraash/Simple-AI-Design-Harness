import { spawn } from "node:child_process";
import type { LLMExecutor as ILLMExecutor, Message } from "../interfaces.js";

/**
 * Executes LLM calls by shelling out to the Ollama CLI.
 * Usage: ollama run <model> [--think=false] "<prompt>"
 *
 * This is useful for local models where you want zero HTTP overhead.
 */
export class OllamaCliExecutor implements ILLMExecutor {
  private readonly binary: string;
  private readonly model: string;
  private readonly maxBuffer: number;
  private readonly thinkEnabled: boolean;

  constructor(options: {
    model?: string;
    binary?: string;
    maxBuffer?: number;
    think?: boolean;
  } = {}) {
    this.binary = options.binary ?? "ollama";
    this.model = options.model ?? "qwen3.5:9b";
    this.maxBuffer = options.maxBuffer ?? 10 * 1024 * 1024;
    this.thinkEnabled = options.think ?? false;
  }

  async call(conversation: Message[]): Promise<string> {
    const prompt = this.serializeConversation(conversation);

    const args: string[] = ["run", this.model, "--nowordwrap"];

    if (!this.thinkEnabled) {
      args.push("--think=false");
    }

    args.push(prompt);

    const { stdout } = await this.execOllama(args);

    return this.cleanResponse(stdout.trim());
  }

  /**
   * Spawns the ollama process with stdin closed so it doesn't hang
   * waiting for interactive input.
   */
  private execOllama(args: string[]): Promise<{ stdout: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.binary, args, {
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          ...(this.thinkEnabled ? {} : { OLLAMA_THINK: "false" }),
        },
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
        if (stdout.length > this.maxBuffer) {
          child.kill();
          reject(new Error("Output exceeded maxBuffer"));
        }
      });

      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on("error", (err) => reject(err));

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`ollama exited with code ${code}: ${stderr}`));
        } else {
          resolve({ stdout });
        }
      });
    });
  }

  /**
   * Serializes the conversation into a single prompt string.
   * Ollama CLI only accepts a single prompt, so we flatten the conversation.
   */
  private serializeConversation(conversation: Message[]): string {
    return conversation
      .map((msg) => {
        switch (msg.role) {
          case "system":
            return `[SYSTEM]\n${msg.content}`;
          case "user":
            return `[USER]\n${msg.content}`;
          case "assistant":
            return `[ASSISTANT]\n${msg.content}`;
        }
      })
      .join("\n\n---\n\n");
  }

  /**
   * Strips thinking blocks (e.g. <think>...</think>) from the response
   * in case the model still outputs them.
   */
  private cleanResponse(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  }
}
