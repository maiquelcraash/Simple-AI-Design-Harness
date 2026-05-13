import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Performs boolean/pathfinder operations between two shapes (union, subtract, intersect, exclude).
 * Mock implementation — logs the action to console.
 */
export class BooleanOperationTool implements Tool {
  readonly name = "boolean_operation";
  readonly description =
    "Performs a boolean (pathfinder) operation between two shapes. Operations: union (combine), " +
    "subtract (cut shape_b from shape_a), intersect (keep overlapping area), exclude (keep non-overlapping areas). " +
    "The result replaces both source shapes.";
  readonly signature =
    '(shape_a_id: string, shape_b_id: string, operation: string) => { result_id: string; operation: string; source_shapes: string[] }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const shapeAId = args["shape_a_id"] ?? "shape_a";
    const shapeBId = args["shape_b_id"] ?? "shape_b";
    const operation = args["operation"] ?? "union";

    const resultId = `bool_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] ⊕ Boolean ${operation}: ${shapeAId} + ${shapeBId} → ${resultId}\x1b[0m`
    );

    return {
      result_id: resultId,
      operation,
      source_shapes: [shapeAId, shapeBId],
    };
  }
}
