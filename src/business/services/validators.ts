import { ValidatorsGateway } from "../gateways/validatorsGateway";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class Validators implements ValidatorsGateway {
  private isValid(input: string): boolean {
    return input !== undefined && input !== null && input !== "";
  }

  public validateChangePasswordInput(input: any): void {
    if(!this.isValid(input.token)) {
      throw new UnauthorizedError("Unauthorized");
    }

    if(!this.isValid(input.oldPassword) || !this.isValid(input.newPassword)) {
      throw new BadRequestError("Missing Input");
    }
  }

  public validateFollowUserInput(input: any): void {
    if(!this.isValid(input.token)) {
      throw new UnauthorizedError("Unauthorized");
    }

    if(!this.isValid(input.userToFollowId)) {
      throw new BadRequestError("Missing input");
    }
  }

  public validateGetUserDataInput(input: any): void {
    if(!this.isValid(input.token)) {
      throw new UnauthorizedError("Unauthorized");
    }
  }

  public validateLoginInput(input: any): void {
    if(input.email.indexOf("@") === -1) {
      throw new BadRequestError("Invalid email");
    }

    if(!this.isValid(input.password)) {
      throw new UnauthorizedError("Invalid password");
    }
  }

  public validateSignupInput(input: any): void {
    if(input.email.indexOf("@") === -1) {
      throw new BadRequestError("Invalid email");
    }

    if(
      !this.isValid(input.password) ||
      !this.isValid(input.name) ||
      !this.isValid(input.birthDate)
    ) {
      throw new UnauthorizedError("Missing input");
    }
  }

  public validateUpdateUserInput(input: any): void {
    if(!this.isValid(input.token)) {
      throw new UnauthorizedError("Unauthorized");
    }

    if(input.email.indexOf("@") === -1) {
      throw new BadRequestError("Invalid email");
    }
  }

  public validateCreateRecipeInput(input: any): void {
    if(!this.isValid(input.token)) {
      throw new UnauthorizedError("Unauthorized");
    }

    if(
      !this.isValid(input.title) ||
      !this.isValid(input.description)
    ) {
      throw new UnauthorizedError("Missing input");
    }
  }

  public validateGetFeedInput(input: any): void {
    if(!this.isValid(input.token)) {
      throw new UnauthorizedError("Unauthorized");
    }
  }
}