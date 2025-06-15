import { Agent } from "@mastra/core/agent";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";
import { sendMessageTool } from "../tools/send-message-tool";
import { faqAgentTool } from "./faq-agent";
import { orderAgentTool } from "./order-agent";
import { productAgentTool } from "./product-agent";
import instructions from "../prompts/looma-prompt";

export const loomaAgent = new Agent({
  name: "Looma Agent",
  instructions,
  model: azure("gpt-4.1"),
  memory: memoryWithVector,
  tools: {
    orderAgentTool,
    productAgentTool,
    sendMessageTool,
    faqAgentTool,
  },
});
