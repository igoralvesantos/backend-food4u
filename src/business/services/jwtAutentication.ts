import * as jwt from "jsonwebtoken";
import { JWTAutenticationGateway } from "../gateways/jwtAutenticationGateway";

export class JWTAutentication implements JWTAutenticationGateway {
  private expiresIn = "1h"

  generateToken(userId: string): string {
    return jwt.sign({userId}, process.env.JWT_KEY as string, {expiresIn: this.expiresIn})
  }

  verifyToken(token: string): string  {
    const data = jwt.verify(token, process.env.JWT_KEY as string) as {userId: string}

    return data.userId
  }
}