import { Mastra } from "@mastra/core/mastra";
import { VercelDeployer } from "@mastra/deployer-vercel";
import { PinoLogger } from "@mastra/loggers";
import { loomaAgent } from "./agents/looma-agent";
import { orderAgent } from "./agents/order-agent";
import { productAgent } from "./agents/product-agent";
import { postgresStore } from "./store/postgres-store";
import { pineconeVector } from "./vectors/pinecone-vector";

export const mastra = new Mastra({
  agents: { loomaAgent, orderAgent, productAgent },
  deployer: new VercelDeployer({
    teamSlug: "doxacode",
    projectName: "looma-ai",
    token: process.env.VERCEL_TOKEN ?? "",
  }),
  storage: postgresStore,
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
