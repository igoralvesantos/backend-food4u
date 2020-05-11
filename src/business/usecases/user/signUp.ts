import { v4 } from "uuid";
import { User } from "../../entities/user";
import { UserGateway } from "../../gateways/userGateway";
import { BcryptPasswordGateway } from "../../gateways/bcryptPassword";
import { JWTAutenticationGateway } from "../../gateways/jwtAutenticationGateway";
import { ValidatorsGateway } from "../../gateways/validatorsGateway";
import { BadRequestError } from "../../errors/BadRequestError";
import { ConflictError } from "../../errors/ConflictError";

export class SignupUC {
  constructor(
    private db: UserGateway,
    private bcrypt: BcryptPasswordGateway,
    private jwtAuth: JWTAutenticationGateway,
    private validators: ValidatorsGateway
  ) {}

  private PASSWORD_LENGTH = 6;

  public async execute(input: SignupUCInput): Promise<SignupUCOutput> {
    try {
      this.validators.validateSignupInput(input)

      const id = v4();

      if(input.password.length < this.PASSWORD_LENGTH) {
        throw new BadRequestError("The password must contain at least 6 characters");
      }

      const user = this.db.getUserByEmail(input.email)

      if(user) {
        throw new ConflictError("There is already a registered user in this email")
      }

      const hashPassword = await this.bcrypt.generateHash(input.password);

      const newUser = new User(
        id,
        input.email,
        hashPassword,
        input.name,
        input.birthDate
      );

      await this.db.createUser(newUser);

      const token = this.jwtAuth.generateToken(id)

      return {
        message: "User created successfully",
        token
      };
    } catch (err) {
      throw {
        code: err.statusCode || 400,
        message: err.message || "An error occurred while trying to signup",
      };
    }
  }
}

export interface SignupUCInput {
  email: string;
  password: string;
  name: string;
  birthDate: Date;
}

export interface SignupUCOutput {
  message: string;
  token: string;
}
