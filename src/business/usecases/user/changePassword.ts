import { UserGateway } from "../../gateways/userGateway";
import { BcryptPasswordGateway } from "../../gateways/bcryptPassword";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";
import { BadRequestError } from "../../errors/BadRequestError";

export class ChangePasswordUC {
  constructor(
    private db: UserGateway,
    private bcrypt: BcryptPasswordGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  private PASSWORD_LENGTH = 6;

  private PASSWORD_LIMIT_TIME = 2;

  public async execute(input: ChangePasswordUCInput): Promise<ChangePasswordUCOutput> {
    try {
      this.validators.validateChangePasswordInput(input)

      const userId = this.jwtAuth.verifyToken(input.token);

      const user = await this.db.getUserById(userId);

      if(!user) {
        throw new NotFoundError("This user does not exist");
      }

      const isSamePassword = await this.bcrypt.compareHash(
        input.oldPassword,
        user.getPassword()
      );

      if(!isSamePassword) {
        throw new ConflictError("Incompatible old password");
      }

      if(input.newPassword.length < this.PASSWORD_LENGTH) {
        throw new BadRequestError("The new password must contain at least 6 characters");
      }

      if(user.getPasswordTime()) {
        const lastChangePassword = user.getPasswordTime()?.getTime() as number;
        const currentyTime = new Date().getTime();
        const actualTimeStamp = (currentyTime - lastChangePassword) / 3600;

        if (actualTimeStamp < this.PASSWORD_LIMIT_TIME) {
          throw new BadRequestError("Senha não pode ser alterada antes de 2 horas");
        }
      }

      if(!user.getPasswordTime()) {
        await this.db.updatePasswordTime(new Date(), userId);
      }

      const hashPassword = await this.bcrypt.generateHash(input.newPassword);

      await this.db.changePassword(hashPassword, userId);

      return {
        message: "Password changed successfully",
      };
    } catch(err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to change the password",
      };
    }
  }
}

export interface ChangePasswordUCInput {
  token: string;
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordUCOutput {
  message: string;
}
