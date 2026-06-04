import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Creates a new design document with specified dimensions and settings.
 * Mock implementation — logs the action to console.
 */
export class CreateDocumentTool implements Tool {
  readonly name = "create_document";
  readonly description =
    "Creates a new design document. Specify width, height (in pixels), name, and color_mode (RGB or CMYK).";
  readonly signature =
    '({name: string, width: string, height: string, color_mode: string}) => { document_id: string; name: string; width: number; height: number; color_mode: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const name = args["name"] ?? "Untitled";
    const width = parseInt(args["width"] ?? "1080", 10);
    const height = parseInt(args["height"] ?? "1080", 10);
    const colorMode = args["color_mode"] ?? "RGB";

    const documentId = `doc_${Date.now()}`;

    console.log(`\x1b[32m  [DESIGN] 📄 Created document "${name}" (${width}x${height}px, ${colorMode})\x1b[0m`);

    return {
      document_id: documentId,
      name,
      width,
      height,
      color_mode: colorMode,
    };
  }
}
