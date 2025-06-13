import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const createOrderTool = createTool({
  id: "create-order-tool",
  description: "Use para criar um pedido",
  inputSchema: z.object({
    customerName: z.string().describe("nome do cliente"),
    customerPhone: z.string().describe("telefone do cliente"),
    deliveryAddress: z.string().describe("endereço de entrega"),
    paymentMethod: z
      .enum(["pix", "dinheiro", "cartão"])
      .describe("forma de pagamento"),
    products: z
      .array(
        z.object({
          name: z.string().describe("nome do produto"),
          price: z.number().describe("preço unitário do produto"),
          quantity: z.number().describe("quantidade do produto"),
          totalPrice: z.number().describe("preço total do produto"),
        })
      )
      .describe("produtos do pedido"),
  }),
  outputSchema: z.string(),
  execute: async ({ context }) => {
    console.log("pedido gerado", JSON.stringify(context, null, 2));
    return "Pedido gerado com sucesso";
  },
});
