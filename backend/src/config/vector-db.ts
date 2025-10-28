import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let qdrantClient: QdrantClient;
const COLLECTION_NAME = 'email-context';

export const initializeVectorDB = async () => {
  try {
    qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333'
    });

    // Check if collection exists, create if not
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1536, // OpenAI text-embedding-3-small dimension
          distance: 'Cosine'
        }
      });
      console.log(`Qdrant collection ${COLLECTION_NAME} created`);
    }

    console.log('Vector DB initialized successfully');
  } catch (error) {
    console.error('Error initializing vector DB:', error);
    throw error;
  }
};

export const storeProductContext = async () => {
  try {
    const productContext = {
      product: process.env.PRODUCT_NAME || 'Job Application Assistant',
      agenda: process.env.OUTREACH_AGENDA || 'Default agenda'
    };

    const embedding = await createEmbedding(
      `${productContext.product}: ${productContext.agenda}`
    );

    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: 'product-context',
          vector: embedding,
          payload: productContext
        }
      ]
    });

    console.log('Product context stored in vector DB');
  } catch (error) {
    console.error('Error storing product context:', error);
  }
};

export const createEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
};

export const retrieveContext = async (query: string) => {
  try {
    const queryEmbedding = await createEmbedding(query);

    const results = await qdrantClient.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      limit: 3,
      with_payload: true
    });

    return results.map((result: any) => result.payload);
  } catch (error) {
    console.error('Error retrieving context:', error);
    throw error;
  }
};
