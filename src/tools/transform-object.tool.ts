import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Applies geometric transformations to an object (move, scale, rotate, skew, flip).
 * Mock implementation — logs the action to console.
 */
export class TransformObjectTool implements Tool {
  readonly name = "transform_object";
  readonly description =
    "Applies a geometric transformation to an object. Supported transforms: move (dx, dy), scale (sx, sy), " +
    "rotate (angle in degrees), skew (angle_x, angle_y), flip_horizontal, flip_vertical. " +
    "Provide the object_id, transform_type, and relevant numeric params.";
  readonly signature =
    '(object_id: string, transform_type: string, param1: string, param2: string) => { object_id: string; transform_type: string; applied: boolean }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const transformType = args["transform_type"] ?? "move";
    const param1 = args["param1"] ?? "0";
    const param2 = args["param2"] ?? "0";

    let detail = "";
    switch (transformType) {
      case "move":
        detail = `dx:${param1}, dy:${param2}`;
        break;
      case "scale":
        detail = `sx:${param1}, sy:${param2}`;
        break;
      case "rotate":
        detail = `angle:${param1}°`;
        break;
      case "skew":
        detail = `angle_x:${param1}°, angle_y:${param2}°`;
        break;
      case "flip_horizontal":
      case "flip_vertical":
        detail = transformType;
        break;
      default:
        detail = `${param1}, ${param2}`;
    }

    console.log(
      `\x1b[32m  [DESIGN] 🔄 Transform ${objectId}: ${transformType} (${detail})\x1b[0m`
    );

    return {
      object_id: objectId,
      transform_type: transformType,
      params: { param1, param2 },
      applied: true,
    };
  }
}
