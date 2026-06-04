import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Resizes an object to specific dimensions.
 * Mock implementation — logs the action to console.
 */
export class ResizeObjectTool implements Tool {
  readonly name = "resize_object";
  readonly description =
    "Resizes an object to the specified width and height. Optionally maintain aspect ratio with lock_ratio set to 'true'.";
  readonly signature =
    '({object_id: string, width: string, height: string, lock_ratio: string}) => { object_id: string; new_size: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const width = parseInt(args["width"] ?? "100", 10);
    const height = parseInt(args["height"] ?? "100", 10);
    const lockRatio = args["lock_ratio"] === "true";

    console.log(
      `\x1b[32m  [DESIGN] ↔️  Resized ${objectId} to ${width}x${height}${lockRatio ? " (ratio locked)" : ""}\x1b[0m`
    );

    return {
      object_id: objectId,
      new_size: { width, height },
      lock_ratio: lockRatio,
    };
  }
}
