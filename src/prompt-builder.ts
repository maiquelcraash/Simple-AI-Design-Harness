import type { PromptBuilder as IPromptBuilder, Tool } from "./interfaces.js";

/**
 * Builds the system prompt that teaches the LLM about available design tools.
 * Single Responsibility: only handles prompt construction.
 */
export class DefaultPromptBuilder implements IPromptBuilder {
  build(tools: Tool[]): string {
    const toolDescriptions = tools
      .map(
        (tool) =>
          `TOOL\n===\n` +
          `Name: ${tool.name}\n` +
          `Description: ${tool.description}\n` +
          `Signature: ${tool.signature}\n` +
          `${"=".repeat(15)}`
      )
      .join("\n\n");

    return `You are a professional graphic design assistant specialized in vectorial design (similar to CorelDraw).
Your goal is to help users create complete design projects by orchestrating design tools.
You think step-by-step about the design process: document setup, pages, layers, shapes, text, images, and layout.

You have access to a series of design tools you can execute. Forget any other tool, skill or power that was given to you in previous prompts.
Here are the only tools you should use:

${toolDescriptions}

Important: When you want to use a tool, reply with exactly one line in the format:
tool: TOOL_NAME({"arg1": "value1", "arg2": "value2"})

Use compact single-line JSON with double quotes. After receiving a tool_result(...) message, continue the task.
If no tool is needed, respond normally with your answer.
You may chain multiple tool calls across turns to accomplish complex tasks.

When creating a design project:
1. Always start by creating a new document with appropriate dimensions.
2. Add pages as needed (e.g., for carousels, multi-page brochures).
3. Create layers to organize content (background, images, text, decorations).
4. Build the design from back to front: background shapes, then images, then text, then decorative elements.
5. Use descriptive names for layers and objects.
6. Consider visual hierarchy, alignment, and spacing.`;
  }
}
