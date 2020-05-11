import { FeedGateway } from "../business/gateways/feedGateway";
import { BaseDB } from "./baseDB";
import { RecipeFeed } from "../business/entities/recipeFeed";

export class FeedDB extends BaseDB implements FeedGateway {
  private feedTableName = "FOOD4U_FEED";

  private mapDbDataToRecipeFeed(input: any): RecipeFeed {
    return new RecipeFeed(
      input.recipeId,
      input.title,
      input.description,
      input.creationDate,
      input.authorId,
      input.authorEmail,
      input.authorName
    );
  }

  public async getFeed(userId: string): Promise<RecipeFeed[]> {
    const response = await this.connection.raw(`
      SELECT * FROM ${this.feedTableName}
      WHERE userFeed = '${userId}'
      ORDER BY creationDate DESC;
    `);

    return response[0].map((recipe: any) => {
      return this.mapDbDataToRecipeFeed(recipe);
    });
  }
}
