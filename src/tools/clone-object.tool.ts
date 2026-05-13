import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Clones (duplicates) an existing object, optionally with an offset.
 * Mock implementation — logs the action to console.
 */
export class CloneObjectTool implements Tool {
  readonly name = "clone_object";
  readonly description =
    "Clones (duplicates) an existing object. The clone is placed with an optional offset (dx, dy) from the original. " +
    "Useful for repeating patterns, creating consistent elements across slides.";
  readonly signature =
    '(object_id: string, dx: string, dy: string) => { clone_id: string; source_id: string; offset: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const dx = parseInt(args["dx"] ?? "10", 10);
    const dy = parseInt(args["dy"] ?? "10", 10);

    const cloneId = `clone_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 🐑 Cloned ${objectId} → ${cloneId} (offset: +${dx}, +${dy})\x1b[0m`
    );

    return {
      clone_id: cloneId,
      source_id: objectId,
      offset: { dx, dy },
    };
  }
}
