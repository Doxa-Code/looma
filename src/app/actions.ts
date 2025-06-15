"use server";
import { EvolutionApiSdk } from "@/lib/utils/evolution-api-sdk";
import { z } from "zod";
import { createServerAction } from "zsa";
import { mastra } from "../../mastra";

const evolutionApiSdk = EvolutionApiSdk.create({
  apiKey: process.env.EVOLUTION_API_KEY ?? "",
  url: process.env.EVOLUTION_API_URL ?? "",
  instanceName: "Looma AI",
});

export const talkToLoomaAction = createServerAction()
  .input(
    z.object({
      content: z.string(),
      clientPhone: z.string(),
      clientName: z.string(),
      conversationId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    const response = await mastra
      .getAgent("loomaAgent")
      .generate(input.content, {
        resourceId: input.clientName,
        threadId: input.conversationId.toString(),
        system: `
          Nome do cliente: ${input.clientName}
          Numero do cliente: ${input.clientPhone}
          ID da conversa: ${input.conversationId}
        `,
        temperature: 0,
      });

    await evolutionApiSdk.sendText({
      number: input.clientPhone,
      text: response.text,
      delay: 0,
    });
  });
