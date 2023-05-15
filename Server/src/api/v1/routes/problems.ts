import { Request, Response } from "express";
import conn from "../../../config/initDB"
import { AuthenticatedRequest } from "../middleware/verifyToken";
import sqlExec from "../utils/sqlExec";



/**
 * Retrieves the problem with the specified ID, along with its associated input and expected output for verification.
 *
 * @async
 * @param {Request} req - The request object containing the ID of the problem to retrieve.
 * @param {Response} res - The response object to send the problem data to.
 * @returns {Promise<void>} - Resolves once the response has been sent.
 * @throws {400} - Bad request error if the ID is missing or invalid.
 * @throws {404} - Not found error if no problem exists with the specified ID.
 * @throws {500} - Internal server error if an error occurs while retrieving the problem.
 *
 * @remarks
 * - The function first verifies that the request is valid by checking if the ID is present.
 * - The function then queries the database to retrieve the problem with the specified ID.
 * - If no problem exists with the specified ID, the function returns a 404 error.
 * - If an error occurs while retrieving the problem, the function returns a 500 error.
 * - Otherwise, the function returns the problem, along with its associated input and expected output for verification.
 */
export const getProblem = async (req: Request, res: Response): Promise<void> => {

    if (req.query.id === undefined || req.query.null === null) {
        res.status(400).send("Invalid request. No ID found.");
    }

    await conn.execute(
        `SELECT Problems.*, VerifySolution.input, VerifySolution.expected_output
        FROM Problems, VerifySolution
        WHERE Problems.id = ?
        AND Problems.date_enable < NOW()
        AND Problems.id = VerifySolution.problem_id
        AND VerifySolution.id_output = 0`,
        [req.query.id],
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured.");
            } else if (rep.length === 0) {
                res.status(404).send("No problem with that ID.");
            } else {
                res.json(rep[0]);
            }
        }
    );
}


/**
 * Retrieves the list of problems available on the platform.
 * If the request includes the query parameter 'profile=true', retrieves only the IDs and titles of the problems.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws {500 Error} If an internal error occurs during the database query.
 * @throws {400 Error} If the request does not include a valid ID for the problem.
 * @throws {404 Error} If no problem is found with the specified ID.
 * 
 * @remarks
 * - If the 'profile' query parameter is present and set to 'true', the function retrieves only the IDs and titles of the problems.
 * - Otherwise, the function retrieves the IDs, titles, levels of the week, sum of votes and number of voters of all available problems.
 * - If an ID is provided in the request, the function retrieves the details of the problem with the specified ID, including its description and the input/output pairs to be verified.
 * - The function only retrieves problems that have been enabled, i.e. whose enable date is less than the current time.
 * - The function sends a 400 error if the request does not include a valid ID for the problem.
 * - The function sends a 404 error if no problem is found with the specified ID.
 */
export const getProblems = async (req: Request, res: Response): Promise<void> => {

    // If it's for the profile
    const profile: string | undefined = req.query.profile as string;

    const boolProfile: boolean = profile === 'true';

    // If it's only the profile
    if (boolProfile) {
        await conn.execute("SELECT title, id FROM Problems WHERE date_enable < NOW()", (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured.");
            } else {
                res.json(rep);
            }
        })
    } else {
        await conn.execute("SELECT title, id, lotw, sum_votes, voters FROM Problems WHERE date_enable < NOW()", (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured.");
            } else {
                res.json(rep);
            }
        })
    }
}



/**
 * Retrieves the ID and end date of the last problem that has ended.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns Promise that resolves once the response has been sent.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 404 error if there is no problem that has ended yet.
 * 
 * @remarks
 * - The function queries the database to retrieve the ID and end date of the last problem that has ended.
 * - If no problem has ended yet, the function sends a 404 error indicating that there is no problem.
 * - Otherwise, the function sends a JSON response containing the ID and end date of the last problem.
 */
export const getLastProblem = async (req: Request, res: Response) => {
    await conn.execute(
        `SELECT id, date_end
        FROM Problems
        WHERE date_enable < NOW()
        ORDER BY id DESC
        LIMIT 1`,
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured.");
            } else if (rep.length === 0) {
                res.status(404).send("No problem.");
            } else {
                res.json(rep[0]);
            }
        }
    )
}



/**
 * Retrieves the public note and vote information for a problem with the given ID.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if no ID is found in the request.
 * @throws 404 error if no problem with the given ID is found.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function verifies that the request contains an ID parameter.
 * - The function queries the database to retrieve the sum of votes and the list of voters for the problem with the given ID, if the problem is public and enabled.
 * - If no problem is found with the given ID, the function sends a 404 error.
 * - Otherwise, the function sends a JSON response containing the sum of votes and the list of voters.
 */
export const getPublicNoteProblem = async (req: Request, res: Response) => {
    // Verify that the request is correct
    if (req.query.id === undefined || req.query.id === null) {
        res.status(400).send("No ID found");
    }

    // Execute the request
    await conn.execute(
        `SELECT sum_votes, voters
        FROM Problems
        WHERE id = ? AND
        date_enable < NOW()
        LIMIT 1`,
        [req.query.id],
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured while trying to get the problem");
            } else if (rep.length === 0) {
                res.status(404).send("No problem with that ID.");
            } else {
                res.json(rep[0]);
            }
        }
    )
}



/**
 * Retrieves the personal note of a problem for the authenticated user.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request containing the problem ID.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the problem ID is not provided.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function queries the database to retrieve the personal note of a problem for the authenticated user.
 * - If the query fails or the result is undefined, the function sends a 500 error indicating an internal error occurred during the query.
 * - If the query returns an empty result, the function sends a JSON response with a note value of -1.
 * - If the query returns a valid result, the function sends a JSON response containing the personal note.
 */
export const getPersonalNote = async (req: AuthenticatedRequest, res: Response) => {

    // Verify that the request is correct
    if (req.query.id === undefined || req.query.id === null) {
        res.status(400).send("No ID found");
    }

    // Execute the request
    await conn.execute(
        `SELECT note
        FROM NoteProblem
        WHERE owner_id = (SELECT id FROM Users WHERE token = ?) AND
        problem_id = ?
        LIMIT 1`,
        [req.token, req.query.id],
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured while trying to get the problem");
            } else if (rep.length === 0) {
                res.json({note: -1});
            } else {
                res.json(rep[0]);
            }
        }
    )
}









/**
 * Updates the note of a given problem for the authenticated user.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns {Promise<void | Response>} Promise that resolves once the response has been sent.
 * @throws 400 error if the note is invalid or the user tries to remove a non-existing note.
 * @throws 400 error if the problem with the given ID does not exist.
 * @throws 500 error if an internal error occurs during the database query.
 *
 * @remarks
 * - The function receives an authenticated request with a note and a problem ID.
 * - The note can be a number between 1 and 10, or -1 to remove the user's previous note.
 * - The function checks the validity of the note and verifies that the problem exists.
 * - If the note is valid and the problem exists, the function gets the ID of the authenticated user and checks if the user has already noted this problem.
 * - If the user already noted this problem, the function deletes the previous note and updates the precalculated note from the Problems table.
 * - If the user wants to add a note, the function inserts it into the NoteProblem table and updates the precalculated note from the Problems table.
 * - The function sends an "OK" response once the operation is completed successfully.
 */
export const noteProblem = async (req: AuthenticatedRequest, res: Response): Promise<void | Response> => {
    // Declare the note and the problemId as int
    const { note, id: problemId} = req.body as {[key: string]: number};
    const token: string = req.token;

    console.log(note )

    // If the note is invalid
    // Note === -1: Remove the note
    // Note in 1..10: The note
    if (!note || (note !== - 1 && note > 10) || note < -1) {
        return res.status(400).send("Invalid note");
    }

    // Get the ID of the user by it's token
    // It will be used twice, so it's not a loss of performance
    const [{id: userId}] = await sqlExec(
        "SELECT id FROM Users WHERE token = ? LIMIT 1",
        [token]
    )

    // Verify that the problem exists
    const [{exist}] = await sqlExec(
        `SELECT EXISTS(SELECT * FROM Problems WHERE date_enable < NOW() AND id = ?) AS exist`,
        [problemId]
    )

    // IF the problem doesn't exists
    if (exist === 0) {
        return res.status(400).send("No problem with that ID");
    }


    // See if the user already noted this problem, and if so, get the previous note
    const rep = await sqlExec(
        `SELECT note FROM NoteProblem WHERE problem_id = ? AND owner_id = ? LIMIT 1`,
        [problemId, userId]
    );

    console.log(rep);


    // If it doesnt exist and the user wanted to remove the note
    if (rep.length === 0 && note === -1) {
        return res.status(400).send("You can't remove your vote if you haven't vote");
    }
    // Else if, it exists, delete the note
    else if (rep.length === 1) {
        // Delete from the notes
        await sqlExec(
            `DELETE FROM NoteProblem
            WHERE problem_id = ? AND owner_id = ?`,
            [problemId, userId]
        );

        // Update the note precalculated from the table
        await sqlExec(
            `UPDATE Problems
            SET sum_votes = sum_votes - ?, voters = voters - 1
            WHERE id = ?`,
            [rep[0].note, problemId]
        );
    }

    // If the user wants to add a note
    if (note > 0) {
        // Insert it as a note
        await sqlExec(
            `INSERT INTO NoteProblem (note, problem_id, owner_id)
            VALUES                   (?   , ?         , ?       )`,
                                     [note, problemId , userId  ]
        );

        // Update the Problems table
        await sqlExec(
            `UPDATE Problems
            SET sum_votes = sum_votes + ?, voters = voters + 1
            WHERE id = ?`,
            [note, problemId]
        );

        console.log(await sqlExec(
            "SELECT sum_votes, voters FROM Problems WHERE id = ?"
            , [problemId]
        ))
    }


    res.send("OK.")
}





export const updateScore = async () => {
    
    interface GolfRow {
      owner_id: number;
      size: number;
    }
    
    const sql = "SELECT id, lotw FROM Problems WHERE update_state = 0 AND NOW() >= date_end;";
    const result = await sqlExec(sql);
    
    if (result.length > 0) {
        const row = result[0];
        const problem_id = row["id"];
        let lotw: string | undefined = row["lotw"]?.toLowerCase();
        await sqlExec(`UPDATE Problems SET update_state = 1 WHERE id = ${problem_id}`);
    
        if (problem_id) {
            // Get all the languages
            const languages: string[] = (await sqlExec("SELECT lang FROM CurrentLang")).map(l => l.lang);
        
        
            const correspondance: { [key: string]: string } = {
                "c++": "cpp",
                "c#": "cs",
                "csharp": "cs",
                "javascript": "js"
            };
        
            // Update the lotw
            if (lotw !== undefined)
                lotw = correspondance[lotw] ? correspondance[lotw] : lotw;
                
        
            // For each languages
            for (let i = 0; i < languages.length; i++) {
                let the_lang = correspondance[languages[i]] ? correspondance[languages[i]] : languages[i];
                if (the_lang === 'js') {
                    the_lang = 'node';
                }
        
                const result = await sqlExec(
                    `SELECT *
                    FROM Solutions
                    WHERE problem_id = ?
                    AND lang = ?
                    ORDER BY size ASC;`,
                    [problem_id, the_lang.toLowerCase()]
                );

                const size_lang = result.length;
                const user_already_seen: number[] = [];
                const size_arr: number[] = [];
                const user_arr: number[] = [];
        
                if (size_lang > 0) {
                    result.forEach((row: any) => {
                        if (!user_already_seen.includes(row.owner_id)) {
                            size_arr.push(row.size);
                            user_arr.push(row.owner_id);
                            user_already_seen.push(row.owner_id);
                        }
                    });
                }
        
                for (let j = 0; j < size_arr.length; j++) {
                    // rank: The rank of the person
                    // same_rank_nb: The nb of person with the same rank (useful when rank == 1)
                    // total: the total of people that tried
                    // multiplier: the multiplier coefficient (useful when rank == 1)
                    const rank = (size_arr.indexOf(size_arr[j]) + 1);
                    const same_rank_nb = size_arr.filter((size) => size === size_arr[j]).length;
                    const total: number = size_arr.length;
                    let multiplier: number = 1;
            
                    if (rank === 1) {
                        multiplier = Math.min(Math.max((Math.exp((total / same_rank_nb) / 70) / 6 + 0.8), 1), 1.25);
                    }
                    // same_rank < 1% => mutltiplier: 1.25
                    // same_rank > 10% => mutltiplier: 1

                    let score: number = Math.round(( 1 + Math.log10(total) / 6 ) * ( total - rank + 1 ) / ( total ) * 1000 * multiplier);

                    // If the lang is the LOTW
                    if (lotw != null && lotw == the_lang){
                        score = Math.round(score * 2.25);
                    }


                    // Update the golf score of the user
                    await sqlExec(`UPDATE Users SET golf_score = golf_score + ${score} WHERE id = ` + user_arr[j])
                    // Update the golf score of the user
                    await sqlExec(`UPDATE UserLanguages SET ${the_lang}_score = ${the_lang}_score + ${score} WHERE owner_id = ${user_arr[j]}`);
                    // Update the golf score of the user
                    await sqlExec(
                        `INSERT INTO Activity (title, owner_id, lang, points, activity_date, major)
                        VALUES("Points were awarded!", ?, ?, ?, NOW(), 1)`,
                        [user_arr[j], the_lang, score]
                    );
                }
            }
        }
    }
}


updateScore();


/**
 * Retrieves the rank and number of players for all solutions and updates their ranks.
 *
 * @returns Promise that resolves once the update is complete.
 * @throws error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function updates the rank, nb_players, and size fields of all solutions in the Solutions table.
 * - The rank of a solution is determined by the number of solutions with the same language and problem ID and smaller size submitted before the problem deadline, plus one.
 * - The nb_players field of a solution is set to the number of unique owners who submitted a solution with the same language and problem before the deadline.
 * - The size of a solution is set to the smallest size found for the same owner, language, and problem ID.
 * - Only solutions with rank 0 and submitted before the problem deadline are updated.
 */
// Update the rank of all users 
export const updateRank = async () => {
    await conn.execute(`UPDATE Solutions s
    -- Update the Solutions table and give it an alias of 's'
    
    JOIN (
        -- Select the owner_id, lang, problem_id, and smallest size for each group of solutions with rank 0
        SELECT owner_id, lang, problem_id, MIN(size) AS min_size
        FROM Solutions
        -- Filter solutions with rank 0 and submitted before the problem deadline
        WHERE rank = 0 AND FROM_UNIXTIME(date_submit) <= (SELECT date_end FROM Problems WHERE id = Solutions.problem_id)
        GROUP BY owner_id, lang, problem_id
    ) AS best
    -- Give the subquery an alias of 'best' and join it with the Solutions table on matching owner_id, lang, and problem_id
    ON s.owner_id = best.owner_id AND s.lang = best.lang AND s.problem_id = best.problem_id 
    
    SET s.rank = (
        -- Set the rank of the solution to the number of solutions with a smaller size plus one
        SELECT COUNT(DISTINCT owner_id) 
        FROM Solutions 
        -- Count solutions with the same language and problem ID and smaller size submitted before the problem deadline
        WHERE lang = s.lang AND problem_id = s.problem_id AND size < best.min_size AND FROM_UNIXTIME(s.date_submit) <= (SELECT date_end FROM Problems WHERE id = s.problem_id)
    ) + 1, 
    s.nb_players = (
        -- Set the nb_players of the solution to the number of unique owners who submitted a solution with the same lang and problem before the deadline
        SELECT COUNT(DISTINCT owner_id) 
        FROM Solutions 
        WHERE lang = s.lang AND problem_id = s.problem_id AND FROM_UNIXTIME(s.date_submit) <= (SELECT date_end FROM Problems WHERE id = s.problem_id)
    ),
    s.size = best.min_size 
    -- Set the size of the solution to the smallest size found in the subquery
    
    WHERE s.rank = 0 
    -- Only update solutions with rank 0
    AND FROM_UNIXTIME(s.date_submit) <= (SELECT date_end FROM Problems WHERE id = s.problem_id)
    -- Make sure the solution was submitted before the problem deadline
    AND s.size = (
        -- Only update solutions that have the same size as the smallest size for the same owner, language, and problem ID
        SELECT size 
        FROM Solutions AS s_best 
        WHERE s_best.problem_id = s.problem_id AND s_best.lang = s.lang AND s.owner_id = s_best.owner_id 
        ORDER BY size ASC 
        LIMIT 1
    );`,
        (err, rep) => {
            console.log(err);
        }
    );    
}
