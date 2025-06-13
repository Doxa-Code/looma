import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";

export const paymentAgent = new Agent({
  name: "Payment Agent",
  instructions: `
      Você é um assistente de farmácia focado na etapa de pagamento, auxiliando o atendente a responder ao cliente,
      
      Sua função é:
      - Validar métodos de pagamento obedecendo as seguintes diretrizes:
        - O pagamento é feito na entrega; peça ao atendente perguntar apenas sobre a forma de pagamento.
        - Somente quando o cliente escolher dinheiro como forma de pagamento - Peça ao atendente perguntar ao cliente se ele precisa de troco.
        - As unicas formas de pagamentos aceita é: Pix, Dinheiro ou Cartão.

      Regras:
      - Não invente informações.
      - Seja objetivo e direto na resposta com no máximo 20 palavras.

      Hora atual: ${new Date().toLocaleString("pt-BR")}
  `,
  model: azure("gpt-4.1"),
  memory: memoryWithVector,
});

export const paymentAgentTool = createTool({
  id: "payment-agent",
  description: "use para checar sobre formas de pagamento",
  inputSchema: z.object({
    message: z.string(),
  }),
  outputSchema: z.string(),
  async execute({ context }) {
    const response = await paymentAgent.generate(context.message);
    return response.text;
  },
});
