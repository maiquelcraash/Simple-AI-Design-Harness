import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Imports an image file into a layer.
 * Mock implementation — logs the action to console.
 */
export class ImportImageTool implements Tool {
  readonly name = "import_image";
  readonly description =
    "Imports an image (from file path or generated image_id) into the specified layer. Specify position (x, y) and optional size (width, height) to scale.";
  readonly signature =
    '(layer_id: string, source: string, x: string, y: string, width: string, height: string) => { object_id: string; source: string; bounds: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const layerId = args["layer_id"] ?? "layer_unknown";
    const source = args["source"] ?? "unknown_source";
    const x = parseInt(args["x"] ?? "0", 10);
    const y = parseInt(args["y"] ?? "0", 10);
    const width = args["width"] ? parseInt(args["width"], 10) : undefined;
    const height = args["height"] ? parseInt(args["height"], 10) : undefined;

    const objectId = `imgobj_${Date.now()}`;

    const sizeStr = width && height ? ` scaled to ${width}x${height}` : " (original size)";
    console.log(
      `\x1b[32m  [DESIGN] 🖼️  Imported image "${source}" at (${x},${y})${sizeStr} (layer: ${layerId})\x1b[0m`
    );

    return {
      object_id: objectId,
      source,
      bounds: { x, y, width: width ?? "auto", height: height ?? "auto" },
    };
  }
}
