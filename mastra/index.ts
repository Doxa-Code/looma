import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { loomaAgent } from "./agents/looma-agent";
import { pineconeVector } from "./vectors/pinecone-vector";
import { orderAgent } from "./agents/order-agent";
import { productAgent } from "./agents/product-agent";

export const mastra = new Mastra({
  agents: { loomaAgent, orderAgent, productAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  telemetry: {
    enabled: true,
  },
  vectors: {
    pinecone: pineconeVector,
  },
});
