import * as bcrypt from "bcrypt";
import { BcryptPasswordGateway } from "../gateways/bcryptPassword";

export class BcryptPassword implements BcryptPasswordGateway {
  private saltOrRounds = 10;

  async generateHash(userPassword: string): Promise<string> {
    return await bcrypt.hash(userPassword, this.saltOrRounds);
  }

  async compareHash(inputPassword: string, dbPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, dbPassword);
  }
}
