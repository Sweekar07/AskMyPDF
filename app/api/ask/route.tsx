import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { embedQuery } from "@/lib/embeddings";
import { mongoVectorSearch } from "@/lib/vector_mongo";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { fileId, question } = await req.json();

    if (!fileId || !question) {
      return NextResponse.json(
        { error: "fileId and question required" },
        { status: 400 }
      );
    }

    // Get query embedding
    const queryEmbedding = await embedQuery(question);

    // Retrieve relevant chunks
    const hits = await mongoVectorSearch(queryEmbedding, fileId, 5);

    if (hits.length === 0) {
      return NextResponse.json({
        answer: "No relevant information found in the PDF.",
        citations: []
      });
    }

    // Build context from retrieved chunks
    const context = hits
      .map((h, i) => `Chunk ${i + 1}:\n${h.text}`)
      .join("\n\n");

    const prompt = `You are a helpful assistant that answers questions based only on the provided context. If the answer cannot be found in the context, say "I don't have enough information to answer that question."

QUESTION: ${question}

CONTEXT:
${context}

Please provide a clear and accurate answer based only on the context provided.
Note: Format the answer in Markdown (use bold for key terms, bullet lists when helpful).`;

    // Generate answer using Gemini
    const response = await genAI.models.generateContent({
      model: process.env.QA_LLM_MODEL!,
      contents: prompt
    });


    const answer = response.text;

    const citations = hits.map(h => h._id);

    return NextResponse.json({
      answer,
      citations,
      chunksFound: hits.length
    });

  } catch (error) {
    console.error("Ask error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
