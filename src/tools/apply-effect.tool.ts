import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Applies a visual effect to an object (shadow, blur, opacity, rounded corners, etc.).
 * Mock implementation — logs the action to console.
 */
export class ApplyEffectTool implements Tool {
  readonly name = "apply_effect";
  readonly description =
    "Applies a visual effect to an object. Supported effects: drop_shadow, blur, opacity, rounded_corners, glow, reflection. " +
    "Provide the object_id, effect_type, and effect-specific parameters as key-value pairs in params (JSON string).";
  readonly signature =
    '(object_id: string, effect_type: string, params: string) => { object_id: string; effect_type: string; applied: boolean }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const effectType = args["effect_type"] ?? "drop_shadow";
    const params = args["params"] ?? "{}";

    let parsedParams: Record<string, unknown> = {};
    try {
      parsedParams = JSON.parse(params);
    } catch {
      parsedParams = { raw: params };
    }

    console.log(
      `\x1b[32m  [DESIGN] ✨ Applied ${effectType} to ${objectId} (params: ${JSON.stringify(parsedParams)})\x1b[0m`
    );

    return {
      object_id: objectId,
      effect_type: effectType,
      params: parsedParams,
      applied: true,
    };
  }
}
