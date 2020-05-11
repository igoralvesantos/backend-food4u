import { UserGateway } from "../../gateways/userGateway";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";
import { NotFoundError } from "../../errors/NotFoundError";

export class FollowUserUC {
  constructor(
    private db: UserGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  public async execute(input: FollowUserUCInput): Promise<FollowUserUCOutput> {
    try {
      this.validators.validateFollowUserInput(input);

      const userId = this.jwtAuth.verifyToken(input.token);

      const userThatWillFollow = await this.db.getUserById(userId);

      if(!userThatWillFollow) {
        throw new NotFoundError("The user does not exist");
      }

      const userToBeFollowed = await this.db.getUserById(
        input.userToFollowId
      );

      if(!userToBeFollowed) {
        throw new NotFoundError("The user you are trying to follow does not exist");
      }

      await this.db.createUserFollowRelation(
        userId,
        input.userToFollowId
      );

      return {
        message: "You are following the user",
      };
    } catch(err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to follow user",
      };
    }
  }
}

export interface FollowUserUCInput {
  token: string;
  userToFollowId: string;
}

export interface FollowUserUCOutput {
  message: string;
}
