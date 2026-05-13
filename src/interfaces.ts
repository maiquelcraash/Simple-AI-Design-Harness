/**
 * Core interfaces for the AI harness.
 * Following Interface Segregation Principle — each interface is focused and minimal.
 */

/** Result returned by any tool execution */
export interface ToolResult {
  [key: string]: unknown;
}

/** A tool that the agent can invoke */
export interface Tool {
  /** Unique name used by the LLM to reference this tool */
  readonly name: string;
  /** Human-readable description included in the system prompt */
  readonly description: string;
  /** Parameter signature description for the LLM */
  readonly signature: string;
  /** Execute the tool with the given arguments */
  execute(args: Record<string, string>): Promise<ToolResult>;
}

/** Registry that holds and resolves tools by name */
export interface ToolRegistry {
  register(tool: Tool): void;
  get(name: string): Tool | undefined;
  getAll(): Tool[];
}

/** A single parsed tool invocation from LLM output */
export interface ToolInvocation {
  name: string;
  args: Record<string, string>;
}

/** Parses raw LLM text to extract tool invocations */
export interface ResponseParser {
  extractToolInvocations(text: string): ToolInvocation[];
}

/** Message in the conversation history */
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Executes an LLM call and returns the assistant's response text */
export interface LLMExecutor {
  call(conversation: Message[]): Promise<string>;
}

/** Builds the system prompt from registered tools */
export interface PromptBuilder {
  build(tools: Tool[]): string;
}

/** Logger abstraction for debug/trace output */
export interface Logger {
  /** Whether debug logging is enabled */
  readonly enabled: boolean;
  /** Log a debug message with an optional data payload */
  debug(category: string, message: string, data?: unknown): void;
}
