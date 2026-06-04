import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Groups multiple objects together so they can be moved/transformed as one unit.
 * Mock implementation — logs the action to console.
 */
export class GroupObjectsTool implements Tool {
  readonly name = "group_objects";
  readonly description =
    "Groups multiple objects together into a single group. Grouped objects move, scale, and rotate as one unit. " +
    "Specify object_ids (comma-separated) and an optional group_name.";
  readonly signature =
    '({object_ids: string, group_name: string}) => { group_id: string; group_name: string; children: string[] }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const objectIds = (args["object_ids"] ?? "").split(",").map((id) => id.trim()).filter(Boolean);
    const groupName = args["group_name"] ?? "Group";

    const groupId = `group_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 📦 Grouped ${objectIds.length} objects as "${groupName}" (id: ${groupId})\x1b[0m`
    );

    return {
      group_id: groupId,
      group_name: groupName,
      children: objectIds,
    };
  }
}
