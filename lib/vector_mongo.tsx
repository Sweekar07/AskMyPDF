import { MongoClient, Document, Collection } from "mongodb";

let client: MongoClient

interface ChunkDocument extends Document {
    _id: string;
    fileId: string;
    text: string;
    embedding: number[];
}

async function getCollection(): Promise<Collection<ChunkDocument>> {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_ATLAS_URI!);
    }
    await client.connect();

    return client
        .db(process.env.MONGODB_ATLAS_DB_NAME)
        .collection<ChunkDocument>(process.env.MONGODB_ATLAS_COLLECTION_NAME!);
}

export async function mongoUpsertChunks(
    fileId: string,
    chunks: string[],
    embeddings: number[][]
): Promise<void> {
    const col = await getCollection();

    const docs = chunks.map((text, i) => ({
        _id: `${fileId}_${i}`,
        fileId,
        text,
        embedding: embeddings[i],
    }));

    const ops = docs.map((d) => ({
        updateOne: {
            filter: { _id: d._id },
            update: { $set: d },
            upsert: true
        },
    }));

    await col.bulkWrite(ops, { ordered: false });
}

export async function mongoVectorSearch(
    queryEmbedding: number[],
    fileId: string,
    k = 5
): Promise<Array<{ _id: string; text: string; score: number }>> {
    const col = await getCollection();

    const pipeline = [
        {
            $vectorSearch: {
                index: process.env.MONGODB_VECTOR_INDEX! || "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 200,
                limit: k,
                filter: { fileId },
            },
        },
        {
            $project: {
                _id: 1,
                text: 1,
                score: { $meta: "vectorSearchScore" }
            }
        },
    ];

    const results = await col.aggregate(pipeline).toArray();

    return results.map(doc => ({
        _id: doc._id as string,
        text: doc.text as string,
        score: doc.score as number,
    }));
}
