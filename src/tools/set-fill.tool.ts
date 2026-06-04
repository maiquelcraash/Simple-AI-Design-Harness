import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Sets the fill properties of an object (solid, gradient, pattern, none).
 * Mock implementation — logs the action to console.
 */
export class SetFillTool implements Tool {
  readonly name = "set_fill";
  readonly description =
    "Sets the fill of an object. Fill types: solid (color hex), linear_gradient (start_color, end_color, angle), " +
    "radial_gradient (center_color, edge_color), pattern (pattern_name), none (transparent).";
  readonly signature =
    '({object_id: string, fill_type: string, color: string, start_color: string, end_color: string, angle: string}) => { object_id: string; fill: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const fillType = args["fill_type"] ?? "solid";
    const color = args["color"] ?? "#FFFFFF";
    const startColor = args["start_color"] ?? "";
    const endColor = args["end_color"] ?? "";
    const angle = args["angle"] ?? "0";

    let detail: string;
    switch (fillType) {
      case "linear_gradient":
        detail = `${startColor} → ${endColor} at ${angle}°`;
        break;
      case "radial_gradient":
        detail = `${startColor} → ${endColor} (radial)`;
        break;
      case "none":
        detail = "transparent";
        break;
      default:
        detail = color;
    }

    console.log(`\x1b[32m  [DESIGN] 🪣 Set fill on ${objectId}: ${fillType} (${detail})\x1b[0m`);

    return {
      object_id: objectId,
      fill: { type: fillType, color, start_color: startColor, end_color: endColor, angle },
    };
  }
}
