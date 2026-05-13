import { AgentLoop } from "./agent-loop.js";
import { DefaultToolRegistry } from "./tool-registry.js";
import { DefaultResponseParser } from "./response-parser.js";
import { DefaultPromptBuilder } from "./prompt-builder.js";
import { ConsoleLogger, NullLogger } from "./logger.js";
import {
  // Document & Page management
  CreateDocumentTool,
  CreatePageTool,
  DuplicatePageTool,
  CreateLayerTool,
  // Drawing & Shapes
  InsertShapeTool,
  DrawPathTool,
  BooleanOperationTool,
  // Text
  InsertTextTool,
  TextOnPathTool,
  // Images
  GenerateImageTool,
  ImportImageTool,
  // Appearance & Styling
  SetBackgroundTool,
  SetFillTool,
  SetStrokeTool,
  SetOpacityTool,
  SetBlendModeTool,
  ApplyEffectTool,
  CreateColorPaletteTool,
  // Object manipulation
  TransformObjectTool,
  ResizeObjectTool,
  CloneObjectTool,
  DeleteObjectTool,
  ArrangeObjectsTool,
  GroupObjectsTool,
  UngroupObjectsTool,
  CreateClippingMaskTool,
  // Symbols & Reusable components
  CreateSymbolTool,
  InsertSymbolTool,
  // Layout helpers
  AddGuidelineTool,
  // Export
  ExportDocumentTool,
} from "./tools/index.js";
import { createExecutor, parseConfig } from "./providers/index.js";

/**
 * Composition root — wires all dependencies together.
 * AI Design Harness: orchestrates vectorial design workflows via LLM tool calls.
 */
function main(): void {
  const debugEnabled =
    process.argv.includes("--debug") || process.env["DEBUG"] === "true";
  const logger = debugEnabled ? new ConsoleLogger(true) : new NullLogger();

  const config = parseConfig();

  if (debugEnabled) {
    logger.debug("INIT", "Debug mode enabled");
    logger.debug("INIT", "Provider config", config);
  }

  // Build the tool registry with all design tools
  const registry = new DefaultToolRegistry();

  // Document & Page management
  registry.register(new CreateDocumentTool());
  registry.register(new CreatePageTool());
  registry.register(new DuplicatePageTool());
  registry.register(new CreateLayerTool());

  // Drawing & Shapes
  registry.register(new InsertShapeTool());
  registry.register(new DrawPathTool());
  registry.register(new BooleanOperationTool());

  // Text
  registry.register(new InsertTextTool());
  registry.register(new TextOnPathTool());

  // Images
  registry.register(new GenerateImageTool());
  registry.register(new ImportImageTool());

  // Appearance & Styling
  registry.register(new SetBackgroundTool());
  registry.register(new SetFillTool());
  registry.register(new SetStrokeTool());
  registry.register(new SetOpacityTool());
  registry.register(new SetBlendModeTool());
  registry.register(new ApplyEffectTool());
  registry.register(new CreateColorPaletteTool());

  // Object manipulation
  registry.register(new TransformObjectTool());
  registry.register(new ResizeObjectTool());
  registry.register(new CloneObjectTool());
  registry.register(new DeleteObjectTool());
  registry.register(new ArrangeObjectsTool());
  registry.register(new GroupObjectsTool());
  registry.register(new UngroupObjectsTool());
  registry.register(new CreateClippingMaskTool());

  // Symbols & Reusable components
  registry.register(new CreateSymbolTool());
  registry.register(new InsertSymbolTool());

  // Layout helpers
  registry.register(new AddGuidelineTool());

  // Export
  registry.register(new ExportDocumentTool());

  // Wire up the agent with all its dependencies
  const executor = createExecutor(config);
  const parser = new DefaultResponseParser();
  const promptBuilder = new DefaultPromptBuilder();

  const agent = new AgentLoop(registry, executor, parser, promptBuilder, logger);

  // Print startup info
  const modelDisplay = config.model ?? "(default)";
  console.log(`\x1b[36m🎨 AI Design Harness\x1b[0m`);
  console.log(`\x1b[36mProvider: ${config.provider} | Model: ${modelDisplay}\x1b[0m`);
  console.log(`\x1b[36mTools (${registry.getAll().length}): ${registry.getAll().map(t => t.name).join(", ")}\x1b[0m\n`);

  agent.run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

main();
