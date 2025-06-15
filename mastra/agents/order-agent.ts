import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { Memory } from "@mastra/memory";
import { z } from "zod";
import { azure, azureEmbeddings } from "../llms/azure";
import { postgresStore } from "../store/postgres-store";
import { consultingCepTool } from "../tools/consulting-cep-tool";
import {
  createOrderTool,
  deleteOrderTool,
  updateOrderTool,
} from "../tools/order-tools";
import { stockTool } from "../tools/stock-tool";
import { pineconeVector } from "../vectors/pinecone-vector";
import instructions from "../prompts/order-prompt";

const memoryWithVectorAndNote = new Memory({
  embedder: azureEmbeddings.textEmbeddingModel("text-embedding-3-small"),
  vector: pineconeVector,
  storage: postgresStore,
  options: {
    semanticRecall: {
      topK: 5,
      scope: "resource",
      messageRange: 3,
    },
    workingMemory: {
      enabled: true,
      template: `
      - Nome do cliente:
      - Endereço do cliente (Peça inicialmente o CEP, se a ferramenta de consulta de CEP não retornar o endereço, peça os dados faltantes - Rua, número, complemento, bairro, cidade, estado, CEP):
      - Forma de pagamento desejada (pix, dinheiro, cartão):
      - Produtos:
      -- Nome do produto:
      -- Preço unitário do produto (Promocional ou não):
      -- Quantidade:
      -- Preço total do produto:
      - Preço total do pedido:
      `,
    },
  },
});

export const orderAgent = new Agent({
  name: "Order Agent",
  instructions,
  model: azure("gpt-4.1"),
  memory: memoryWithVectorAndNote,
  tools: {
    createOrderTool,
    consultingCepTool,
    updateOrderTool,
    deleteOrderTool,
    stockTool,
  },
});

export const orderAgentTool = createTool({
  id: "order-agent",
  description:
    "use para criar um pedido, atualizar um pedido ou deletar um pedido",
  inputSchema: z.object({
    message: z.string(),
  }),
  outputSchema: z.string(),
  async execute({ context }) {
    const response = await orderAgent.generate(context.message);
    return response.text;
  },
});
