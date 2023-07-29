import { Request, Response } from "express";
import sqlExec from "../utils/sqlExec";
import { createAccount } from "./user";

const front = "http://localhost:3000";

interface AuthCallbackRequest extends Request {
  user?: any;
}

interface githubCallback {
  login: string;
  id: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
}

export const githubCallback = async (req: AuthCallbackRequest, res: Response) => {
  const userData: githubCallback = req?.user?._json;
  const { login: name, id, email, bio, avatar_url } = userData;

  const exists = await sqlExec(
    "SELECT token FROM Users WHERE github_id = ? AND github_id IS NOT NULL LIMIT 1",
    [id],
  );

  // If the account, in fact, exists
  if (exists.length > 0) {
    res.redirect(`${front}/stockToken?token=${exists[0].token}`);
  }

  // If the account doesn't exists => create an account
  else {
    const token = await createAccount({ name, github_id: id, email, bio, pfp: avatar_url });
    res.redirect(`${front}/stockToken?token=${token}`);
  }
};

interface discordCallback {
  username: string;
  id: string;
  email?: string;
  avatar?: string;
  locale?: string;
  discriminator?: string;
}

export const discordCallback = async (req: AuthCallbackRequest, res: Response) => {
  const userData: discordCallback = req?.user;
  const { username: name, id, email, avatar, locale, discriminator } = userData;

  const exists = await sqlExec(
    "SELECT token FROM Users WHERE discord_id = ? AND discord_id IS NOT NULL LIMIT 1",
    [id],
  );

  // If the account, in fact, exists
  if (exists.length > 0) {
    res.redirect(`${front}/stockToken?token=${exists[0].token}`);
  }

  // If the account doesn't exists => create an account
  else {
    const token = await createAccount({
      name,
      discord_id: id,
      discord: `${name}#${discriminator}`,
      email,
      pfp: avatar === null ? null : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
      country: locale,
    });
    res.redirect(`${front}/stockToken?token=${token}`);
  }
};

interface stackCallback {
  displayName: string;
  id: number;
  profileUrl?: string;
}

export const stackCallback = async (req: AuthCallbackRequest, res: Response) => {
  const userData: stackCallback = req?.user;
  const { displayName: name, id, profileUrl: avatar } = userData;

  const exists = await sqlExec(
    "SELECT token FROM Users WHERE stack_id = ? AND stack_id IS NOT NULL LIMIT 1",
    [id],
  );

  // If the account, in fact, exists
  if (exists.length > 0) {
    res.redirect(`${front}/stockToken?token=${exists[0].token}`);
  }

  // If the account doesn't exists => create an account
  else {
    const token = await createAccount({ name, stack_id: "" + id, avatar });
    res.redirect(`${front}/stockToken?token=${token}`);
  }
};
