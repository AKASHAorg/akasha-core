import { DataSource } from 'apollo-datasource';
import { initAppDB } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Profile } from '../collections/interfaces';

class PostAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private db: Client;
  private readonly dbID: ThreadID;
  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
  }

  async initialize(config) {
    this.context = config.context;
    this.db = await initAppDB();
  }

  async getPost(id: string) {
    return await this.db.findByID<Profile>(this.dbID, this.collection, id);
  }
}

export default PostAPI;
