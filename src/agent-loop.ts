import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type {
  LLMExecutor,
  Logger,
  Message,
  PromptBuilder,
  ResponseParser,
  ToolRegistry,
} from "./interfaces.js";

/** ANSI color codes for terminal output */
const Colors = {
  USER: "\x1b[94m",
  ASSISTANT: "\x1b[93m",
  TOOL: "\x1b[90m",
  ERROR: "\x1b[91m",
  RESET: "\x1b[0m",
} as const;

/**
 * The main agent loop that orchestrates the conversation.
 *
 * Dependency Inversion: depends on abstractions (interfaces) injected via constructor.
 * Single Responsibility: only orchestrates the read-call-execute cycle.
 */
export class AgentLoop {
  private readonly conversation: Message[] = [];

  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly llmExecutor: LLMExecutor,
    private readonly responseParser: ResponseParser,
    private readonly promptBuilder: PromptBuilder,
    private readonly logger: Logger
  ) {}

  async run(): Promise<void> {
    // Initialize conversation with system prompt
    const systemPrompt = this.promptBuilder.build(this.toolRegistry.getAll());
    this.conversation.push({ role: "system", content: systemPrompt });

    this.logger.debug("INIT", "System prompt built", systemPrompt);
    this.logger.debug("INIT", `Registered tools: ${this.toolRegistry.getAll().map(t => t.name).join(", ")}`);

    const rl = readline.createInterface({ input: stdin, output: stdout });

    console.log(`${Colors.ASSISTANT}AI Design Harness ready. Describe your design project (Ctrl+C to exit).${Colors.RESET}\n`);

    try {
      while (true) {
        const userInput = await rl.question(`${Colors.USER}You:${Colors.RESET} `);
        if (!userInput.trim()) continue;

        this.conversation.push({ role: "user", content: userInput.trim() });

        this.logger.debug("USER", "User input received", userInput.trim());

        await this.processUntilDone();
      }
    } catch (err) {
      // Handle Ctrl+C / EOF gracefully
      if ((err as NodeJS.ErrnoException).code === "ERR_USE_AFTER_CLOSE") return;
      throw err;
    } finally {
      rl.close();
      console.log(`\n${Colors.ASSISTANT}Goodbye!${Colors.RESET}`);
    }
  }

  /**
   * Inner loop: keeps calling the LLM and executing tools until
   * the LLM responds without any tool invocations.
   */
  private async processUntilDone(): Promise<void> {
    const maxIterations = 50; // Safety limit to prevent infinite loops
    let iterations = 0;

    while (iterations++ < maxIterations) {
      let response: string;
      try {
        this.logger.debug("LLM", `Calling LLM (iteration ${iterations})`, {
          conversationLength: this.conversation.length,
        });
        response = await this.llmExecutor.call(this.conversation);
        this.logger.debug("LLM", "LLM response received", response);
      } catch (err) {
        this.logger.debug("LLM", "LLM call failed", (err as Error).message);
        console.error(
          `${Colors.ERROR}LLM call failed: ${(err as Error).message}${Colors.RESET}`
        );
        break;
      }

      const invocations = this.responseParser.extractToolInvocations(response);
      this.logger.debug("PARSE", `Extracted ${invocations.length} tool invocation(s)`, invocations);

      if (invocations.length === 0) {
        // No tool calls — this is the final response
        console.log(`\n${Colors.ASSISTANT}Assistant:${Colors.RESET} ${response}\n`);
        this.conversation.push({ role: "assistant", content: response });
        break;
      }

      // Execute each tool invocation
      this.conversation.push({ role: "assistant", content: response });

      for (const invocation of invocations) {
        const tool = this.toolRegistry.get(invocation.name);
        if (!tool) {
          const errorResult = { error: `Unknown tool: ${invocation.name}` };
          this.conversation.push({
            role: "user",
            content: `tool_result(${JSON.stringify(errorResult)})`,
          });
          console.log(
            `${Colors.ERROR}  ✗ Unknown tool: ${invocation.name}${Colors.RESET}`
          );
          continue;
        }

        console.log(
          `${Colors.TOOL}  ⚙ ${invocation.name}(${JSON.stringify(invocation.args)})${Colors.RESET}`
        );

        try {
          const result = await tool.execute(invocation.args);
          this.logger.debug("TOOL", `${invocation.name} result`, result);
          this.conversation.push({
            role: "user",
            content: `tool_result(${JSON.stringify(result)})`,
          });
          console.log(`${Colors.TOOL}  ✓ ${invocation.name} completed${Colors.RESET}`);
        } catch (err) {
          this.logger.debug("TOOL", `${invocation.name} threw error`, (err as Error).message);
          const errorResult = {
            error: `Tool execution failed: ${(err as Error).message}`,
          };
          this.conversation.push({
            role: "user",
            content: `tool_result(${JSON.stringify(errorResult)})`,
          });
          console.log(
            `${Colors.ERROR}  ✗ ${invocation.name} failed: ${(err as Error).message}${Colors.RESET}`
          );
        }
      }
    }

    if (iterations > maxIterations) {
      console.log(
        `${Colors.ERROR}Reached maximum iteration limit (${maxIterations}). Stopping.${Colors.RESET}`
      );
    }
  }
}
