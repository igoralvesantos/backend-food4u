import { UserGateway } from "../../gateways/userGateway";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";

export class UpdateUserUC {
  constructor(
    private db: UserGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  public async execute(input: updateUserUCInput): Promise<updateUserUCOutput> {
    try {
      this.validators.validateUpdateUserInput(input);

      const userId = this.jwtAuth.verifyToken(input.token);

      if(input.email) {
        await this.db.changeEmail(input.email, userId);
      }

      if(input.name) {
        await this.db.changeName(input.name, userId);
      }

      if(input.birthDate) {
        await this.db.changeBirthDate(input.birthDate, userId);
      }

      return {
        message: "User updated successfully",
      };
    } catch (err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to update the user",
      };
    }
  }
}

export interface updateUserUCInput {
  token: string;
  email?: string;
  name?: string;
  birthDate?: Date;
}

export interface updateUserUCOutput {
  message: string;
}
