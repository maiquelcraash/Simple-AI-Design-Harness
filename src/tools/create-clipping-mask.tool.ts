import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Creates a clipping mask — clips content_object to the shape of mask_object.
 * Mock implementation — logs the action to console.
 */
export class CreateClippingMaskTool implements Tool {
  readonly name = "create_clipping_mask";
  readonly description =
    "Creates a clipping mask. The content_object is clipped to the shape of the mask_object. " +
    "Useful for placing images inside shapes (e.g., circular profile photos, text-shaped image fills).";
  readonly signature =
    '(mask_object_id: string, content_object_id: string) => { mask_id: string; mask_object: string; content_object: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const maskObjectId = args["mask_object_id"] ?? "mask_unknown";
    const contentObjectId = args["content_object_id"] ?? "content_unknown";

    const maskId = `mask_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 🎭 Created clipping mask: ${contentObjectId} clipped by ${maskObjectId}\x1b[0m`
    );

    return {
      mask_id: maskId,
      mask_object: maskObjectId,
      content_object: contentObjectId,
    };
  }
}
