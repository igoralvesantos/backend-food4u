import { Request, Response } from "express";
import { FeedDB } from "../../../data/feedDB";
import { GetFeedUC } from "../../../business/usecases/feed/getFeed";
import { JWTAutentication } from "../../../business/services/jwtAutentication";
import { Validators } from "../../../business/services/validators";

export const getFeedEndpoint = async (req: Request, res: Response) => {
  try {
    const getFeedUC = new GetFeedUC(
      new FeedDB(),
      new JWTAutentication(),
      new Validators()
    );

    const result = await getFeedUC.execute({
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
