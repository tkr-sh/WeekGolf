import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import conn from "../../../config/initDB";
import sqlExec from "../utils/sqlExec";



/**
 * Retrieves a contribution by its ID.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function retrieves a contribution from the database based on the provided ID.
 * It retrieves the contribution details, including the author, input, and expected output.
 * If the contribution is not found or an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends a JSON response with the contribution details.
 */
export const getContribution = async (req: Request, res: Response) => {

    const { id } = req.query;

    if (id === undefined || id === null) {
        return res.status(400).send("Bad request. Expected field: id")
    }

    await conn.execute(
        `SELECT 
            Contribution.*,
            id, 
            title,
            description,
            example,
            more_info,
            vote,
            state,
            (SELECT username FROM Users WHERE id = Contribution.owner_id) AS author,
            (SELECT input FROM TestCaseContribution WHERE contribution_id = Contribution.id AND id_output = 0) AS input,
            (SELECT expected_output FROM TestCaseContribution WHERE contribution_id = Contribution.id AND id_output = 0) AS output
        FROM Contribution
        WHERE id = ?`,
        [id],
        (err, rep) => {
            if (err || rep === undefined) {
                console.error(err)
                res.status(500).send("Error.")
            } else {
                res.json(rep[0]);
            }
        }
    )
}



/**
 * Retrieves a list of contributions.
 * 
 * @param {Request} _ - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function retrieves a list of contributions from the database.
 * It retrieves the ID, title, description, vote count, state, and author for each contribution.
 * The contributions are ordered by the vote count in descending order.
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends a JSON response with the list of contributions.
 */
export const getContributions =  async (_: Request, res: Response) => {
    await conn.execute(
        `SELECT 
            id,
            title,
            description,
            vote,
            state,
            (SELECT username FROM Users WHERE id = Contribution.owner_id) AS author
        FROM Contribution
        ORDER BY vote DESC`,
        [],
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
 * Retrieves the votes in contributions for the authenticated user.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function retrieves the votes in contributions for the authenticated user.
 * It retrieves the contribution ID and the vote value (up or down) from the UpvoteContribution table.
 * The user is identified based on the authentication token provided in the request.
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends a JSON response with the votes in contributions for the user.
 */
export const getVotesInContributions = async (req: AuthenticatedRequest, res: Response) => {
    const token = req.token;

    await conn.execute(
        `SELECT contribution_id AS id, up FROM UpvoteContribution WHERE owner_id = (SELECT id AS owner_id FROM Users WHERE token = ?)`,
        [token],
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
 * Votes for a contribution.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function allows the authenticated user to vote for a contribution.
 * The request body should contain the following properties:
 * - up: The vote value (1 for upvote, 0 for downvote).
 * - id: The ID of the contribution.
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * If the user has already voted for the contribution, it updates the existing vote or deletes it based on the new vote value.
 * If the user wants to delete their vote, it removes the upvote from the database and updates the contribution vote count accordingly.
 * If the user wants to change their vote, it updates the state of the vote and adjusts the contribution vote count accordingly.
 * 
 * If the user hasn't voted for the contribution, it adds their vote to the database and updates the contribution vote count accordingly.
 * 
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends an "OK" response.
 */
export const voteContribution = async (req: AuthenticatedRequest, res: Response) => {

    // How the request should be
    interface RequestType {
        up: number,
        id: number,
    }

    const token = req.token;
    let { up, id } = req.body as RequestType;
    up = +up;

    // If the request is invalid
    if (up === undefined || id === undefined || up === null || id === null ) {
        return res.status(400).send("Bad request.");
    }

    // Get the ID of the user
    const [{ id: userId }] = await sqlExec("SELECT id FROM Users WHERE token = ?", [token]);

    // Did the user already upvoted ?
    const userVoted = await sqlExec("SELECT up FROM UpvoteContribution WHERE contribution_id = ? AND owner_id = ?", [id, userId]);


    if (userVoted.length > 0) {
        // If the user wants to delete its vote
        if ((userVoted[0].up === 1 && up) || (userVoted[0].up === 0 && !up)) {
            // Delete the upvote from the database
            await conn.execute(
                `DELETE FROM UpvoteContribution
                WHERE contribution_id = ? AND owner_id = ?`,
                [id, userId]
            )

            // Update the contribution by removing one
            await conn.execute(
                `UPDATE Contribution
                SET vote = vote ${up !== 1 ? '-' : '+'} - 1
                WHERE id = ?`,
                [id],
                (err, rep) => {
                    if (err || rep === undefined) {
                        console.error(err)
                        res.status(500).send("Error.")
                    } else {
                        res.send("OK.");
                    }
                }
            )
        } else {
            // Update the state of the vote
            await conn.execute(
                `UPDATE UpvoteContribution
                SET up = ?
                WHERE contribution_id = ? AND owner_id = ?`,
                [up, id, userId]
            )

            // Change the number of upvote on the page
            await conn.execute(
                `UPDATE Contribution
                SET vote = vote ${up === 1 ? '+' : '-'} 2
                WHERE id = ?`,
                [id],
                (err, rep) => {
                    if (err || rep === undefined) {
                        console.error(err)
                        res.status(500).send("Error.")
                    } else {
                        res.send("OK.");
                    }
                }
            )
        }
    } else {
        // If the user didn't vote, just add its vote
        await conn.execute(
            `UPDATE Contribution
            SET vote = vote ${up === 1 ? '+' : '-'} 1
            WHERE id = ?`,
            [id]
        );

        await conn.execute(
            `INSERT INTO UpvoteContribution (up, contribution_id, owner_id)
            VALUES (?, ?, ?)`,
            [up, id, userId],
            (err, rep) => {
                if (err || rep === undefined) {
                    console.error(err)
                    res.status(500).send("Error.")
                } else {
                    res.send("OK.");
                }
            }
        )
    }
}



/**
 * Posts a comment for a contribution.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function allows the authenticated user to post a comment for a contribution.
 * The request body should contain the following properties:
 * - id: The ID of the contribution.
 * - comment: The content of the comment.
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * It retrieves the ID of the authenticated user based on the provided token.
 * It inserts the comment into the CommentContribution table, associating it with the contribution and the user.
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends an "OK" response.
 */
export const postCommentContribution = async (req: AuthenticatedRequest, res: Response) => {

    const token = req.token;
    const { id, comment } = req.body;

    if (id === null || id === undefined || comment === null || comment === undefined) {
        return res.status(400).send("Invalid request.");
    }

    // Get the ID of the user
    const [{ id: userId }] = await sqlExec("SELECT id FROM Users WHERE token = ? LIMIT 1", [token]);

    await conn.execute(
        `INSERT INTO CommentContribution (contribution_id, owner_id, content, date_send)
        VALUES (?, ?, ?, NOW());`,
        [id, userId, comment],
        (err, rep) => {
            if (err || rep === undefined) {
                console.error(err)
                res.status(500).send("Error.")
            } else {
                res.send("OK.");
            }
        }
    )
}



/**
 * Retrieves the comments for a contribution.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function retrieves the comments for a contribution based on the provided ID.
 * The request query should contain the following property:
 * - id: The ID of the contribution.
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * It retrieves the comments' content, date of sending, upvote count, ID, and author for the specified contribution.
 * The comments are ordered by the date of sending in descending order.
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends a JSON response with the comments for the contribution.
 */
export const getCommentsContribution = async (req: AuthenticatedRequest, res: Response) => {

    const { id } = req.query;

    if (id === null || id === undefined) {
        return res.status(400).send("Invalid request.");
    }

    await conn.execute(
        `SELECT
            content,
            date_send,
            upvote,
            id,
            (SELECT username FROM Users WHERE id = CommentContribution.owner_id) AS author
        FROM CommentContribution
        WHERE contribution_id = ?
        ORDER BY date_send DESC`,
        [id],
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
 * Votes for a comment on a contribution.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function allows the authenticated user to vote for a comment on a contribution.
 * The request body should contain the following property:
 * - id: The ID of the comment.
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * It retrieves the ID of the authenticated user based on the provided token.
 * If the user has already voted for the comment, it removes the vote from the database and updates the comment's upvote count.
 * If the user hasn't voted for the comment, it adds their vote to the database and updates the comment's upvote count.
 * 
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends an "OK" response.
 */
export const voteCommentContribution = async (req: AuthenticatedRequest, res: Response) => {

    // How the request should be
    interface RequestType {
        id: number,
    }

    const token = req.token;
    let { id } = req.body as RequestType;

    // If the request is invalid
    if (id === undefined || id === null ) {
        return res.status(400).send("Bad request.");
    }

    // Get the ID of the user
    const [{ id: userId }] = await sqlExec("SELECT id FROM Users WHERE token = ?", [token]);

    // Did the user already upvoted ?
    const userVoted = await sqlExec("SELECT * FROM UpvoteCommentContribution WHERE comment_id = ? AND owner_id = ?", [id, userId]);


    if (userVoted.length > 0) {
        await conn.execute(
            `DELETE FROM UpvoteCommentContribution
            WHERE comment_id = ? AND owner_id = ?`,
            [id, userId]
        )

        // Update the contribution by removing one
        await conn.execute(
            `UPDATE CommentContribution
            SET upvote = upvote - 1
            WHERE id = ?`,
            [id],
            (err, rep) => {
                if (err || rep === undefined) {
                    console.error(err)
                    res.status(500).send("Error.")
                } else {
                    res.send("OK.");
                }
            }
        )
    } else {
        // If the user didn't vote, just add its vote
        await conn.execute(
            `UPDATE CommentContribution
            SET upvote = upvote + 1
            WHERE id = ?`,
            [id]
        );

        await conn.execute(
            `INSERT INTO UpvoteCommentContribution (comment_id, owner_id)
            VALUES (?, ?)`,
            [id, userId],
            (err, rep) => {
                if (err || rep === undefined) {
                    console.error(err)
                    res.status(500).send("Error.")
                } else {
                    res.send("OK.");
                }
            }
        )
    }
}



/**
 * Retrieves the votes for comments on a contribution for the authenticated user.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves once the response has been sent.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function retrieves the votes for comments on a contribution for the authenticated user.
 * The request query should contain the following property:
 * - id: The ID of the contribution.
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * It retrieves the comment IDs for which the user has voted from the UpvoteCommentContribution table.
 * The comments are filtered based on the contribution ID and the user's authentication token.
 * 
 * If an error occurs during the query, it returns a 500 error.
 * Otherwise, it sends a JSON response with the comment IDs.
 */
export const getVotesCommentsContribution = async (req: AuthenticatedRequest, res: Response) => {
    const token = req.token;
    const { id } = req.query;

    // If the request is invalid
    if (id === undefined || id === null) {
        return res.status(400).send("Bad request.");
    }
    await conn.execute(
        `SELECT UpvoteCommentContribution.comment_id AS id
        FROM UpvoteCommentContribution, CommentContribution
        WHERE ? = CommentContribution.contribution_id
        AND CommentContribution.id = UpvoteCommentContribution.comment_id
        AND UpvoteCommentContribution.owner_id = (SELECT id FROM Users WHERE token = ?);`,
        [id, token],
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



type TTestCase = {
    input: string,
    output: string,
}
type TCreateContribution = {
    title?: string,
    description?: string,
    example?: string,
    moreInfo?: string,
    fix?: TTestCase[],
    random?: TTestCase[],
}

const verifyValidityTestCaseJSON = (json: any) => {
    if (!Array.isArray(json)) {
        return false;
    }

    return json.every((item) => {
        return typeof item === 'object' && item !== null && typeof item?.input === 'string' && typeof item?.output === 'string';
    });
}




/**
 * Create a contribution
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function allows the authenticated user to create a contribution.
 * The request body should contain the following properties:
 * - title: The title of the contribution.
 * - description: The description of the contribution.
 * - example: The example for the contribution.
 * - moreInfo: Additional information for the contribution.
 * - fix: An array of test cases for the fix case.
 * - random: An array of test cases for the random case.
 * 
 * The test case objects should have the following properties:
 * - input: The input for the test case.
 * - output: The expected output for the test case.
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * It verifies the validity of the test case JSON arrays and their length.
 * It retrieves the ID of the authenticated user based on the provided token.
 * It inserts the contribution details into the Contribution table and retrieves the ID of the inserted contribution.
 * It inserts each test case into the TestCaseContribution table associated with the contribution ID.
 * If an error occurs during the queries, it returns a 500 error.
 * Otherwise, it sends a JSON response with the ID of the created contribution.
 */
export const createContribution = async (req: AuthenticatedRequest, res: Response) => {

    const token = req.token;

    const { title, description, example, moreInfo, fix, random } = req.body as TCreateContribution;

    // Verify that the request is correct
    if (title === null || description === null || example === null || moreInfo === null || fix === null || random === null) {
        return res.status(400).send("Bad request");
    }


    // Verify that the JSON are correct
    const totalJSON = [...fix, ...random];

    if (!verifyValidityTestCaseJSON(totalJSON)) {
        return res.status(400).send("The format of the JSON files that you submitted isn't correct.");
    }

    // Verify the length of fix and random
    if (fix.length > 24 || fix.length === 0)
        return res.status(400).send("The maximum number of fix case is of 24.");
    if (fix.length > 512)
        return res.status(400).send("The maximum number of random case is of 512.");


    // Get the ID of the user who created the problem
    const [{ id: ownerId }] = await sqlExec("SELECT id FROM Users WHERE token = ?", [token]);


    // Create the problem description
    await sqlExec(
        `INSERT INTO Contribution (
            title,
            description,
            example,
            more_info,
            owner_id,
            fix_case
        ) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            title,
            description,
            example,
            moreInfo,
            ownerId,
            fix.length,
        ]
    )
    .catch(err => {
        return res.status(500).send("An error occured while trying to insert the contribution in the database");
    });


    // Get the id of the contribution we just inserted
    const getProblemInsertedResult = await sqlExec(
        `SELECT id FROM Contribution WHERE title = ? ORDER BY created DESC LIMIT 1`,
        [title]
    );

    if (getProblemInsertedResult === undefined || getProblemInsertedResult.length === 0 || getProblemInsertedResult[0]?.id === undefined) {
        return res.status(500).send("An error occured whiel trying to get the ID of the contribution you just created");
    }



    // Insert every test case in the database
    totalJSON.forEach(
        async (e, i) => 
            await conn.execute(
                `INSERT INTO TestCaseContribution ( contribution_id, input, expected_output, id_output )
                VALUES (?, ?, ?, ?);`,
                [getProblemInsertedResult[0].id, e.input, e.output, i],
                (err, _) => {
                    if (err) {
                        return res.status(500).send("An error occured while creating test cases");
                    }
                }
            )

    )


    // Return the result with success
    res.json({ id: getProblemInsertedResult[0].id })
}




/**
 * Changes the state of a contribution (accept or decline).
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @throws {Error} - 400 error if the request is invalid.
 * @throws {Error} - 401 error if the user is unauthorized to accept or decline contributions.
 * @throws {Error} - 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * This function changes the state of a contribution to accept or decline based on the provided ID and acceptance flag.
 * The request body should contain the following properties:
 * - id: The ID of the contribution.
 * - accepted: A boolean flag indicating whether the contribution is accepted (true) or declined (false).
 * 
 * If the request is invalid (missing or null values), it returns a 400 error.
 * 
 * It verifies the user's authorization to accept or decline contributions.
 * If the user is unauthorized, it returns a 401 error.
 * 
 * If the contribution is declined, it updates the state of the contribution to -1.
 * 
 * If the contribution is accepted, it selects a Language of the Week (LOTW) randomly.
 * It retrieves the contribution details and the date of the last problem.
 * It calculates the end date of the new problem (7 days after the last problem's end date).
 * It inserts the contribution details into the Problems table, assigning the LOTW and the calculated dates.
 * It retrieves the test cases associated with the contribution.
 * It inserts the test cases into the VerifySolution table, associating them with the new problem ID.
 * Finally, it updates the state of the contribution to 1 (merged).
 * 
 * If an error occurs during the queries, it returns a 500 error.
 * Otherwise, it sends an "OK" response.
 */
export const changeState = async (req: AuthenticatedRequest, res: Response) => {
    const token = req.token;

    await conn.execute(
        `SELECT id FROM Users WHERE token = ?`,
        [token],
        async (err, rep) => {
            // If for some obscure reason there is an error
            if (err) {
                return res.status(500).send("An error occured while trying to get your token");
            }
            // If the user is not "TKirishima" <=> id === 1
            else if (rep[0].id !== 1) {
                return res.status(401).send("Unauthorized to accept or decline contributions");
            }
            // Else, we still need to verify that the request is valid!
            else {

                // We get the data of the request
                const { id, accepted } = req.body;
                // Check if it's valid
                if (id === undefined || id === null || accepted === undefined || accepted === null) {
                    return res.status(400).send("Missing field 'id'");
                }
                // If it's not accepted: Just say it has been refused
                else if (!accepted) {
                    await conn.execute(
                        `UPDATE Contribution SET state = -1 WHERE id = ?`,
                        [id],
                        (err2, _) => {
                            if (err2) {
                                return res.status(500).send("An error occured while trying to close the contribution");
                            }
                            res.send("OK.");
                        }
                    )
                }
                // If the contribution is accepted
                else {
                    // Start by choosing the LOTW for that problem
                    const [{ lang: lotw }] = await sqlExec("SELECT lang FROM CurrentLang ORDER BY RAND() LIMIT 1");

                    // Create the problem from the contribution
                    /// Get the data of the problem
                    const [ data ] = await sqlExec("SELECT * FROM Contribution WHERE id = ?", [id]);

                    /// Get the date of the last problem
                    const [{ date_end: date, id: lastId }] = await sqlExec("SELECT date_end, id FROM Problems ORDER BY date_end DESC LIMIT 1");
                    const dateEnd = new Date(date)
                    dateEnd.setDate(date.getDate() + 7);


                    // Add contributions point to the user
                    await conn.execute(
                        `UPDATE Users
                        SET coop_point = coop_point + 2500
                        WHERE id = ?`,
                        [data.owner_id]
                    )

                    // Add the problem
                    await conn.execute(
                        `INSERT INTO Problems (title, descript, example, more_info, date_enable, date_end, show_case, lotw)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            data.title,
                            data.description,
                            data.example,
                            data.more_info,
                            date,
                            dateEnd
                                .toISOString()
                                .slice(0,19)
                                .replace("T", " "),
                            data.fix_case,
                            lotw
                        ]
                    );


                    // Add the test cases
                    await conn.execute(
                        `SELECT input, expected_output
                        FROM TestCaseContribution
                        WHERE contribution_id = ?`,
                        [id],
                        async (err, rep) => {
                            if (err) {
                                return res.status(500).send("An error occured while getting test cases");
                            }

                            // For each test case, just insert it in the other table
                            rep.forEach(async (testCase, i) => {
                                await conn.execute(
                                    `INSERT INTO VerifySolution (input, expected_output, id_output, problem_id)
                                    VALUES (?, ?, ?, ?);`,
                                    [testCase.input, testCase.expected_output, i, lastId + 1]
                                )
                            });
                        }
                    );


                    // Update the state of the contribution as merged 
                    await conn.execute(
                        `UPDATE Contribution
                        SET state = 1
                        WHERE id = ?`,
                        [id],
                        (err, rep) => {
                            if (err) {
                                return res.status(500).send("An error occured while updating contribution");
                            } else {
                                res.send("OK.");
                            }
                        }
                    )
                }
            }
        }
    )
}


export const amIAuthor = async (req: AuthenticatedRequest, res: Response) => {
    // Get the token and the ID of the contribution in the request
    const token = req.token;
    const { id } = req.query;

    if (id === null || id === undefined) {
        return res.status(400).send("Missing field ID");
    }

    await conn.execute(
        `SELECT Contribution.owner_id AS cid, Users.id AS uid
        FROM Contribution, Users
        WHERE Contribution.id = ?
        AND Users.token = ?`,
        [id, token],
        (err, rep) => {
            if (err) {
                return res.status(500).send("An error occured while executing the request");
            }

            const [{ uid , cid }] = rep;

            res.json({author: uid === cid});
        }
    )
}



export const editContribution = async (req: AuthenticatedRequest, res: Response) => {
    const token = req.token;
    let { id, title, description, example, more_info, random, fix } = req.body;

    // Verify that the request is correct.
    if (id === null || id === undefined) {
        return res.status(400).send("Invalid request, missing the field ID");
    }


    // Verify that the user is the author of the contribution
    const [{ owner_id, request_id }] = await sqlExec(
        `SELECT Contribution.owner_id as owner_id, Users.id AS request_id
        FROM Contribution, Users
        WHERE Contribution.id = ? AND Users.token = ?`,
        [id, token]
    );

    if (owner_id !== request_id) {
        return res.status(401).send("You're not the author of that problem. Therefore, you don't have the right to modify it.");
    }


    // Get the fields to update
    const keys: string[] = ["title", "description", "example", "more_info"];
    const fieldsToUpdate: string[] = [];
    const valueToUpdateWith: string[] = [];

    for (let i = 0; i < keys.length; i++) {
        if (req.body[keys[i]] !== null && req.body[keys[i]] !== undefined && typeof req.body[keys[i]] === "string") {
            fieldsToUpdate.push(keys[i] + " = ?");
            valueToUpdateWith.push(req.body[keys[i]])
        }
    }


    // Update the values in the data base
    if (fieldsToUpdate.length > 0) {
        await conn.execute(
            `UPDATE Contribution
            SET ${fieldsToUpdate.join(',')}
            WHERE id = ?`,
            [...valueToUpdateWith, id]
        )
    }



    // Get the fix and random cases for that contribution
    const [{ fix_case }] = await sqlExec("SELECT fix_case FROM Contribution WHERE id = ? LIMIT 1", [id]);
    let newFixCase: number = fix_case;

    // Update the tests cases
    if (fix !== undefined && fix !== null && verifyValidityTestCaseJSON(fix)) {
        console.log("hey")

        fix = fix as TTestCase[];

        // Update the length of the fixcase
        newFixCase = fix.length;

        // If there isnt the same number of test cases now:
        if (fix_case !== fix.length) {
            await sqlExec(
                `UPDATE TestCaseContribution
                SET id_output = id_output - ${fix.length - fix_case}
                WHERE contribution_id = ?`,
                [id]
            );
        }

        // Delete test cases before
        await fix.forEach(
            async (e, i) => 
                await conn.execute(
                    `DELETE FROM TestCaseContribution WHERE (contribution_id = ? AND id_output = ?) OR id_output < 0;`,
                    [id, i]
            )
        )

        // Add new test cases
        await fix.forEach(
            async (e, i) => 
                await conn.execute(
                    `INSERT INTO TestCaseContribution ( contribution_id, input, expected_output, id_output )
                    VALUES (?, ?, ?, ?);`,
                    [id, e.input, e.output, i],
                    (err, _) => {
                        if (err) {
                            return res.status(500).send("An error occured while creating test cases");
                        }
                    }
                )
        )
    } else if (fix !== undefined && fix !== null && !verifyValidityTestCaseJSON(fix)) {
        return res.status(415).send("JSON for fix test case is invalid. The format should be  [{\"input\": \"...\", \"output\": \"...\"}, ...].\nCheck for mispelling error");
    }


    // Update the random test cases
    if (random !== undefined && random !== null && verifyValidityTestCaseJSON(random)) {
        random = random as TTestCase[];

        // Start by removing old test cases
        await conn.execute(
            `DELETE FROM TestCaseContribution
            WHERE contribution_id = ? AND id_output >= ?`,
            [id, newFixCase],
            async (err, _rep) => {
                if (err) {
                    return res.status(500).send("An error occured while trying to remove old test cases");
                }

                // Insert every test case in the database
                random.forEach(
                    async (e, i) => 
                        await conn.execute(
                            `INSERT INTO TestCaseContribution ( contribution_id, input, expected_output, id_output )
                            VALUES (?, ?, ?, ?);`,
                            [id, e.input, e.output, i + newFixCase],
                            (err, _) => {
                                if (err) {
                                    return res.status(500).send("An error occured while creating test cases");
                                }
                            }
                        )
                )
            }
        )
    } else if (random !== null && random !== undefined && !verifyValidityTestCaseJSON(random)) {
        return res.status(415).send("JSON for random test case is invalid. The format should be  [{\"input\": \"...\", \"output\": \"...\"}, ...].\nCheck for mispelling error");
    }


    res.send("OK.");
}
