import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Inserts an instance of a reusable symbol into a layer.
 * Mock implementation — logs the action to console.
 */
export class InsertSymbolTool implements Tool {
  readonly name = "insert_symbol";
  readonly description =
    "Inserts an instance of a previously created symbol into a layer. Specify position (x, y) and optional scale.";
  readonly signature =
    '(layer_id: string, symbol_id: string, x: string, y: string, scale: string) => { instance_id: string; symbol_id: string; position: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const layerId = args["layer_id"] ?? "layer_unknown";
    const symbolId = args["symbol_id"] ?? "symbol_unknown";
    const x = parseInt(args["x"] ?? "0", 10);
    const y = parseInt(args["y"] ?? "0", 10);
    const scale = parseFloat(args["scale"] ?? "1");

    const instanceId = `instance_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 🔗 Inserted symbol ${symbolId} at (${x},${y}) scale:${scale} (layer: ${layerId})\x1b[0m`
    );

    return {
      instance_id: instanceId,
      symbol_id: symbolId,
      position: { x, y },
      scale,
    };
  }
}
