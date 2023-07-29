import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./verifyToken";

export const authObligatory = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (
    req.token === "null" ||
    req.token === null ||
    req.token === undefined ||
    typeof req.token !== "string" ||
    req.token.length === 0
  ) {
    res.status(401).send("Invalid token. Try to log out/log in, if you think that there is a problem");
    return;
  } else {
    next();
  }
};
