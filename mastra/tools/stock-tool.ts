import { createVectorQueryTool } from "@mastra/rag";
import { azureEmbeddings } from "../llms/azure";

export const stockTool = createVectorQueryTool({
  id: "stock-tool",
  description: "use para verificar se o produto está em estoque",
  vectorStoreName: "pinecone",
  indexName: "products",
  model: azureEmbeddings.textEmbeddingModel("text-embedding-3-small", {
    dimensions: 1536,
  }),
  databaseConfig: {
    pinecone: {
      namespace: "alexandre",
    },
  },
});
