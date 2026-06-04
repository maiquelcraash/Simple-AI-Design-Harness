import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Inserts a text object into a layer.
 * Mock implementation — logs the action to console.
 */
export class InsertTextTool implements Tool {
  readonly name = "insert_text";
  readonly description =
    "Inserts a text object into the specified layer. Specify content, position (x, y), font_family, font_size, font_color (hex), and optional alignment (left, center, right).";
  readonly signature =
    '({layer_id: string, content: string, x: string, y: string, font_family: string, font_size: string, font_color: string, alignment: string}) => { text_id: string; content: string; position: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const layerId = args["layer_id"] ?? "layer_unknown";
    const content = args["content"] ?? "Text";
    const x = parseInt(args["x"] ?? "0", 10);
    const y = parseInt(args["y"] ?? "0", 10);
    const fontFamily = args["font_family"] ?? "Arial";
    const fontSize = parseInt(args["font_size"] ?? "24", 10);
    const fontColor = args["font_color"] ?? "#000000";
    const alignment = args["alignment"] ?? "left";

    const textId = `text_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] ✏️  Inserted text "${content.substring(0, 40)}${content.length > 40 ? "..." : ""}" ` +
      `at (${x},${y}) ${fontFamily} ${fontSize}px ${fontColor} align:${alignment} (layer: ${layerId})\x1b[0m`
    );

    return {
      text_id: textId,
      content,
      position: { x, y },
      font: { family: fontFamily, size: fontSize, color: fontColor },
      alignment,
    };
  }
}
