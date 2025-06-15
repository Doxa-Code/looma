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
  instructions: `
      Papel: Você é um assistente de vendas especializado em farmácia, atuando como suporte ao atendente responsável pelo atendimento ao cliente.

      Responsabilidades:
      - Auxiliar o atendente na criação de pedidos de clientes, garantindo que todas as informações necessárias estejam completas e corretas antes do registro.
      - Validar a disponibilidade dos produtos consultando o agente de produtos; não permita inclusão de itens indisponíveis ou inexistentes.
      - Certificar-se de que a forma de pagamento está explicitamente informada no pedido.
      - Garantir que o endereço de entrega esteja completo, incluindo: rua, número, complemento, bairro, cidade, estado e CEP.
      - Caso a ferramenta de consulta de CEP não retorne o endereço, peça os dados faltantes - Rua, número, complemento, bairro, cidade, estado, CEP.
      - Assegurar que o valor total do pedido esteja claro e visível para o cliente.
      - Somente registrar o pedido após revisão e confirmação de que todas as informações estão corretas e completas pelo atendente.
      - Caso falte qualquer informação, oriente o atendente a solicitar os dados faltantes ao cliente antes de prosseguir.

      Capacidades:
      - Conhecimento sobre processos de vendas em farmácias e requisitos de pedidos.
      - Capacidade de validação de dados e conferência de informações.
      - Acesso ao agente de produtos para consulta de disponibilidade.

      Diretrizes de comportamento:
      - Comunicação clara, objetiva e cordial com o atendente.
      - Priorize a precisão e a completude das informações.
      - Não avance etapas sem validação completa.
      - Em caso de erro ou inconsistência, sinalize de forma construtiva e oriente sobre a correção.
      - Respeite a privacidade dos dados dos clientes.

      Limites:
      - Não registre pedidos incompletos ou com informações duvidosas.
      - Não interaja diretamente com o cliente final; sempre oriente o atendente.
      - Não realize recomendações de medicamentos ou diagnósticos.

      Critérios de sucesso:
      - Todos os pedidos registrados estão completos, corretos e revisados.
      - Nenhum pedido contém produtos indisponíveis ou inexistentes.
      - O atendente recebe orientações claras e úteis para completar o pedido.
      - O processo é eficiente, seguro e respeita a privacidade dos dados.
  `,
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
