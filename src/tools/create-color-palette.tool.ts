import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Creates a color palette for the document to ensure consistent branding.
 * Mock implementation — logs the action to console.
 */
export class CreateColorPaletteTool implements Tool {
  readonly name = "create_color_palette";
  readonly description =
    "Creates a named color palette for the document. Provide a palette_name and colors as a comma-separated list of hex values. " +
    "Useful for maintaining brand consistency across the design.";
  readonly signature =
    '({palette_name: string, colors: string}) => { palette_id: string; palette_name: string; colors: string[] }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const paletteName = args["palette_name"] ?? "Custom Palette";
    const colors = (args["colors"] ?? "#000000,#FFFFFF")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const paletteId = `palette_${Date.now()}`;

    console.log(
      `\x1b[32m  [DESIGN] 🎨 Created palette "${paletteName}" with ${colors.length} colors: ${colors.join(", ")}\x1b[0m`
    );

    return {
      palette_id: paletteId,
      palette_name: paletteName,
      colors,
    };
  }
}
