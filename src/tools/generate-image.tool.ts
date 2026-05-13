import type { Tool, ToolResult } from "../interfaces.js";

/**
 * Generates an AI image based on a text prompt.
 * Mock implementation — logs the action to console.
 */
export class GenerateImageTool implements Tool {
  readonly name = "generate_image";
  readonly description =
    "Generates an AI image from a text prompt. Specify the prompt describing the desired image, width, and height. Returns a reference to the generated image file.";
  readonly signature =
    '(prompt: string, width: string, height: string, style: string) => { image_id: string; file_path: string; prompt: string; dimensions: object }';

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const prompt = args["prompt"] ?? "an image";
    const width = parseInt(args["width"] ?? "1080", 10);
    const height = parseInt(args["height"] ?? "1080", 10);
    const style = args["style"] ?? "photorealistic";

    const imageId = `img_${Date.now()}`;
    const filePath = `/tmp/generated/${imageId}.png`;

    console.log(
      `\x1b[32m  [DESIGN] 🎨 Generated AI image (${width}x${height}, style: ${style})\x1b[0m\n` +
      `\x1b[32m           Prompt: "${prompt.substring(0, 60)}${prompt.length > 60 ? "..." : ""}"\x1b[0m`
    );

    return {
      image_id: imageId,
      file_path: filePath,
      prompt,
      dimensions: { width, height },
      style,
    };
  }
}
