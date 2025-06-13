import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { orderAgent } from "./agents/order-agent";
import { productAgent } from "./agents/product-agent";
import { loomaNetwork } from "./networks/looma-network";
import { pinecone } from "./vectors/pinecone-vector";

export const mastra = new Mastra({
  agents: { productAgent, orderAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  networks: { loomaNetwork },
  vectors: {
    pinecone,
  },
});
