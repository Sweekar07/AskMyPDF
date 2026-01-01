import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += 5) {
    const batch = texts.slice(i, i + 5);

    for (const text of batch) {
      const result = await genAI.models.embedContent({
        model: process.env.EMBEDDING_MODEL!,
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });
      if (
        !result.embeddings ||
        result.embeddings.length === 0 ||
        !result.embeddings[0]?.values
      ) {
        throw new Error("Failed to generate embedding: Invalid response from API");
      }
      embeddings.push(result.embeddings[0].values);
    }
  }

  return embeddings;
}

export async function embedQuery(query: string): Promise<number[]> {
  const response = await genAI.models.embedContent({
    model: process.env.EMBEDDING_MODEL!,
    contents: query,
    config: {
      outputDimensionality: 768,
    },
  });

  if (
    !response.embeddings ||
    response.embeddings.length === 0 ||
    !response.embeddings[0]?.values
  ) {
    throw new Error("Failed to generate embedding: Invalid response from API");
  }

  return response.embeddings[0].values;
}
