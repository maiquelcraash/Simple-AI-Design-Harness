import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Arranges/sorts objects within a layer (z-order, alignment, distribution).
 * Mock implementation — logs the action to console.
 */
export class ArrangeObjectsTool implements Tool {
  readonly name = "arrange_objects";
  readonly description =
    "Arranges objects within a layer. Actions: bring_to_front, send_to_back, align_left, align_center, align_right, " +
    "align_top, align_middle, align_bottom, distribute_horizontal, distribute_vertical. " +
    "Specify the object_ids (comma-separated) and the action.";
  readonly signature =
    '({object_ids: string, action: string}) => { object_ids: string[]; action: string; status: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectIds = (args["object_ids"] ?? "").split(",").map((id) => id.trim()).filter(Boolean);
    const action = args["action"] ?? "align_center";

    console.log(
      `\x1b[32m  [DESIGN] 📐 Arranged ${objectIds.length} object(s): ${action}\x1b[0m`
    );

    return {
      object_ids: objectIds,
      action,
      status: "applied",
    };
  }
}
