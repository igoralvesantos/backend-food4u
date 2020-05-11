import { FeedGateway } from "../../gateways/feedGateway";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";

export class GetFeedUC {
  constructor(
    private db: FeedGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  public async execute(input: GetFeedUCInput): Promise<GetFeedUCOutput[]> {
    try {
      this.validators.validateGetFeedInput(input);

      const userId = this.jwtAuth.verifyToken(input.token);

      const results = await this.db.getFeed(userId);

      return results.map((recipe) => {
        return {
          id: recipe.getId(),
          title: recipe.getTitle(),
          description: recipe.getDescription(),
          creationDate: recipe.getCreationDate().getTime(),
          userId: recipe.getUserId(),
          userEmail: recipe.getUserEmail(),
          userName: recipe.getUserName(),
        }
      });
    } catch (err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to fetching recipes from followers",
      };
    }
  }
}

export interface GetFeedUCInput {
  token: string;
}

export interface GetFeedUCOutput {
  id: string;
  title: string;
  description: string;
  creationDate: Number;
  userId: string;
  userEmail: string;
  userName: string;
}
