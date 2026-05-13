import type { ResponseParser as IResponseParser, ToolInvocation } from "./interfaces.js";

/**
 * Parses LLM text output to extract tool invocations.
 * Looks for lines matching: tool: TOOL_NAME({"arg": "value"})
 *
 * Single Responsibility: only handles parsing logic.
 */
export class DefaultResponseParser implements IResponseParser {
  extractToolInvocations(text: string): ToolInvocation[] {
    const invocations: ToolInvocation[] = [];

    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (!line.startsWith("tool:")) continue;

      try {
        const after = line.slice("tool:".length).trim();
        const parenIndex = after.indexOf("(");
        if (parenIndex === -1) continue;

        const name = after.slice(0, parenIndex).trim();
        const rest = after.slice(parenIndex + 1);

        if (!rest.endsWith(")")) continue;

        const jsonStr = rest.slice(0, -1).trim();
        const args = JSON.parse(jsonStr) as Record<string, string>;
        invocations.push({ name, args });
      } catch {
        // Malformed line — skip silently
        continue;
      }
    }

    return invocations;
  }
}
