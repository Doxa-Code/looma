import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { loomaAgent } from "./agents/looma-agent";
import { orderAgent } from "./agents/order-agent";
import { productAgent } from "./agents/product-agent";
import { postgresStore } from "./store/postgres-store";
import { pineconeVector } from "./vectors/pinecone-vector";
import { faqAgent } from "./agents/faq-agent";

export const mastra = new Mastra({
  agents: {
    loomaAgent,
    orderAgent,
    productAgent,
    faqAgent,
  },
  storage: postgresStore,
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  vectors: {
    pinecone: pineconeVector,
  },
});
