import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Sets the stroke/outline properties of an object.
 * Mock implementation — logs the action to console.
 */
export class SetStrokeTool implements Tool {
  readonly name = "set_stroke";
  readonly description =
    "Sets the stroke (outline) of an object. Specify color (hex), width (in px), style (solid, dashed, dotted, dash_dot), " +
    "and line_cap (butt, round, square).";
  readonly signature =
    '({object_id: string, color: string, width: string, style: string, line_cap: string}) => { object_id: string; stroke: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const color = args["color"] ?? "#000000";
    const width = parseFloat(args["width"] ?? "1");
    const style = args["style"] ?? "solid";
    const lineCap = args["line_cap"] ?? "butt";

    console.log(
      `\x1b[32m  [DESIGN] ✒️  Set stroke on ${objectId}: ${color} ${width}px ${style} cap:${lineCap}\x1b[0m`
    );

    return {
      object_id: objectId,
      stroke: { color, width, style, line_cap: lineCap },
    };
  }
}
