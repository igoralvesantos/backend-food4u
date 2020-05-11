import { Recipe } from "../entities/recipe";

export interface RecipeGateway {
  createRecipe(recipe: Recipe): Promise<void>;
}
