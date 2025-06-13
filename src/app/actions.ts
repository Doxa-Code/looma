"use server";
import axios from "axios";
import { mastra } from "../../mastra";
import { z } from "zod";
import { createServerAction } from "zsa";
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
      });
    await axios.post(
      `https://chatwoot.doxacode.com.br/api/v1/accounts/3/conversations/${input.conversationId}/messages`,
      {
        content: response.text,
        message_type: "outgoing",
        delay: 3000,
      },
      {
        headers: {
          api_access_token: process.env.CHATWOOT_API_KEY,
        },
      }
    );
  });
