import { Logger, NotFoundException } from "@nestjs/common";
import { Connection, FilterQuery, Model, SaveOptions, Types, UpdateQuery } from "mongoose";

import { AbstractDocument } from "./abstract.schema";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(document: Omit<TDocument, "_id">, options?: SaveOptions): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save(options)).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn("Document not found with filterQuery", filterQuery);
      throw new NotFoundException("Document not found.");
    }

    return document as unknown as TDocument;
  }

  async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException("Document not found.");
    }

    return document as unknown as TDocument;
  }

  async upsert(filterQuery: FilterQuery<TDocument>, document: Partial<TDocument>) {
    const result = this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });

    return result as unknown as TDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    const result = this.model.find(filterQuery, {}, { lean: true });

    return result as unknown as TDocument;
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}

// https://chat.deepseek.com/a/chat/s/21c13210-84c0-4622-9cbf-754ccb66cfc2
