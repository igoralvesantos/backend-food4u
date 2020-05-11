import { UserGateway } from "../../gateways/userGateway";
import { BcryptPasswordGateway } from "../../gateways/bcryptPassword";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";

export class LoginUC {
  constructor(
    private db: UserGateway,
    private bcrypt: BcryptPasswordGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  public async execute(input: LoginUCInput): Promise<LoginUCOutput> {
    try {
      this.validators.validateLoginInput(input)

      const user = await this.db.getUserByEmail(input.email);

      if(!user) {
        throw new NotFoundError("Invalid email or password");
      }

      const isPasswordCorrect = await this.bcrypt.compareHash(
        input.password,
        user.getPassword()
      );

      if(!isPasswordCorrect) {
        throw new ConflictError("Invalid email or password");
      }

      const token = this.jwtAuth.generateToken(user.getId())

      return {
        message: "User successfully logged in",
        token: token,
      };
    } catch (err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to login",
      };
    }
  }
}

export interface LoginUCInput {
  email: string;
  password: string;
}

export interface LoginUCOutput {
  message: string;
  token: string;
}
