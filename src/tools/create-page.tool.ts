import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Adds a new page to the current document.
 * Mock implementation — logs the action to console.
 */
export class CreatePageTool implements Tool {
  readonly name = "create_page";
  readonly description =
    "Adds a new page to the document. Specify the page name and optionally its position (index).";
  readonly signature =
    '({document_id: string, page_name: string, position: string}) => { page_id: string; page_name: string; position: number }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const documentId = args["document_id"] ?? "doc_unknown";
    const pageName = args["page_name"] ?? "Page";
    const position = parseInt(args["position"] ?? "1", 10);

    const pageId = `page_${Date.now()}_${position}`;

    console.log(`\x1b[32m  [DESIGN] 📑 Added page "${pageName}" at position ${position} (doc: ${documentId})\x1b[0m`);

    return {
      page_id: pageId,
      page_name: pageName,
      position,
    };
  }
}
