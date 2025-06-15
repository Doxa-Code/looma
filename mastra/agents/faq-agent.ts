import { createTool } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";
import { consultingCepTool } from "../tools/consulting-cep-tool";
import { knowledgeBaseTool } from "../tools/knowledge-base-tool";
import instructions from "../prompts/faq-prompt";

export const faqAgent = new Agent({
  name: "FAQ Agent",
  instructions,
  model: azure("gpt-4.1"),
  memory: memoryWithVector,
  tools: {
    knowledgeBaseTool,
    consultingCepTool,
  },
});

export const faqAgentTool = createTool({
  id: "faq-agent",
  description: "use para responder perguntas frequentes sobre a farmácia",
  inputSchema: z.object({
    message: z.string(),
  }),
  async execute({ context }) {
    const response = await faqAgent.generate(context.message);
    return response.text;
  },
});
