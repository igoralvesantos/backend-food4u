import { Request, Response } from "express";
import { UserDB } from "../../../data/userDB";
import { ChangePasswordUC } from "../../../business/usecases/user/changePassword";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { BcryptPassword } from "../../../business/services/bcryptPassword";
import { Validators } from "../../../business/services/validators";

export const changePasswordEndpoint = async (req: Request, res: Response) => {
  try {
    const changePasswordUC = new ChangePasswordUC(
      new UserDB(),
      new BcryptPassword(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await changePasswordUC.execute({
      token: req.headers.auth as string,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(err.code || 400).send({
      message: err.message,
      ...err,
    });
  }
};
