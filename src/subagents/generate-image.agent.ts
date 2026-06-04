import type { Tool, ToolResult, LLMExecutor, Message } from "../interfaces.js";
import { createExecutor, type ProviderConfig } from "../providers/provider-factory.js";

/** Configuration for the image-generation subagent */
export interface GenerateImageSubagentConfig {
  /** Provider to use for the subagent (defaults to main agent provider) */
  provider?: ProviderConfig["provider"];
  /** Model optimized for image generation prompts (e.g. "dall-e-3", "stable-diffusion-xl") */
  model?: string;
  /** Base URL override for the subagent's LLM endpoint */
  baseUrl?: string;
  /** API key override for the subagent's LLM endpoint */
  apiKey?: string;
  /** Temperature for creative generation (defaults to 0.9) */
  temperature?: number;
  /** Max tokens for the subagent response */
  maxTokens?: number;
}

/** ANSI color codes for subagent terminal output */
const SubagentColors = {
  HEADER: "\x1b[35m",   // magenta for subagent identity
  ACTION: "\x1b[32m",   // green for actions
  DETAIL: "\x1b[90m",   // gray for details
  RESET: "\x1b[0m",
} as const;

/**
 * Generates an AI image based on a text prompt.
 * Operates as a SUBAGENT — delegates the image prompt refinement to a separate
 * LLM executor (potentially a different model optimized for image generation),
 * then simulates the image creation.
 *
 * The subagent model can be configured independently from the main orchestrator.
 */
export class GenerateImageTool implements Tool {
  readonly name = "generate_image";
  readonly description =
    "Generates an AI image from a text prompt using a dedicated subagent. " +
    "The subagent refines the prompt for optimal image generation. " +
    "Specify the prompt describing the desired image, width, height, and style. " +
    "Returns a reference to the generated image file.";
  readonly signature =
    '({prompt: string, width: string, height: string, style: string}) => { image_id: string; file_path: string; prompt: string; refined_prompt: string; dimensions: object; subagent_model: string }';

  private readonly subagentExecutor: LLMExecutor | null;
  private readonly subagentModel: string;

  constructor(config?: GenerateImageSubagentConfig) {
    const provider = config?.provider ?? (process.env["IMAGE_SUBAGENT_PROVIDER"] as ProviderConfig["provider"]) ?? null;
    const model = config?.model ?? process.env["IMAGE_SUBAGENT_MODEL"] ?? undefined;

    this.subagentModel = model ?? "(mock — no subagent provider configured)";

    if (provider) {
      this.subagentExecutor = createExecutor({
        provider,
        model,
        baseUrl: config?.baseUrl ?? process.env["IMAGE_SUBAGENT_BASE_URL"],
        apiKey: config?.apiKey ?? process.env["IMAGE_SUBAGENT_API_KEY"],
        temperature: config?.temperature ?? 0.9,
        maxTokens: config?.maxTokens ?? 1024,
      });
    } else {
      // No subagent configured — will use mock refinement
      this.subagentExecutor = null;
    }
  }

  async execute(args: Record<string, string>): Promise<ToolResult> {
    const prompt = args["prompt"] ?? "an image";
    const width = parseInt(args["width"] ?? "1080", 10);
    const height = parseInt(args["height"] ?? "1080", 10);
    const style = args["style"] ?? "photorealistic";

    const imageId = `img_${Date.now()}`;
    const filePath = `/tmp/generated/${imageId}.png`;

    // --- Subagent logging ---
    console.log(
      `\n${SubagentColors.HEADER}  [SUBAGENT] 🤖 Image Generation Subagent activated${SubagentColors.RESET}`
    );
    console.log(
      `${SubagentColors.DETAIL}             Model: ${this.subagentModel}${SubagentColors.RESET}`
    );

    // --- Subagent prompt refinement step ---
    let refinedPrompt: string;

    if (this.subagentExecutor) {
      console.log(
        `${SubagentColors.DETAIL}             ↳ Delegating prompt refinement to subagent LLM...${SubagentColors.RESET}`
      );

      const refinementMessages: Message[] = [
        {
          role: "system",
          content:
            "You are an image-generation prompt engineer. Given a user's description, " +
            "refine it into a detailed, specific prompt optimized for AI image generation. " +
            `Target style: ${style}. Output ONLY the refined prompt, nothing else.`,
        },
        {
          role: "user",
          content: `Refine this prompt for ${width}x${height} image generation:\n"${prompt}"`,
        },
      ];

      try {
        refinedPrompt = await this.subagentExecutor.call(refinementMessages);
        refinedPrompt = refinedPrompt.trim();
        console.log(
          `${SubagentColors.DETAIL}             ↳ Subagent refined prompt successfully${SubagentColors.RESET}`
        );
      } catch (err) {
        console.log(
          `${SubagentColors.DETAIL}             ↳ Subagent call failed, using original prompt: ${(err as Error).message}${SubagentColors.RESET}`
        );
        refinedPrompt = prompt;
      }
    } else {
      // Mock refinement when no subagent is configured
      refinedPrompt = `[${style}] ${prompt}, high quality, detailed, ${width}x${height} resolution`;
      console.log(
        `${SubagentColors.DETAIL}             ↳ Using mock prompt refinement (no subagent LLM configured)${SubagentColors.RESET}`
      );
    }

    // --- Simulated image generation ---
    console.log(
      `${SubagentColors.ACTION}  [SUBAGENT] 🎨 Generated AI image (${width}x${height}, style: ${style})${SubagentColors.RESET}`
    );
    console.log(
      `${SubagentColors.ACTION}             Original: "${prompt.substring(0, 120)}${prompt.length > 120 ? "..." : ""}"${SubagentColors.RESET}`
    );
    console.log(
      `${SubagentColors.ACTION}             Refined:  "${refinedPrompt.substring(0, 120)}${refinedPrompt.length > 120 ? "..." : ""}"${SubagentColors.RESET}`
    );
    console.log(
      `${SubagentColors.HEADER}  [SUBAGENT] ✓ Image generation subagent completed${SubagentColors.RESET}\n`
    );

    return {
      image_id: imageId,
      file_path: filePath,
      prompt,
      refined_prompt: refinedPrompt,
      dimensions: { width, height },
      style,
      subagent_model: this.subagentModel,
    };
  }
}
