import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { azureEmbeddings } from "./llms/azure";
import { pineconeVector } from "./vectors/pinecone-vector";

export const memoryWithVector = new Memory({
  embedder: azureEmbeddings.textEmbeddingModel("text-embedding-3-small"),
  vector: pineconeVector,
  storage: new LibSQLStore({
    url: "file:./local.db",
  }),
  options: {
    semanticRecall: {
      topK: 5,
      scope: "resource",
      messageRange: 3,
    },
  },
});
