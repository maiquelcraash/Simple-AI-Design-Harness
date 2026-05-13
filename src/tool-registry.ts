import type { Tool, ToolRegistry as IToolRegistry } from "./interfaces.js";

/**
 * In-memory tool registry.
 * Open/Closed Principle: new tools can be registered without modifying this class.
 */
export class DefaultToolRegistry implements IToolRegistry {
  private readonly tools = new Map<string, Tool>();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAll(): Tool[] {
    return [...this.tools.values()];
  }
}
