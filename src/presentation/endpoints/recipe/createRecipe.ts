import { Request, Response } from "express";
import { RecipeDB } from "../../../data/recipeDB";
import { CreateRecipeUC } from "../../../business/usecases/recipe/createRecipe";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { Validators } from "../../../business/services/validators";

export const createRecipeEndpoint = async (req: Request, res: Response) => {
  try {
    const signupUC = new CreateRecipeUC(
      new RecipeDB(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await signupUC.execute({
      token: req.headers.auth as string,
      title: req.body.title,
      description: req.body.description,
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(err.code || 400).send({
      message: err.message,
      ...err,
    });
  }
};
