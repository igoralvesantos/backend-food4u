import { Request, Response } from "express";
import { UserDB } from "../../../data/userDB";
import { FollowUserUC } from "../../../business/usecases/user/followUser";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { Validators } from "../../../business/services/validators";

export const followUserEndpoint = async (req: Request, res: Response) => {
  try {
    const followUserUC = new FollowUserUC(
      new UserDB(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await followUserUC.execute({
      token: req.headers.auth as string,
      userToFollowId: req.body.userToFollowId,
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(err.code || 400).send({
      message: err.message,
      ...err,
    });
  }
};
