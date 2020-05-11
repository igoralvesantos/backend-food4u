import { v4 } from "uuid";
import { RecipeGateway } from "../../gateways/recipeGateway";
import { Recipe } from "../../entities/recipe";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";

export class CreateRecipeUC {
  constructor(
    private db: RecipeGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  public async execute(input: CreateRecipeUCInput): Promise<CreateRecipeUCOutput> {
    try {
      this.validators.validateCreateRecipeInput(input);
      
      const userId = this.jwtAuth.verifyToken(input.token);
  
      const recipeId = v4();
  
      const newRecipe = new Recipe(
        recipeId,
        input.title,
        input.description,
        new Date(),
        userId
      );
  
      await this.db.createRecipe(newRecipe);
  
      return {
        message: "Recipe successfully created",
      };
    } catch(err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to create recipe",
      };
    }
  }
}

export interface CreateRecipeUCInput {
  token: string;
  title: string;
  description: string;
}

export interface CreateRecipeUCOutput {
  message: string;
}
