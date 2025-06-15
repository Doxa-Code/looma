import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";
import { stockTool } from "../tools/stock-tool";
import { knowledgeBaseTool } from "../tools/knowledge-base-tool";
import instructions from "../prompts/product-prompt";

export const productAgent = new Agent({
  name: "Product Agent",
  instructions,
  model: azure("gpt-4.1"),
  tools: { stockTool, knowledgeBaseTool },
  memory: memoryWithVector,
});

export const productAgentTool = createTool({
  id: "product-agent",
  description:
    "use para verificar a disponibilidade do produto, explicar como o produto funciona e como ele pode ser usado",
  inputSchema: z.object({
    message: z.string(),
  }),
  outputSchema: z.string(),
  async execute({ context }) {
    const response = await productAgent.generate(context.message);
    return response.text;
  },
});
