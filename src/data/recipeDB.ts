import { RecipeGateway } from "../business/gateways/recipeGateway";
import { BaseDB } from "./baseDB";
import { Recipe } from "../business/entities/recipe";

export class RecipeDB extends BaseDB implements RecipeGateway {
  private recipeTableName = "FOOD4U_RECIPES";

  private mapDateToDbDate(input: Date): string {
    return input.toISOString().slice(0, 19).replace("T", " ");
  }

  public async createRecipe(recipe: Recipe): Promise<void> {
    await this.connection
      .insert({
        id: recipe.getId(),
        title: recipe.getTitle(),
        description: recipe.getDescription(),
        creationDate: recipe.getCreationDate(),
        userId: recipe.getUserId(),
      })
      .into(this.recipeTableName);

    const authorId = recipe.getUserId();

    const FollowerId = await this.connection.raw(`
      SELECT FOOD4U_FOLLOWERS.follower_id 
      FROM FOOD4U_FOLLOWERS 
      WHERE followed_id = '${authorId}'
    `);

    const authorData = await this.connection.raw(`
      SELECT email, name
      FROM FOOD4U_USERS 
      WHERE id = '${authorId}';
    `);

    const promisesArray = FollowerId[0].map(async (follower: any) => {
      return await this.connection.raw(`
        INSERT INTO FOOD4U_FEED(
          userFeed,
          recipeId,
          title,
          description,
          creationDate,
          authorId,
          authorEmail,
          authorName
        )
        VALUES(
          '${follower.follower_id}',
          '${recipe.getId()}',
          '${recipe.getTitle()}',
          '${recipe.getDescription()}',
          '${this.mapDateToDbDate(recipe.getCreationDate())}',
          '${recipe.getUserId()}',
          '${authorData[0][0].email}',
          '${authorData[0][0].name}'
        );
      `);
    });

    await Promise.all(promisesArray);
  }
}
