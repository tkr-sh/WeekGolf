import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import conn from "../../../config/initDB";
import sqlExec from "../utils/sqlExec";


/**
 * Retrieves the relation between the authenticated user and another user, given their name or ID.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 404 error if the requested user or the user who made the request is not found.
 *
 * @remarks
 * - The function retrieves the name or ID of the user to get the relation with, as well as the authentication token.
 * - The function queries the database to get the ID of the user who made the request.
 * - If the token is invalid or not found, the function sends a 404 error.
 * - The function queries the database to get the ID of the requested user based on the provided name or ID.
 * - If the requested user is not found, the function sends a 404 error.
 * - The function checks if the requested user is the same as the user who made the request, and returns a status of -1 if true.
 * - The function checks if the user who made the request follows the requested user, and sets the first bit of the status accordingly.
 * - The function checks if the requested user follows the user who made the request, and sets the second bit of the status accordingly.
 * - The function sends a JSON response containing the status of the relation between the two users.
 */
export const getRelation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

	// Get the name or the the id of the user
	let { name, id } = req.query;
    const token = req.token;

    // Get the id of the user who made the request
    await conn.execute(
        "SELECT id FROM Users WHERE token = ?",
        [token],
        async (err, rep) => {
            // If an internal error occured
            if (err || rep === undefined) {
                res.status(500).send("An error occured while trying to get the relation with this user.");
                return;
            }

            // If there is no user with that token (shouldn't happen)
            if (rep.length === 0) {
                res.status(404).send("No user with that token.")
                return;
            }

            // Store the id of the user who made the request
            const requestId = rep[0].id;

            await conn.execute(
                "SELECT id FROM Users WHERE id = ? OR username = ? LIMIT 1",
                [id, name].map(v => v === undefined ? null : v),
                async (err2, rep2) => {
                    // If an internal error occured
                    if (err2 || rep2 === undefined) {
                        res.status(500).send("An error occured while trying to get the relation with this user.");
                        return;
                    }

                    // If there is no user with that id or token
                    if (rep2.length === 0) {
                        res.status(404).send("No user with that id or name.")
                        return;
                    }


                    // Store the id of the user who was requested.
                    const requestedId = rep2[0].id;


                    // If it's self
                    if (requestedId === requestId) {
                        res.json({status: -1});
                    }


                    // Check to see if the request user follow the requested.
                    const reqToRequested = await sqlExec(
                        "SELECT EXISTS(SELECT * FROM Friends WHERE follower_id = ? AND following_id = ?) as exist",
                        [requestId, requestedId]
                    );

                    // Check to see if the requested user follow the user who made the request.
                    const requestedToReq = await sqlExec(
                        "SELECT EXISTS(SELECT * FROM Friends WHERE follower_id = ? AND following_id = ?) as exist",
                        [requestedId, requestId]
                    );


                    const status = reqToRequested[0].exist + requestedToReq[0].exist * 2;


                    res.json({ status })
                }
            );
        }
    );
}




/**
 * Updates the friendship relation between two users based on the provided request body.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request containing the information needed to update the friendship relation.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the provided ID or name is undefined or if the user tries to befriend themself.
 * @throws 404 error if the requested user (based on ID or name) is not found in the database or if there is no user with the provided token.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function retrieves the ID of the user who made the request from the provided token.
 * - It then queries the database to retrieve the ID of the requested user based on the provided ID or name.
 * - If the requested user is not found or if it is the same as the request user, the function sends an error response and stops the execution.
 * - The function checks if a friendship relation already exists between the two users. If it does, it deletes it, otherwise, it creates a new one.
 * - The function then sends a response indicating that the operation was successful.
 */
export const updateRelation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

	// Get the name or the the id of the user
	let { name, id } = req.body;
    const token = req.token;

    // Get the id of the user who made the request
    await conn.execute(
        "SELECT id FROM Users WHERE token = ?",
        [token],
        async (err, rep) => {
            // If an internal error occured
            if (err || rep === undefined) {
                res.status(500).send("An error occured while trying to get the relation with this user.");
                return;
            }

            // If there is no user with that token (shouldn't happen)
            if (rep.length === 0) {
                res.status(404).send("No user with that token.")
                return;
            }

            // Store the id of the user who made the request
            const requestId = rep[0].id;

            console.log([id, name].map(v => v === undefined ? null : v))

            await conn.execute(
                "SELECT id FROM Users WHERE id = ? OR username = ? LIMIT 1",
                [id, name].map(v => v === undefined ? null : v),
                async (err2, rep2) => {
                    // If an internal error occured
                    if (err2 || rep2 === undefined) {
                        res.status(500).send("An error occured while trying to get the relation with this user.");
                        return;
                    }

                    // If there is no user with that id or name
                    if (rep2.length === 0) {
                        res.status(404).send("No user with that id or name.")
                        return;
                    }


                    // Store the id of the user who was requested.
                    const requestedId = rep2[0].id;


                    // If it's self
                    if (requestedId === requestId) {
                        res.status(400).send("You can't be friend with your self.");
                        return;
                    }


                    // Check to see if the request user follow the requested.
                    const reqToRequested = await sqlExec(
                        "SELECT EXISTS(SELECT * FROM Friends WHERE follower_id = ? AND following_id = ?) as exist",
                        [requestId, requestedId]
                    );

                    // Check to see if it alredy exists
                    if (reqToRequested[0].exist) {
                        // If it already exists
                        // Now we need to delete it
                        await conn.execute(
                            `DELETE FROM Friends WHERE follower_id = ? AND following_id = ?`,
                            [requestId, requestedId]
                        );
                    } else {
                        // Else if it doesn't exists
                        // We need to create it
                        await conn.execute(
                            `INSERT INTO Friends (follower_id, following_id)
                            VALUES (?, ?)`,
                            [requestId, requestedId]
                        );
                    }
                    
                    // Return the fact that everything seems to be OK :)
                    res.send("OK.")
                }
            );
        }
    );
}


/**
 * Retrieves the list of friends of the authenticated user.
 * 
 * @param {Request} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function retrieves the ID of the authenticated user from the request and uses it to query the database for the list of users they follow and the list of users that follow them.
 * - The function then sends a JSON response containing the lists of users who are followed by the authenticated user and those who follow them.
 * - Each list contains the username and profile picture of each user.
 */
export const getFriends = async (req: Request, res: Response): Promise<void> => {
    // Stock the token
    let { name, id } = req.query;

    // Now, we need to get the id of this user so that it's easier to get relation
    // Else we would have need to do (SELECT id FROM username = ?) everytime
    // And because it's already a verified token, we can do [{id}]
    [{id}] = await sqlExec(
        "SELECT id FROM Users WHERE id = ? OR username = ? LIMIT 1",
        [id, name].map(v => v === undefined ? null : v)
    )

    
    // Get the user(s) that the user (request) follows
    const following = await sqlExec(
        `SELECT username, pfp
        FROM Friends, Users
        WHERE Friends.follower_id = ? AND Friends.following_id = Users.id`,
        [id]
    )

    // Get the user(s) that follows the user who made the request
    const followers = await sqlExec(
        `SELECT username, pfp 
        FROM Friends, Users
        WHERE Friends.following_id = ? AND Friends.follower_id = Users.id`,
        [id]
    )


    res.json({ following, followers }); 
}
