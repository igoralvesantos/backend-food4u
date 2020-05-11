import { Request, Response } from "express";
import { GetUserDataUC } from "../../../business/usecases/user/getUserData";
import { UserDB } from "../../../data/userDB";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { Validators } from "../../../business/services/validators";

export const getUserDataEndpoint = async (req: Request, res: Response) => {
  try {
    const getUserDataUC = new GetUserDataUC(
      new UserDB(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await getUserDataUC.execute({
      token: req.headers.auth as string,
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(err.code || 400).send({
      message: err.message,
      ...err,
    });
  }
};
