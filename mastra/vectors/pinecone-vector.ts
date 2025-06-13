import { PineconeVector } from "@mastra/pinecone";

export const pineconeVector = new PineconeVector({
  apiKey: process.env.PINECONE_API_KEY || "",
});
