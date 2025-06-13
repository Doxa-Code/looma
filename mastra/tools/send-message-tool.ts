import { createTool } from "@mastra/core";
import axios from "axios";
import { z } from "zod";

export const sendMessageTool = createTool({
  id: "send-message",
  description: "use para enviar uma mensagem para o cliente",
  inputSchema: z.object({
    conversationId: z.number(),
    message: z.string(),
  }),
  async execute({ context }) {
    await axios.post(
      `https://chatwoot.doxacode.com.br/api/v1/accounts/3/conversations/${context.conversationId}/messages`,
      {
        content: context.message,
        message_type: "outgoing",
        delay: 3000,
      },
      {
        headers: {
          api_access_token: process.env.CHATWOOT_API_KEY,
        },
      }
    );
  },
});
