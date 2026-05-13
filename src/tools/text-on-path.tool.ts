import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Places text along a path (curve, circle, custom shape).
 * Mock implementation — logs the action to console.
 */
export class TextOnPathTool implements Tool {
  readonly name = "text_on_path";
  readonly description =
    "Places text along a path or shape outline. Specify the text content, the path_id or shape_id to follow, " +
    "font_family, font_size, font_color, and offset (distance from path).";
  readonly signature =
    '(path_id: string, content: string, font_family: string, font_size: string, font_color: string, offset: string) => { text_id: string; path_id: string; content: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const pathId = args["path_id"] ?? "path_unknown";
    const content = args["content"] ?? "Text";
    const fontFamily = args["font_family"] ?? "Arial";
    const fontSize = parseInt(args["font_size"] ?? "24", 10);
    const fontColor = args["font_color"] ?? "#000000";
    const offset = parseInt(args["offset"] ?? "0", 10);

    const textId = `textpath_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 〰️  Text on path ${pathId}: "${content.substring(0, 30)}" ` +
      `${fontFamily} ${fontSize}px ${fontColor} offset:${offset}\x1b[0m`
    );

    return {
      text_id: textId,
      path_id: pathId,
      content,
      font: { family: fontFamily, size: fontSize, color: fontColor },
      offset,
    };
  }
}
