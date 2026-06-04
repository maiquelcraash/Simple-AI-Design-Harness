import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Inserts a vector shape (rectangle, ellipse, polygon, line, etc.) into a layer.
 * Mock implementation — logs the action to console.
 */
export class InsertShapeTool implements Tool {
  readonly name = "insert_shape";
  readonly description =
    "Inserts a vector shape into the specified layer. Supported shapes: rectangle, ellipse, polygon, line, star. " +
    "Specify position (x, y), size (width, height), fill_color (hex), and stroke_color (hex).";
  readonly signature =
    '({layer_id: string, shape_type: string, x: string, y: string, width: string, height: string, fill_color: string, stroke_color: string}) => { shape_id: string; shape_type: string; bounds: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const layerId = args["layer_id"] ?? "layer_unknown";
    const shapeType = args["shape_type"] ?? "rectangle";
    const x = parseInt(args["x"] ?? "0", 10);
    const y = parseInt(args["y"] ?? "0", 10);
    const width = parseInt(args["width"] ?? "100", 10);
    const height = parseInt(args["height"] ?? "100", 10);
    const fillColor = args["fill_color"] ?? "#FFFFFF";
    const strokeColor = args["stroke_color"] ?? "#000000";

    const shapeId = `shape_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] ⬡ Inserted ${shapeType} at (${x},${y}) size ${width}x${height} ` +
      `fill:${fillColor} stroke:${strokeColor} (layer: ${layerId})\x1b[0m`
    );

    return {
      shape_id: shapeId,
      shape_type: shapeType,
      bounds: { x, y, width, height },
      fill_color: fillColor,
      stroke_color: strokeColor,
    };
  }
}
