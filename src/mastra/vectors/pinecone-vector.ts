import { PineconeVector } from "@mastra/pinecone";

export const pinecone = new PineconeVector({
  apiKey: process.env.PINECONE_API_KEY || "",
});
