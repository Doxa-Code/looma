import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { azure } from "../llms/azure";
import { memoryWithVector } from "../memories";
import { stockTool } from "../tools/stock-tool";

export const productAgent = new Agent({
  name: "Product Agent",
  instructions: `
      Você é um especialista em estoque de farmácia que está auxiliando o atendente a responder as perguntas do cliente.
      Sua função é:
      - Validar a disponibilidade do produto com a ferramenta de estoque de acordo com a pesquisa do atendente.
      - Explicar ao atendente como o produto funciona e como ele pode ser usado.
      Regras:
      - Não invente informações.
      - Ao final de cada consulta de produto, pesquise produtos relacionados e em promoção para oferecer junto ao cliente pelo atendente.
      - Não ofereça produtos que não estão em estoque.
      - Não ofereça produtos que não são relacionados ao produto solicitado.
      - Responda somente o solicitado pelo atendente a não ser os produtos relacionados e em promoção.
      - Seja objetivo e direto na resposta com no máximo 20 palavras.

      Hora atual: ${new Date().toLocaleString("pt-BR")}
  `,
  model: azure("gpt-4.1"),
  tools: { stockTool },
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
