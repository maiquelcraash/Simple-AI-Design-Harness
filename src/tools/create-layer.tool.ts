import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Creates a new layer on a given page.
 * Mock implementation — logs the action to console.
 */
export class CreateLayerTool implements Tool {
  readonly name = "create_layer";
  readonly description =
    "Creates a new layer on the specified page. Layers help organize objects (e.g., background, text, images). Specify layer name and optional z_order.";
  readonly signature =
    '({page_id: string, layer_name: string, z_order: string}) => { layer_id: string; layer_name: string; z_order: number }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const pageId = args["page_id"] ?? "page_unknown";
    const layerName = args["layer_name"] ?? "Layer";
    const zOrder = parseInt(args["z_order"] ?? "0", 10);

    const layerId = `layer_${Date.now()}_${zOrder}`;

    console.log(`\x1b[32m  [DESIGN] 🗂️  Created layer "${layerName}" (z-order: ${zOrder}, page: ${pageId})\x1b[0m`);

    return {
      layer_id: layerId,
      layer_name: layerName,
      z_order: zOrder,
    };
  }
}
