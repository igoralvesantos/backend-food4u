import { Request, Response } from "express";
import { UserDB } from "../../../data/userDB";
import { UpdateUserUC } from "../../../business/usecases/user/updateUser";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { Validators } from "../../../business/services/validators";

export const updateUserEndpoint = async (req: Request, res: Response) => {
  try {
    const updateUserUC = new UpdateUserUC(
      new UserDB(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await updateUserUC.execute({
      token: req.headers.auth as string,
      email: req.body.email,
      name: req.body.name,
      birthDate: req.body.birthDate,
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(err.code || 400).send({
      message: err.message,
      ...err,
    });
  }
};
