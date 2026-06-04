import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Sets the background color or gradient for a page.
 * Mock implementation — logs the action to console.
 */
export class SetBackgroundTool implements Tool {
  readonly name = "set_background";
  readonly description =
    "Sets the background for a page. Supports solid color (hex) or gradient (provide start_color and end_color with direction: horizontal, vertical, radial).";
  readonly signature =
    '({page_id: string, bg_type: string, color: string, start_color: string, end_color: string, direction: string}) => { page_id: string; background: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const pageId = args["page_id"] ?? "page_unknown";
    const bgType = args["bg_type"] ?? "solid";
    const color = args["color"] ?? "#FFFFFF";
    const startColor = args["start_color"] ?? "";
    const endColor = args["end_color"] ?? "";
    const direction = args["direction"] ?? "vertical";

    if (bgType === "gradient") {
      console.log(
        `\x1b[32m  [DESIGN] 🎨 Set gradient background ${startColor} → ${endColor} (${direction}) on page ${pageId}\x1b[0m`
      );
      return {
        page_id: pageId,
        background: { type: "gradient", start_color: startColor, end_color: endColor, direction },
      };
    }

    console.log(`\x1b[32m  [DESIGN] 🎨 Set solid background ${color} on page ${pageId}\x1b[0m`);
    return {
      page_id: pageId,
      background: { type: "solid", color },
    };
  }
}
