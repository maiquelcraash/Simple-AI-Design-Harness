import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Sets the opacity/transparency of an object.
 * Mock implementation — logs the action to console.
 */
export class SetOpacityTool implements Tool {
  readonly name = "set_opacity";
  readonly description =
    "Sets the opacity of an object. Value ranges from 0 (fully transparent) to 100 (fully opaque).";
  readonly signature =
    '(object_id: string, opacity: string) => { object_id: string; opacity: number }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const opacity = Math.max(0, Math.min(100, parseInt(args["opacity"] ?? "100", 10)));

    console.log(`\x1b[32m  [DESIGN] 👁️  Set opacity of ${objectId} to ${opacity}%\x1b[0m`);

    return {
      object_id: objectId,
      opacity,
    };
  }
}
