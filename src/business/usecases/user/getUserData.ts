import { UserGateway } from "../../gateways/userGateway";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";
import { NotFoundError } from "../../errors/NotFoundError";

export class GetUserDataUC {
  constructor(
    private db: UserGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  public async execute(input: GetUserDataUCInput): Promise<GetUserDataUCOutput> {
    try {
      this.validators.validateGetUserDataInput(input)

      const userId = this.jwtAuth.verifyToken(input.token);

      const user = await this.db.getUserById(userId);

      if(!user) {
        throw new NotFoundError("The user does not exist");
      }

      return {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        birthDate: user.getBirtDate().getTime(),
      };
    } catch (err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to get user data",
      };
    }
  }
}

export interface GetUserDataUCInput {
  token: string;
}

export interface GetUserDataUCOutput {
  id: string;
  email: string;
  name: string;
  birthDate: Number;
}
