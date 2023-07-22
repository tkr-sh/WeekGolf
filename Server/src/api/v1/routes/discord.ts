import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import sqlExec from "../utils/sqlExec";
import conn from "../../../config/initDB";
import axios from "axios";
import dotenv from "dotenv";

// Configure the env variables
dotenv.config();

interface SessionRequest extends Request {
  session: any;
}

/**
 * Initializes the linking of a Discord account to the authenticated user's account.
 *
 * @param {SessionRequest} req - The session request object.
 * @param {Response} res - The response object.
 *
 * @returns {Promise<void | Response>} Promise that resolves once the response has been sent or void if an error occurs.
 *
 * @throws 400 error if the request is invalid or missing a token.
 *
 * @remarks
 * This function checks if the request is valid and contains a token, then stores the token in the session.
 * It constructs a Discord URL to authorize the user's Discord account to link with their profile on the application.
 * Finally, it redirects the user to the Discord authorization page.
 */
export const initLinkDiscordAccount = async (
  req: SessionRequest,
  res: Response,
): Promise<void | Response> => {
  // Verify that the request is valid
  if (req.query.token === null || req.query.token === undefined) {
    return res.status(400).send("Invalid request. Expected a token.");
  }

  // If the token is valid, store it in the session.
  req.session.token = req.query.token;

  // Define the URL to redirect to, and redirect the user to this URL.
  const redirectUri: string = "http://localhost:5000/auth/discord-link";
  const discordUrl: string = `https://discord.com/api/oauth2/authorize?client_id=${
    process.env.DISCORD_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email`;
  res.redirect(discordUrl);
};

/**
 * Link Discord account to the user's profile.
 *
 * @param {SessionRequest} req - The request object containing the authorization code and the user token.
 * @param {Response} res - The response to be sent.
 * @returns {Promise<void | Response>} Promise that resolves once the response has been sent or void if an error occurred.
 * @throws 400 error if the request is invalid.
 * @throws 500 error if an internal error occurs during the database query.
 *
 * @remarks
 * - The function takes the authorization code and user token from the request object and uses it to obtain the access token from the Discord API.
 * - The access token is then used to retrieve the user's Discord ID and username with discriminator.
 * - The function updates the user's profile in the database with the Discord ID, username with discriminator, and the date the link was established.
 * - If the link is successful, the function redirects the user to the settings page.
 * - If an error occurs during the link process, the function sends a 500 error and redirects the user to the settings page after one second.
 */
export const linkDiscordAccount = async (
  req: SessionRequest,
  res: Response,
): Promise<void | Response> => {
  const discord_code: string = req.query.code as string;
  const token: string = req.session.token as string;

  // If the request is invalid
  if (!discord_code || !token) {
    return res.status(400).send("No code or invalid token.");
  }

  // Define the payload for the request
  const payload = {
    code: discord_code,
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:5000/auth/discord-link",
    scope: "identify%20guilds",
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    // Sending Axios request for access_token
    const { data } = await axios.post(
      "https://discordapp.com/api/oauth2/token",
      new URLSearchParams(payload),
      { headers },
    );

    const access_token: string = data.access_token;

    // Sending Axios request for user info
    const { data: userData } = await axios.get("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Extract the informations
    const discordId: string = userData.id;
    const discord: string = `${userData.username}#${userData.discriminator}`;

    // Update the discorrd user with thoses informations
    await sqlExec(
      `UPDATE Users
			SET discord = ?, discord_id = ?, discord_date = NOW()
			WHERE token = ?`,
      [discord, discordId, token],
    );

    // Redirect the user to the new url
    res.redirect("http://localhost:3000/settings");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");

    setTimeout(() => {
      res.redirect("http://localhost:3000/settings");
    }, 1000);
  }
};

/**
 * Retrieves the Discord information for the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {TypeOfResponse} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 404 error if no user with the provided token is found in the database.
 * @throws 500 error if an internal error occurs during the database query.
 *
 * @remarks
 * - The function queries the database for the Discord display name, username and ID of the user with the provided token.
 * - If no user is found with the provided token, the function sends a 404 error.
 * - If the query is successful, the function sends a JSON response containing the Discord display name, username and ID of the user.
 */
export const getDiscordInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // The SQL query
    const query = await sqlExec(
      `SELECT discord_display, discord, discord_id
			FROM Users
			WHERE token = ?
			LIMIT 1`,
      [req.token],
    );

    // If there is no user with that token
    if (query.length === 0) {
      // Send an error
      res.status(404).send("No user with that token");
    } else {
      // Else send the result
      res.json(query[0]);
    }
  } catch {
    res.status(500).send("An error occured while getting the discord information.");
  }
};

/**
 * Update the display of the Discord account for the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 *
 * @remarks
 * - The function updates the value of the "discord_display" field in the Users table for the user corresponding to the provided authentication token.
 * - The new value is the negation of the current value of the "discord_display" field.
 * - If an error occurs during the update, the function sends a 500 error.
 * - If the update succeeds, the function sends a "OK" response.
 */
export const updateDiscordDisplay = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    // The SQL query
    conn.execute(
      `UPDATE Users
			SET discord_display = 1 - discord_display -- Equivalent to v = !v
			WHERE token = ?
			LIMIT 1`,
      [req.token],
      (err, rep) => {
        if (err) {
          res
            .status(500)
            .send("An error occured while trying to update the display of your discord account.");
        } else {
          res.send("OK.");
        }
      },
    );
  } catch {
    res.status(500).send("An error occured while getting the discord information.");
  }
};
