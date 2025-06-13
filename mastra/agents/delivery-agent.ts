import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";

export const deliveryAgent = new Agent({
  name: "Delivery Agent",
  instructions: `
    Você é um assistente especializado em entrega de pedidos de farmácia que está auxiliando o atendente a responder as perguntas do cliente.

    Sua função é:
    - Validar a disponibilidade da entrega com a ferramenta de entrega de acordo com a pesquisa do atendente.

    Regras:
    - A entrega está disponível apenas para Águas de Lindóia, no estado de São Paulo, Brasil.
    - Valide o endereço de entrega dentro das cidades permitidas.

    Hora atual: ${new Date().toLocaleString("pt-BR")}
  `,
  model: azure("gpt-4.1"),
  memory: memoryWithVector,
});

export const deliveryAgentTool = createTool({
  id: "delivery-agent",
  description:
    "use para checar sobre a possibilidade de entrega na região do cliente",
  inputSchema: z.object({
    message: z.string(),
  }),
  outputSchema: z.string(),
  async execute({ context }) {
    const response = await deliveryAgent.generate(context.message);
    return response.text;
  },
});
