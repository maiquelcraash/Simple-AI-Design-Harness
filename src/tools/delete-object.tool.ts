import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Deletes an object from the design.
 * Mock implementation — logs the action to console.
 */
export class DeleteObjectTool implements Tool {
  readonly name = "delete_object";
  readonly description =
    "Deletes an object (shape, text, image, group, or path) from the design by its object_id.";
  readonly signature =
    '({object_id: string}) => { object_id: string; deleted: boolean }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";

    console.log(`\x1b[32m  [DESIGN] 🗑️  Deleted object ${objectId}\x1b[0m`);

    return {
      object_id: objectId,
      deleted: true,
    };
  }
}
