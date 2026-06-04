import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Duplicates an existing page (with all its layers and objects).
 * Mock implementation — logs the action to console.
 */
export class DuplicatePageTool implements Tool {
  readonly name = "duplicate_page";
  readonly description =
    "Duplicates an existing page including all its layers and objects. Useful for creating carousel slides with consistent layouts. Specify the source page_id and a new_name.";
  readonly signature =
    '({page_id: string, new_name: string}) => { new_page_id: string; source_page_id: string; new_name: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const pageId = args["page_id"] ?? "page_unknown";
    const newName = args["new_name"] ?? "Page Copy";

    const newPageId = `page_${Date.now()}_dup`;

    console.log(
      `\x1b[32m  [DESIGN] 📋 Duplicated page ${pageId} → "${newName}" (new id: ${newPageId})\x1b[0m`
    );

    return {
      new_page_id: newPageId,
      source_page_id: pageId,
      new_name: newName,
    };
  }
}
