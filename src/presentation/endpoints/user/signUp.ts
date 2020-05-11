import { Request, Response } from "express";
import { SignupUC } from "../../../business/usecases/user/signUp";
import { UserDB } from "../../../data/userDB";
import { BcryptPassword } from "../../../business/services/bcryptPassword";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { Validators } from "../../../business/services/validators";

export const signupEndpoint = async (req: Request, res: Response) => {
  try {
    const signupUC = new SignupUC(
      new UserDB(),
      new BcryptPassword(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await signupUC.execute({
      email: req.body.email,
      password: req.body.password,
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
