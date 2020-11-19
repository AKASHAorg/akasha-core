import { DataSource } from 'apollo-datasource';
import { initAppDB } from '../helpers';
import { Client, ThreadID } from '@textile/hub';

class CommentAPI extends DataSource {
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
}

export default CommentAPI;
