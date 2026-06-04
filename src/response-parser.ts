import type { ResponseParser as IResponseParser, ToolInvocation } from "./interfaces.js";

/**
 * Parses LLM text output to extract tool invocations.
 * Looks for lines matching: tool: TOOL_NAME({"arg": "value"})
 *
 * Uses bracket-matching to find the JSON object boundaries rather than
 * relying on the last ")" character, which breaks when JSON values contain
 * parentheses or the LLM appends trailing text.
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
        if (!name) continue;

        const rest = after.slice(parenIndex + 1);

        // Find the JSON object using bracket-matching instead of relying on
        // the trailing ")". This handles cases where the LLM appends extra
        // characters after the closing brace or parenthesis.
        const jsonStr = this.extractJsonObject(rest);
        if (!jsonStr) continue;

        const args = JSON.parse(jsonStr) as Record<string, string>;
        invocations.push({ name, args });
      } catch (e) {
        console.log(e);
        // Malformed line — skip silently
        continue;
      }
    }

    return invocations;
  }

  /**
   * Extracts the first balanced JSON object from a string by tracking
   * brace depth while respecting string literals (so braces inside
   * strings don't confuse the matcher).
   *
   * Returns the JSON substring or null if no valid object is found.
   */
  private extractJsonObject(input: string): string | null {
    const start = input.indexOf("{");
    if (start === -1) return null;

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < input.length; i++) {
      const ch = input[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (ch === "\\") {
        if (inString) escape = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          return input.slice(start, i + 1);
        }
      }
    }

    return null;
  }
}
