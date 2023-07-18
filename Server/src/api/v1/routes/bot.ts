import { Request, Response } from "express";
import sqlExec from "../utils/sqlExec";
import conn from "../../../config/initDB";




/**
 * Retrieves the mean minimum size of solutions for each programming language.
 * 
 * @param {Request} _ - The request object.
 * @param {Response} res - The response object.
 * 
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function queries the database to retrieve the mean minimum size of solutions for each programming language.
 * - The function calculates the minimum size of each solution per programming language.
 * - The function groups the solutions by programming language and then calculates the mean of the minimum sizes for each group.
 * - Finally, the function sends a JSON response containing the mean minimum size of solutions for each programming language, ordered by mean minimum size in ascending order.
 */
export const meanLanguages = async (_: Request, res: Response) => {
    res.json(
        await sqlExec(
            `SELECT lang, AVG(min_size) AS mean_min_size
            FROM (
                SELECT lang, problem_id, MIN(size) AS min_size
                FROM Solutions
                GROUP BY lang, problem_id
                ) AS subquery
            GROUP BY lang
            ORDER BY mean_min_size`
        )
    );
}


/**
 * Retrieves information about the current weekly problem.
 * 
 * @param {Request} _ - The request object.
 * @param {Response} res - The response object.
 * 
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function queries the database to retrieve information about the current weekly problem.
 * - The function retrieves the title, ID, total number of votes, number of voters, time remaining until the weekly problem ends, and whether the problem is a "lotw" (problem of the week).
 * - The function only retrieves information about problems that have been enabled (i.e., their "date_enable" field is in the past).
 * - The function returns a JSON response containing the retrieved information about the current weekly problem.
 */
export const weekInfo = async (_: Request, res: Response) => {
    res.json(
        await sqlExec(
            `SELECT title, id, sum_votes, voters, UNIX_TIMESTAMP(date_end) - UNIX_TIMESTAMP(NOW()) AS time, lotw
            FROM Problems
            WHERE date_enable < NOW()
            ORDER BY date_enable DESC
            LIMIT 1`
        )
    )
}


/**
 * Retrieves the top programming languages upvoted by users during the current or most recent voting phase.
 * 
 * @param {Request} _ - The request object.
 * @param {Response} res - The response object.
 * 
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function checks the current phase of the voting process by querying the database.
 * - If the current phase is 1 or 2, the function retrieves the top 5 programming languages upvoted by users during the current voting phase.
 * - If the current phase is 3, the function retrieves the top 2 programming languages upvoted by users during the most recent voting phase.
 * - The function returns a JSON response containing the programming languages, their corresponding number of upvotes, and the file name of the SVG icon associated with each language.
 */
export const topLanguages = async (_: Request, res: Response) => {
    // If phase ID is correct
    const [{ exist }] = await sqlExec(
        "SELECT EXISTS(SELECT * FROM Phases WHERE phase1 <= NOW() AND phase3 > NOW()) AS exist"
    );

    // If it's phase 1 or 2
    if (exist) {
        // SQL
        const rows = await sqlExec(
            `SELECT lang, upvote, CONCAT(LOWER(lang), '_white.svg') AS img
            FROM SuggestionLang
            WHERE phase_id = (
                SELECT id FROM Phases WHERE phase1 <= NOW() AND phase3 > NOW()
            )
            ORDER BY upvote DESC
            LIMIT 5`
        );

        // Send the JSON
        res.json(rows);
    } else {
        // SQL
        const rows = await sqlExec(
            `SELECT lang, upvote, CONCAT(LOWER(lang), '_white.svg') AS img
            FROM SuggestionLang
            WHERE phase_id = (
                SELECT id FROM Phases WHERE phase3 <= NOW() AND phaseend > NOW()
            )
            ORDER BY upvote_final DESC
            LIMIT 2`
        );

        // Send the JSON
        res.json(rows);
    }
}
