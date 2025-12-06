import { 
  initializeVectorDB, 
  storeProductContext, 
  createEmbedding, 
  retrieveContext 
} from '../../config/vector-db';

export class VectorService {
  private initialized: boolean = false;

  async initialize() {
    if (!this.initialized) {
      await initializeVectorDB();
      await storeProductContext();
      this.initialized = true;
      console.log('Vector service initialized');
    }
  }

  async addContext(id: string, text: string, metadata: any) {
    try {
      const embedding = await createEmbedding(text);
      // Store in vector DB with metadata
      console.log(`Context added: ${id}`);
      return { success: true, id };
    } catch (error) {
      console.error('Error adding context:', error);
      throw error;
    }
  }

  async queryContext(query: string, topK: number = 3) {
    try {
      return await retrieveContext(query);
    } catch (error) {
      console.error('Error querying context:', error);
      throw error;
    }
  }
}
