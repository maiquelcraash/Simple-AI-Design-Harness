import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Creates a reusable symbol (like a component) from an object or group.
 * Mock implementation — logs the action to console.
 */
export class CreateSymbolTool implements Tool {
  readonly name = "create_symbol";
  readonly description =
    "Creates a reusable symbol from an object or group. Symbols are like components — " +
    "editing the master updates all instances. Useful for logos, icons, or repeated design elements.";
  readonly signature =
    '({object_id: string, symbol_name: string}) => { symbol_id: string; symbol_name: string; source_object: string }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectId = args["object_id"] ?? "obj_unknown";
    const symbolName = args["symbol_name"] ?? "Symbol";

    const symbolId = `symbol_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 🔗 Created symbol "${symbolName}" from ${objectId} (id: ${symbolId})\x1b[0m`
    );

    return {
      symbol_id: symbolId,
      symbol_name: symbolName,
      source_object: objectId,
    };
  }
}
