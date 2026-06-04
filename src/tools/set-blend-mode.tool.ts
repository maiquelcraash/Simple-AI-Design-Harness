import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Sets the blend mode of an object (how it composites with objects below).
 * Mock implementation — logs the action to console.
 */
export class SetBlendModeTool implements Tool {
  readonly name = "set_blend_mode";
  readonly description =
    "Sets the blend mode of an object. Modes: normal, multiply, screen, overlay, darken, lighten, " +
    "color_dodge, color_burn, hard_light, soft_light, difference, exclusion.";
  readonly signature =
    '({object_id: string, blend_mode: string}) => { object_id: string; blend_mode: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const blendMode = args["blend_mode"] ?? "normal";

    console.log(`\x1b[32m  [DESIGN] 🌈 Set blend mode of ${objectId} to "${blendMode}"\x1b[0m`);

    return {
      object_id: objectId,
      blend_mode: blendMode,
    };
  }
}
