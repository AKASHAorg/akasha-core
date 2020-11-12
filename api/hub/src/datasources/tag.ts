import { DataSource } from 'apollo-datasource';
import { initAppDB } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Tag } from '../collections/interfaces';

class TagAPI extends DataSource {
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

  async getTag(name: string) {
    const query = new Where('name').eq(name);
    const tag = await this.db.find<Tag>(this.dbID, this.collection, query);
    if (tag.length) {
      return tag[0];
    }
    return {};
  }
}

export default TagAPI;
