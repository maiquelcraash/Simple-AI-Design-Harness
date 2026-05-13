import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Draws a custom vector path using SVG-like path data (Bezier curves, lines, arcs).
 * Mock implementation — logs the action to console.
 */
export class DrawPathTool implements Tool {
  readonly name = "draw_path";
  readonly description =
    "Draws a custom vector path using SVG path data syntax (M, L, C, Q, A, Z commands). " +
    "Useful for custom shapes, decorative elements, and freeform illustrations. " +
    "Specify layer_id, path_data (SVG d attribute), fill_color, and stroke_color.";
  readonly signature =
    '(layer_id: string, path_data: string, fill_color: string, stroke_color: string) => { path_id: string; path_data: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const layerId = args["layer_id"] ?? "layer_unknown";
    const pathData = args["path_data"] ?? "M 0 0 L 100 100";
    const fillColor = args["fill_color"] ?? "none";
    const strokeColor = args["stroke_color"] ?? "#000000";

    const pathId = `path_${Date.now()}`;

    const preview = pathData.length > 50 ? pathData.substring(0, 50) + "..." : pathData;
    console.log(
      `\x1b[32m  [DESIGN] 🖊️  Drew path on layer ${layerId}: "${preview}" fill:${fillColor} stroke:${strokeColor}\x1b[0m`
    );

    return {
      path_id: pathId,
      path_data: pathData,
      fill_color: fillColor,
      stroke_color: strokeColor,
    };
  }
}
