import { Request, Response } from "express";
import conn from "../../../config/initDB";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import sqlExec from "../utils/sqlExec";




/**
 * Retrieves the list of comments made by a specified user.
 * 
 * @param {Request} req - The request object containing the user ID or name.
 * @param {Response} res - The response object to send the comments.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the request object is invalid.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function retrieves the ID or name of the user to get comments of from the request query.
 * - If the request is invalid, the function sends a 400 error indicating that the request is invalid.
 * - The function queries the database for comments made by the specified user, and orders the results by upvote count.
 * - The function then sends a JSON response containing the list of comments made by the user.
 */
export const getCommentsOfUser = async (req: Request, res: Response) => {
    // Get the id of the user that we want to get comments of
    const { id, name } = req.query;

    // If the request is invalid.
    if ((id === null || id === undefined) && (name === null || name === undefined)) {
        return res.status(400).send("Invalid request.");
    }


    await conn.execute(
        `SELECT Comments.*, (SELECT username FROM Users WHERE Users.id = Comments.owner_id) as name
        FROM Comments
        WHERE owner_id = ? OR owner_id = (SELECT id FROM Users WHERE username = ?)
        ORDER BY upvote DESC`,
        [id, name],
        (err, rep) => {
            if (err || rep === undefined) {
                console.error(err)
                res.status(500).send("Error.")
            } else {
                res.json(rep);
            }
        }
    )
}




/**
 * Retrieves the comments related to a specific problem.
 * 
 * @param {Request} req - The request object containing the ID of the problem to retrieve the comments for.
 * @param {Response} res - The response object used to send the retrieved comments.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws {Error} 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function retrieves the comments related to a specific problem by querying the database. 
 * It takes in the request object which contains the ID of the problem, and the response object to send the retrieved comments. 
 * The function throws a 500 error if an internal error occurs during the database query. 
 * The function returns a Promise that resolves once the response has been sent.
 */
export const getComments = async (req: Request, res: Response) => {
    // Get the ID of the problem
    const { id } = req.query;

    // If the request is invalid.
    if (id === null || id === undefined) {
        res.status(400).send("Invalid request.");
        return;
    }

    await conn.execute(
        `SELECT Comments.*, (SELECT username FROM Users WHERE Users.id = Comments.owner_id) as name
        FROM Comments
        WHERE (SELECT problem_id FROM Solutions WHERE Solutions.id = Comments.solution_id) = ?`,
        [id],
        (err, rep) => {
            if (err || rep === undefined) {
                console.error(err   )
                res.status(500).send("Error.")
            } else {
                res.json(rep);
            }
        }
    )
}





/**
 * Handles the upvoting and downvoting of comments by authenticated users.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object containing the ID of the comment to be voted on and the user token.
 * @param {Response} res - The response object to be sent.
 * @throws 400 error if the request is invalid (e.g., the ID is missing).
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function first checks if the comment has already been upvoted by the user.
 * - If the comment has not been upvoted by the user, the function inserts a new vote into the UpvoteComment table and increments the upvote count of the comment in the Comments table.
 * - If the comment has already been upvoted by the user, the function removes the vote from the UpvoteComment table and decrements the upvote count of the comment in the Comments table.
 * - The function sends a simple "OK" response to indicate that the vote was successful.
 */
export const voteComment = async (req: AuthenticatedRequest, res: Response) => {
    // Get the ID of the comment and the token
    const { id } = req.body;
    const token = req.token;

    // If the request is invalid.
    if (id === null || id === undefined) {
        res.status(400).send("Invalid request.");
        return;
    }

    await conn.execute(
        `SELECT *
        FROM UpvoteComment
        WHERE comment_id = ?
        AND owner_id = (SELECT id FROM Users WHERE token = ?)
        LIMIT 1`,
        [id, token],
        async (err, rep) => {
            if (err || rep === undefined) {
                console.error(err);
                res.status(500).send("An error occurred while trying to get this comment.")
                return;
            }

            // If there is no upvote
            if (rep.length === 0) {
                // Insert a vote into a table
                await conn.execute(
                    `INSERT INTO UpvoteComment (comment_id, owner_id)
                    VALUES (?, (SELECT id FROM Users WHERE token = ?))`,
                    [id, token]
                );
                // Add a vote
                await conn.execute(
                    `UPDATE Comments
                    SET upvote = upvote + 1
                    WHERE id = ?`,
                    [id]
                );
            } else {
                // Delete a vote from the table
                await conn.execute(
                    `DELETE FROM UpvoteComment
                    WHERE comment_id = ?
                    AND owner_id = (SELECT id FROM Users WHERE token = ?)`,
                    [id, token]
                );
                // Remove a vote
                await conn.execute(
                    `UPDATE Comments
                    SET upvote = upvote - 1
                    WHERE id = ?`,
                    [id]
                );
            }

            res.send("OK.")
        }
    );
}


/**
 * Inserts a comment for a given solution into the database.
 *
 * @param {AuthenticatedRequest} req - The authenticated request containing the comment content and solution ID.
 * @param {Response} res - The response object.
 * @returns {Promise<void>}
 * @throws 400 error if the request is invalid.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 403 error if the provided authentication token is invalid.
 *
 * @remarks
 * - The function retrieves the content and solution ID from the request body and the user ID from the authentication token.
 * - It inserts the comment into the Comments table in the database with the content, owner ID, solution ID, and current date.
 * - If the operation is successful, the function sends a "OK" response.
 */
export const postComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Get the content of the comment and the id of the solution
    const { content, id } = req.body;
    const token = req.token;

    // If the request is invalid.
    if (content === undefined || id === undefined) {
        res.status(400).send("Invalid request.");
        return;
    }

    // Get the user id
    const owner_id = ((await sqlExec("SELECT id FROM Users WHERE token = ? LIMIT 1", [token]))[0]).id


    await conn.execute(
        `INSERT INTO Comments (content, owner_id, solution_id, date_send)
        VALUES (?, ?, ?, NOW());`,
        [content, owner_id, id],
        () => res.send("OK.")
    );
}


/**
 * Retrieves the list of comments upvoted by the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws {Error} 500 error if an internal error occurs during the database query.
 * @throws {Error} 403 error if the provided authentication token is invalid.
 *
 * @remarks
 * - The function retrieves the ID of the authenticated user from the token in the request headers.
 * - The function queries the database to retrieve the list of comment IDs upvoted by the user.
 * - The function then sends a JSON response containing the list of comment IDs upvoted by the user.
 */
export const getPersonnalUpvotesComments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    await conn.execute(
        "SELECT comment_id AS id FROM UpvoteComment WHERE owner_id = (SELECT id FROM Users WHERE token = ?);",
        [req.token],
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured while getting personnal upvoted comments");
                return;
            }

            res.json(rep);
        }
    )
}
