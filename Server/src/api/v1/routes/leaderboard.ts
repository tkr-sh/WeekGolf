import { Request, Response } from "express";
import conn from "../../../config/initDB";
import sqlExec from "../utils/sqlExec";
import { Store } from "express-rate-limit";




/**
 * Retrieves the leaderboard for a specific category or for all categories.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws {Error} 400 error if the category parameter is not defined or not valid.
 * @throws {Error} 404 error if the category parameter corresponds to a non-existing language.
 * @throws {Error} 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function takes a category parameter in the request query and retrieves the leaderboard for that category or for all categories.
 * - If the category parameter is not defined or not valid, the function throws a 400 error indicating that a category field is expected.
 * - If the category parameter corresponds to a non-existing language, the function throws a 404 error indicating that the language does not exist.
 * - The function then queries the database to retrieve the leaderboard for the specified category or for all categories.
 * - Finally, the function sends a JSON response containing the leaderboard information.
 */
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {

    const category: string | null | undefined = req.query.category as string;



    // If category isn't valid or defined
    if (category === null || category === undefined) {
        res.status(400).send("Expected a category field.");
        return;
    }


    // Different categories that doesn't depend on the language
    const categories: string[] = ["global", "golf", "upgrade", "cooperation"];
    const categoryCorrespondance: {[key: string]: string} = {
        "global": "golf_score + upgrade_score + coop_score",
        "golf": "golf_score",
        "upgrade": "upgrade_score",
        "cooperation": "coop_score",
    }


    // If it's a global category
    if (categories.includes(category)) {
        await conn.execute(
            `SELECT ${categoryCorrespondance[category]} as points, username as name, pfp FROM Users`,
            (err, rep) => {
                if (err || rep === undefined) {
                    res.status(500).send("An internal error occured while trying to get the leaderboard");
                    return;
                }

                res.json(rep);
            }
        )
    } else {

        const [rows] =
            await sqlExec(
                "SELECT EXISTS(SELECT 1 FROM CurrentLang WHERE LOWER(lang) = ?) as exists_lang;",
                [category.toLowerCase()]
            );


        console.log(rows);

        // If this lang isn't valid
        if (rows.exists_lang === 0) {
            res.status(404).send("This language doesn't exists");
            return;
        }

        // Get the language
        await conn.execute(
            `SELECT
                ${category.toLowerCase().replace("#","s").replace("++", "pp")}_score as points,
                u.username as name,
                u.pfp as pfp
            FROM UserLanguages
            JOIN Users u ON u.id = UserLanguages.owner_id
            WHERE ${category.toLowerCase().replace("#","s").replace("++", "pp")}_score > 0`,
            (err, rep) => {
                if (err || rep === undefined) {
                    res.status(500).send("An internal error occured while trying to get the leaderboard");
                    console.error(err);
                    return;
                }

                res.json(rep);
            }
        )
    }
}




/**
 * Retrieves the leaderboard of the minimum bytes submitted for a specific problem and language combination.
 * 
 * @param {Request} req - The request object containing the query parameters for the problemId and lang.
 * @param {Response} res - The response object to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if either problemId or lang query parameter is null.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function receives a GET request containing the query parameters problemId and lang, and uses them to retrieve the leaderboard of the minimum bytes submitted for the given problem and language combination.
 * - If either problemId or lang query parameter is null, the function sends a 400 error indicating that both query parameters must be specified.
 * - The function retrieves the owner_id, minimum bytes, date of submission, username and profile picture of the users who submitted the minimum bytes for the given problem and language combination from the Solutions table of the database.
 * - The function then sends a JSON response containing the leaderboard of the minimum bytes submitted for the given problem and language combination.
 */
export const getLeaderboardProblem = async (req: Request, res: Response): Promise<void> => {

    // Get the problemId and the language
    const {problemId, lang} = req.query;

    if (problemId === null || lang === null) {
        res.status(400).send("Invalid request. ProblemID and lang shouldnt be null");
        return;
    }


    const rows = await sqlExec(
        `SELECT 
            owner_id,
            MIN(size) AS bytes,
            u.pfp AS pfp,
            u.username AS name,
            date_submit AS date
        FROM Solutions
        JOIN Users u ON u.id = Solutions.owner_id
        WHERE problem_id = ? AND lang = ? AND FROM_UNIXTIME(date_submit) <= (SELECT date_end FROM Problems WHERE id = ?)
        GROUP BY owner_id;`,
        [problemId, lang, problemId]
    )
    .catch(err => {
        res.status(500).send("An internal error occured.");
        console.error(err);
        return;
    });

    res.json(rows);
}
