import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { LLMExecutor as ILLMExecutor, Message } from "../interfaces.js";

const execFileAsync = promisify(execFile);

/**
 * Executes LLM calls by shelling out to kiro-cli.
 * This is the original executor preserved for backward compatibility.
 */
export class KiroCliExecutor implements ILLMExecutor {
  private readonly binary: string;
  private readonly maxBuffer: number;

  constructor(binary = "kiro-cli", maxBuffer = 10 * 1024 * 1024) {
    this.binary = binary;
    this.maxBuffer = maxBuffer;
  }

  async call(conversation: Message[]): Promise<string> {
    const prompt = this.serializeConversation(conversation);

    const { stdout } = await execFileAsync(
      this.binary,
      ["chat", "--no-interactive", "--trust-tools=", prompt],
      { maxBuffer: this.maxBuffer }
    );

    return stdout.trim();
  }

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
}
