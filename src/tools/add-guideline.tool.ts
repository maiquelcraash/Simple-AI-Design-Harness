import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Adds a guideline (horizontal or vertical) to help with alignment.
 * Mock implementation — logs the action to console.
 */
export class AddGuidelineTool implements Tool {
  readonly name = "add_guideline";
  readonly description =
    "Adds a guideline to the page for alignment reference. Specify orientation (horizontal or vertical) and position (in pixels from top/left).";
  readonly signature =
    '({page_id: string, orientation: string, position: string}) => { guideline_id: string; orientation: string; position: number }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const pageId = args["page_id"] ?? "page_unknown";
    const orientation = args["orientation"] ?? "horizontal";
    const position = parseInt(args["position"] ?? "0", 10);

    const guidelineId = `guide_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 📏 Added ${orientation} guideline at ${position}px (page: ${pageId})\x1b[0m`
    );

    return {
      guideline_id: guidelineId,
      orientation,
      position,
    };
  }
}
