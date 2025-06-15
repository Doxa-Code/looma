import { createTool } from "@mastra/core";
import { z } from "zod";
import { EvolutionApiSdk } from "../evolution-api-sdk";

const evolutionApiSdk = EvolutionApiSdk.create({
  apiKey: process.env.EVOLUTION_API_KEY ?? "",
  url: process.env.EVOLUTION_API_URL ?? "",
  instanceName: "Looma AI",
});

export const sendMessageTool = createTool({
  id: "send-message",
  description: "use para enviar manter o cliente atualizado sobre suas ações",
  inputSchema: z.object({
    clientPhone: z.string(),
    message: z.string(),
  }),
  async execute({ context }) {
    if (context.clientPhone.startsWith("+55")) {
      await evolutionApiSdk
        .sendText({
          number: context.clientPhone,
          text: context.message,
          delay: 3000,
        })
        .catch(() => {});
    } else {
      console.log(context.message);
    }
    return "Mensagem enviada com sucesso";
  },
});
