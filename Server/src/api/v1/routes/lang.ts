import { Request, Response } from "express";
import conn from "../../../config/initDB";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import sqlExec from "../utils/sqlExec";
import axios from "axios";

/**
 * Retrieves the list of currently selected languages.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 *
 * @remarks
 * - The function queries the database to retrieve the list of languages selected for the current phase.
 * - If the query is successful, the function sends a JSON response containing the list of languages selected for the current phase.
 * - If an error occurs during the database query, the function sends a 500 error indicating that an internal error has occurred.
 */
export const getLangs = async (req: Request, res: Response): Promise<void> => {
  conn.execute("SELECT lang FROM CurrentLang", (err, rep: any[]) => {
    if (err || rep === undefined || rep.length === 0) {
      res.status(500).send("An error occured.");
    } else {
      res.json(rep);
    }
  });
};

/**
 * Retrieves the current phase and the corresponding list of languages based on the current phase from the database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 404 error if no phases are found in the database.
 *
 * @remarks
 * - The function queries the database to determine the current phase based on the current date and time.
 * - The function then queries the database to retrieve the list of languages based on the current phase.
 * - If the current phase is Phase 1, the languages are returned as is.
 * - If the current phase is Phase 2, the languages are sorted by upvotes in descending order.
 * - If the current phase is Phase 3 or Phase 4, the top two languages with the highest final upvotes are returned.
 * - Finally, the function sends a JSON response containing the list of languages and the current phase with the remaining time until the next phase change.
 */
export const getPhase = async (req: Request, res: Response): Promise<void> => {
  conn.execute(
    `SELECT 
            id,
            CASE
                WHEN NOW() < phase2 THEN 1
                WHEN NOW() < phase3 THEN 2
                WHEN NOW() < phase4 THEN 3
                WHEN NOW() < phaseend THEN 4
                ELSE -1
            END AS current_phase
        FROM Phases
        WHERE NOW() > phase1
        ORDER BY id DESC
        LIMIT 1`,
    async (err, rep: any[]) => {
      if ((err !== undefined && err !== null) || rep === undefined) {
        res.status(500).send("An internal error occured while trying to get the current phase.");
        return;
      }

      if (rep.length === 0) {
        res.status(404).send("No phases found.");
        return;
      }

      const [{ timeRemaining }] = await sqlExec(
        `SELECT phase${
          rep[0].current_phase + 1 === 5 ? "end" : rep[0].current_phase + 1
        } as timeRemaining
                FROM Phases
                WHERE NOW() > phase1
                ORDER BY id DESC
                LIMIT 1`,
      );

      // Switch over the phase
      switch (rep[0].current_phase) {
        // Phase 1
        case 1:
          conn.execute(
            `
                        SELECT lang
                        FROM SuggestionLang
                        WHERE phase_id = ?`,
            [rep[0].id],
            (err2, rep2) => {
              console.log("u<u---------");
              console.log(rep2);
              console.log("u<u---------");

              if ((err2 !== undefined && err2 !== null) || rep2 === undefined) {
                res.status(500).send("An internal error occured");
                console.log("<=================>");
                console.error(err2);
                console.error(rep2);
                return;
              }

              res.json({
                languages: rep2,
                phase: rep[0].current_phase,
                timeRemaining,
              });
            },
          );
          break;

        // Phase 2
        case 2:
          conn.execute(
            `
                        SELECT lang, upvote
                        FROM SuggestionLang
                        WHERE phase_id = ?
                        ORDER BY upvote DESC`,
            [rep[0].id],
            (err2, rep2) => {
              if ((err2 !== undefined && err2 !== null) || rep2 === undefined) {
                res.status(500).send("An internal error occured");
                return;
              }

              res.json({
                languages: rep2,
                phase: rep[0].current_phase,
                timeRemaining,
              });
            },
          );
          break;

        // Phase 3 && Phase 4
        case 3:
        case 4:
          conn.execute(
            `SELECT lang, upvote_final
                        FROM SuggestionLang
                        WHERE phase_id = ?
                        ORDER BY upvote DESC
                        LIMIT 2`,
            [rep[0].id],
            (err2, rep2: any[]) => {
              if ((err2 !== undefined && err2 !== null) || rep2 === undefined) {
                res.status(500).send("An internal error occured");
                return;
              }

              rep2 = rep2.map((e) => {
                e.upvote = e.upvote_final;
                return e;
              });

              res.json({
                languages: rep2,
                phase: rep[0].current_phase,
                timeRemaining,
              });
            },
          );
          break;

        // Case it's invalid
        case -1:
        default:
          res.status(500).send("An internal error occured");
          return;
      }
    },
  );
};

/**
 * Submits a new language to be considered for addition to the list of available languages.
 * @param {AuthenticatedRequest} req - The authenticated request containing the language to be added.
 * @param {Response} res - The response to be sent.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws {Error} 400 error if the request is invalid, missing a language or the language is empty or too long.
 * @throws {Error} 403 error if the provided language contains inappropriate words or characters, and remove the right to vote of the user.
 * @throws {Error} 404 error if there is no phase.
 * @throws {Error} 409 error if a language already exists with the same name.
 * @throws {Error} 500 error if an internal error occurs during the database query.
 * @throws {Error} 503 error if the current phase is not 1 or if the language submission process has ended.
 * @remarks
 * - The function checks if the language provided in the request is valid, and whether it contains inappropriate words or characters.
 * - The function queries the database to determine the current phase of the language submission process.
 * - If the current phase is not 1, the function sends a 503 error indicating that the user cannot suggest new languages during the current phase.
 * - If there is no phase, the function sends a 404 error indicating that there are no phases found.
 * - The function checks if the language already exists in either the CurrentLang or SuggestionLang table.
 * - If the language already exists with the same name, the function sends a 409 error indicating that a language already exists with that name.
 * - The function adds the language to the SuggestionLang table.
 * - The function sends a JSON response indicating that the language has been added successfully.
 */
export const submitLanguage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Get the language from the request body.
  const lang: string | undefined | null = req.body.lang;

  // Check if the language was provided in the request.
  if (lang === undefined || lang === null) {
    res.status(400).send("Invalid request. Expected a language, found nothing.");
    return;
  }

  // Check if the length of the language is within the acceptable range.
  console.log(lang, lang.length);
  if (lang.length === 0) {
    res.status(400).send("The length of the language shouldn't be of length 0");
    return;
  }

  // Check if the length of the language is within the acceptable range.
  if (lang.length > 16) {
    res.status(400).send("The length of the language shouldn't exceed 16 chars.");
    return;
  }

  // Generated by ChatGPT
  // vvvvvvvvvvvvvvvvvvv
  const bad_words = [
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "cunt",
    "dick",
    "pussy",
    "whore",
    "slut",
    "faggot",
    "nigger",
    "retard",
    "spastic",
    "mongoloid",
    "cripple",
    "moron",
    "idiot",
    "imbecile",
    "stupid",
    "dumb",
    "ignorant",
    "fatso",
    "ugly",
    "weirdo",
    "psycho",
    "nutjob",
    "loon",
    "crazy",
    "enculé",
    "enculée",
    "connard",
    "connasse",
    "salope",
    "putain",
    "pute",
    "merde",
    "enculer",
    "niquer",
    "baiser",
    "trou du cul",
    "bite",
    "foutre",
    "suce",
    "sucer",
    "salaud",
    "chiennasse",
    "pétasse",
    "enculage",
    "enculée",
    "nique",
    "baise",
    "salop",
    "branleur",
    "branleuse",
    "trouduc",
    "pédé",
    "pédale",
    "pd",
    "tapette",
    "folle",
    "folle furieuse",
    "folle dingue",
    "folle à lier",
    "malade mentale",
    "malade",
    "tarée",
    "taré",
    "tarée mentale",
    "taré mental",
    "handicapé",
    "handicapée",
    "mongol",
    "mongole",
    "débile",
    "débile mentale",
    "débile mental",
    "con",
    "conne",
    "imbécile",
    "abruti",
    "abruti(e)",
    "couillon",
    "couillonne",
    "crotte",
    "enculé de ta mère",
    "pute de ta mère",
    "nique ta mère",
    "fils de pute",
    "fils de chienne",
    "connard de ta mère",
    "merdeux",
    "merdeuse",
    "merdeuse",
    "va te faire enculer",
    "va te faire foutre",
    "va niquer ta mère",
    "t'es qu'un connard",
    "t'es qu'une connasse",
    "t'es qu'une salope",
    "t'es qu'un enfoiré",
    "je m'en bats les couilles",
    "je m'en bats les steaks",
    "je m'en fous",
    "j'en ai rien à foutre",
    "j'en ai rien à cirer",
    "j'en ai rien à taper",
    "je m'en bats l'oeil",
    "je m'en bats les reins",
    "je m'en bats les c*******",
    "aller se faire voir",
    "aller au diable",
    "aller se faire foutre",
    "aller se faire enculer",
    "aller se faire niquer",
    "vas te faire voir",
    "vas au diable",
    "vas te faire foutre",
    "vas te faire enculer",
    "vas te faire niquer",
    "nique ta mère",
    "nique ta grand-mère",
    "nique ta race",
    "suce ma bite",
    "suce ma queue",
    "suce moi",
    "baise ta mère",
    "baise ta grand-mère",
    "baise ta race",
    "ferme ta gueule",
    "ferme ta bouche",
    "ta gueule",
    "nique toi",
    "va niquer ta mère",
    "va niquer ta grand-mère",
    "va niquer ta race",
    "tête de gland",
    "cul terreux",
    "cul terre à terre",
    "trouduc",
    "casse-toi",
    "dégage",
    "fous le camp",
    "va-t-en",
    "connard",
    "connasse",
    "salope",
    "putain",
    "pute",
    "merde",
    "enculer",
    "niquer",
    "baiser",
    "trou du cul",
    "bite",
    "foutre",
    "suce",
    "sucer",
    "salaud",
    "chiennasse",
    "pétasse",
    "enculage",
  ];

  // If there is in fact a bad word,
  if (bad_words.includes(lang) || bad_words.some((word) => lang.includes(word))) {
    // Remove the right to vote of the user
    conn.execute("UPDATE Users SET vote_right = 0 WHERE token = ?", [req.token]);

    // Notify it to him
    res
      .status(403)
      .send(
        "We detected that you tried to put innapropriate words and not a language. You don't have the right to add languages anymore. If you think that this is an error, contact an administrator.",
      );
  }

  // Get the current phase of the language submission process.
  conn.execute(
    `
        SELECT
            id,
            CASE
                WHEN NOW() < phase2 THEN 1
                WHEN NOW() < phase3 THEN 2
                WHEN NOW() < phase4 THEN 3
                WHEN NOW() < phaseend THEN 4
                ELSE -1
            END AS current_phase
        FROM Phases
        WHERE NOW() > phase1
        ORDER BY id DESC
        LIMIT 1`,
    async (err2, rep2: any[]) => {
      if ((err2 !== undefined && err2 !== null) || rep2 === undefined) {
        res.status(500).send("An internal error occured while trying to get the current phase.");
        console.error(err2);
        return;
      }

      // If there is no phase.
      if (rep2.length === 0) {
        res.status(404).send("No phases found.");
        return;
      }

      // If it's not the first phase
      if (rep2[0].current_phase !== 1) {
        res
          .status(503)
          .send(`You can not suggest new languages during phase ${rep2[0].current_phase}`);
      }

      // Check if the language already exists in either the CurrentLang or SuggestionLang table.
      conn.execute(
        `
                SELECT EXISTS(
                    SELECT 1 FROM CurrentLang WHERE LOWER(lang) = ?
                    UNION
                    SELECT 1 FROM SuggestionLang WHERE LOWER(lang) = ? AND phase_id = ? 
                ) as exists_lang
                `,
        [lang.toLowerCase(), lang.toLowerCase(), rep2[0].id],
        async (err, rep) => {
          if (err || rep === undefined || rep === null) {
            res
              .status(500)
              .send(
                "An internal error occured while trying to get languages with the name of " + lang,
              );
            console.log(err);
            return;
          }

          // If there is a conflict with a language having the same name.
          if (rep[0].exists_lang === 1) {
            res.status(409).send("A language already exists with that name.");
            return;
          }

          // Get the user ID associated with the token provided in the request.
          conn.execute(
            "SELECT id, vote_right FROM Users WHERE token = ? LIMIT 1",
            [req.token],
            async (err3, rep3: any[]) => {
              if ((err3 !== undefined && err3 !== null) || rep3 === undefined) {
                res.status(500).send("An internal error occured while trying to get your token.");
                console.error(err3);
                return;
              }

              // If no user
              if (rep3.length === 0) {
                res.status(404).send("No user found.");
                return;
              }

              // If the user doesn't have the right to vote
              if (rep3[0].vote_right === 0) {
                res.status(403).send("You don't have the right to vote, due to past activites.");
                return;
              }

              // Check if the user has already submitted the maximum number of language suggestions.
              conn.execute(
                "SELECT COUNT(*) as suggestions FROM SuggestionLang WHERE owner_id = ? AND phase_id = ?",
                [rep3[0].id, rep2[0].id],
                async (err4, rep4: any[]) => {
                  // If it's an invalid response
                  if ((err4 !== undefined && err4 !== null) || rep4 === undefined) {
                    res
                      .status(500)
                      .send(
                        "An internal error occured while trying to get the number of suggested lang.",
                      );
                    console.error(err4);
                    return;
                  }

                  // If there is less than 3 languages suggestion
                  if (rep4.length === 0 || rep4[0].suggestions < 3) {
                    // Insert it in the DB
                    conn.execute(
                      "INSERT INTO SuggestionLang (lang, owner_id, phase_id) VALUES (?, ?, ?)",
                      [lang, rep3[0].id, rep2[0].id],
                    );
                    // Return to the user that the lang has been """created"""
                    res.status(201).send("Lang created successfully.");
                  } else {
                    res.status(429).send("You can only submit 3 languages.");
                  }
                },
              );
            },
          );
        },
      );
    },
  );
};

/**
 * Allows the authenticated user to vote for a language during the current phase.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the language provided in the request body is null or undefined.
 * @throws 404 error if the language provided in the request body is not a suggested language for the current phase.
 * @throws 403 error if the provided authentication token is invalid.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 503 error if the current phase is not 2 or 3, indicating that the user cannot vote during the current phase.
 *
 * @remarks
 * - The function retrieves the current phase from the database and checks if it is phase 2 or 3.
 * - If the language provided in the request body is null or undefined, the function sends a 400 error indicating that the request is invalid.
 * - If the language provided in the request body is not a suggested language for the current phase, the function sends a 404 error indicating that the language does not exist.
 * - The function then retrieves the ID of the authenticated user and checks if the user has already voted for the language.
 * - If the user has already voted for the language, the function removes the user's vote and updates the suggestion count accordingly.
 * - If the user has not already voted for the language, the function adds the user's vote and updates the suggestion count accordingly.
 * - Finally, the function sends a response indicating whether the user has successfully voted or unvoted the language.
 */
export const voteLanguage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  let lang: string = req.body.lang;

  // If the lang is null or undefined
  if (lang === undefined || lang === null) {
    res.status(400).send("Invalid request.");
    return;
  }

  // Put the lang to lowerCase.
  lang = lang.toLowerCase();

  // Get the Rows of the phase
  const [rows0] = await sqlExec(
    `SELECT 
        id,
        CASE
            WHEN NOW() < phase2 THEN 1
            WHEN NOW() < phase3 THEN 2
            WHEN NOW() < phase4 THEN 3
            WHEN NOW() < phaseend THEN 4
            ELSE -1
        END AS current_phase
    FROM Phases
    WHERE NOW() > phase1
    ORDER BY id DESC
    LIMIT 1`,
  ).catch((_err) => {
    res.status(500).send("An internal error occured.");
    return;
  });

  // Extract the ID and the current
  const { id, current_phase } = rows0;

  // If it's not the good phase
  if (current_phase !== 2 && current_phase !== 3) {
    res.status(503).send("You cannot vote during the phase " + current_phase);
    return;
  }

  // Get the lang suggested
  const rows1 = await sqlExec("SELECT * FROM SuggestionLang WHERE phase_id = ?", [id]);

  if (
    rows1 === null ||
    rows1.length === 0 ||
    !rows1.map((l) => l.lang.toLowerCase()).includes(lang.toLowerCase())
  ) {
    res.status(404).send("There is no such language with that name");
    return;
  }

  // Get the ID of the user
  const [{ id: owner_id }] = await sqlExec("SELECT id FROM Users WHERE token = ?", [req.token]);

  if (owner_id === null) {
    res.status(403).send("Invalid token.");
    return;
  }

  // Get if the user already voted for the language
  const rows2 = await sqlExec(
    `SELECT owner_id
        FROM UpvoteLang
        WHERE owner_id = ?
        AND LOWER(lang) = ?
        AND phase_id = ?
        AND final = ${+(current_phase === 3)}`,
    [owner_id, lang, id],
  );

  const voted: boolean = rows2.length !== 0;
  // The type of upvote
  const typeUpvote: string = current_phase === 3 ? "upvote_final" : "upvote";

  // If the user already voted => unvote
  if (voted) {
    // Delete the vote from the table of upvotelang
    await sqlExec(
      `DELETE FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ? AND final = ${+(
        current_phase === 3
      )};`,
      [lang, owner_id, id],
    );
    // Update teh suggestionLang by removing 1 upvote
    await sqlExec(
      `UPDATE SuggestionLang SET ${typeUpvote} = ${typeUpvote} - 1 WHERE lang = LOWER(?) AND phase_id = ?;`,
      [lang, id],
    );

    res.send("Unvoted the language");
  }

  // Else if the user didn't vote => vote
  else {
    // Add the vote in the table of upvotelang
    await sqlExec(
      `INSERT INTO UpvoteLang (lang, owner_id, phase_id, final)
            VALUES (?, ?, ?, ${+(current_phase === 3)});`,
      [lang, owner_id, id],
    );
    // Update the counter
    await sqlExec(
      `UPDATE SuggestionLang SET ${typeUpvote} = ${typeUpvote} + 1 WHERE lang = LOWER(?) AND phase_id = ?;`,
      [lang, id],
    );

    // If it's a final vote
    if (current_phase === 3) {
      // We need to verify that there isn't any upvote for the other language
      // So first, we need to know how many lang are upvoted
      const languagesUpvoted = await sqlExec(
        `SELECT lang
                FROM UpvoteLang
                WHERE owner_id = ? AND phase_id = ? AND final = 1`,
        [owner_id, id],
      );

      // If there is 2 votes <=> if he voted for 2 languages
      // This means, that he/she doesn't support the other language anymore
      // So we need to delete all others languages that aren't the one that is upvoted
      languagesUpvoted
        .filter((l) => l.lang !== lang) // Only keep languages that aren't the one which is currenyly upvoted
        .map(async (l) => {
          // Remove the vote from UpvoteLang
          await sqlExec(
            `DELETE FROM UpvoteLang
                    WHERE owner_id = ? AND phase_id = ? AND lang = ? and final = 1 -- Delete the lang upvoted by this user in the final phase, for this given phase
                    `,
            [owner_id, id, l.lang],
          );

          // Update the number of votes for the lang
          await sqlExec(
            `UPDATE SuggestionLang
                    SET upvote_final = upvote_final - 1
                    WHERE lang = ? AND phase_id = ?`,
            [l.lang, id],
          );
        });
    }

    res.status(201).send("Voted the language");
  }
};

/**
 * Retrieves the list of languages upvoted by the authenticated user during the current phase.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 503 error if the current phase is not 2 or 3.
 * @throws 403 error if the provided authentication token is invalid.
 *
 * @remarks
 * - The function queries the database to determine the current phase.
 * - If the current phase is not 2 or 3, the function sends a 503 error indicating that the user cannot vote during the current phase.
 * - The function then retrieves the ID of the authenticated user and queries the database to retrieve the languages upvoted by the user during the current phase.
 * - Finally, the function sends a JSON response containing the list of languages upvoted by the user during the current phase.
 */
export const getPersonnalUpvotes = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  // Get the current phase and the id of the phase
  const [rows] = await sqlExec(
    `SELECT
            id,
            CASE
                WHEN NOW() < phase2 THEN 1
                WHEN NOW() < phase3 THEN 2
                WHEN NOW() < phase4 THEN 3
                WHEN NOW() < phaseend THEN 4
                ELSE -1
            END AS current_phase
        FROM Phases
        WHERE NOW() > phase1
        ORDER BY id DESC
        LIMIT 1`,
  ).catch((_err) => {
    res.status(500).send("An internal error occured.");
    return;
  });

  // Get the ID and the current_phase
  const { id, current_phase } = rows;

  if (current_phase !== 2 && current_phase !== 3) {
    res.status(503).send("You cannot vote during the phase " + current_phase);
    return;
  }

  // Get the ID of the user
  const [{ id: owner_id }] = await sqlExec("SELECT id FROM Users WHERE token = ?", [req.token]);

  if (owner_id === null) {
    res.status(403).send("Invalid token.");
    return;
  }

  // Get if the languages that the user upvoted this phase
  const languages = await sqlExec(
    `
        SELECT lang
        FROM UpvoteLang
        WHERE owner_id = ?
        AND phase_id = ?
        AND final = ${+(current_phase === 3)}`,
    [owner_id, id],
  );

  interface languagesJSONType {
    lang: string;
  }

  res.json(languages.map((langJSON: languagesJSONType) => langJSON.lang));
};

/**
 * Get the current status of the programming languages
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 */
export const getStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Define the URL that we want to write to
  const requestURL: string = "http://217.69.14.183/status";
  //const requestURL: string = "http://localhost:5800/status"

  const options = {
    method: "GET",
    url: requestURL,
  };

  await axios(options).then((response) => {
    console.log(response);
    console.log(response.data);
    res.json(response.data);
  });
};

/**
 * Get the versions of programming languages in WeekGolf
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 */
export const getVersions = async (req: Request, res: Response): Promise<void> => {
  // Define the URL we want to write to
  const requestURL: string = "http://217.69.14.183/versions";
  //const requestURL: string = "http://localhost:5800/versions"

  const options = {
    method: "GET",
    url: requestURL,
  };

  await axios(options).then((response) => {
    res.json(response.data);
  });
};
