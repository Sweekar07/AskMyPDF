import pdf from "pdf-parse";

export async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const data = await pdf(Buffer.from(arrayBuffer));
  return data.text || "";
}
