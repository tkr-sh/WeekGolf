import { Request, Response } from "express";
import conn from "../../../config/initDB";
import axios from 'axios';
import { AuthenticatedRequest } from "../middleware/verifyToken";
import sqlExec from "../utils/sqlExec";
import "../utils/shuffle";
import formatLang from "../data/formatLang.json";
import colorLang from "../data/colorLang.json";
import * as dotenv from 'dotenv';
import request from 'request-promise';


// Config the .ENV
dotenv.config();


/**
 * Retrieves the code of a public solution from the database given an ID and sends it as a response.
 * 
 * @param {Request} req - The request object containing the ID of the solution to retrieve.
 * @param {Response} res - The response object that will contain the solution code if found.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if no ID is found in the request query parameters.
 * @throws 404 error if no public solution with the provided ID is found.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function retrieves the ID of the solution to retrieve from the request query parameters.
 * - The function queries the database to retrieve the code of the solution with the provided ID and that is associated with a problem that has ended.
 * - If no ID is found in the request query parameters, the function sends a 400 error indicating an invalid request.
 * - If no public solution with the provided ID is found, the function sends a 404 error indicating that the solution was not found.
 * - If an internal error occurs during the database query, the function sends a 500 error indicating that an error occurred.
 */
export const getSolution = async (req: Request, res: Response): Promise<void> => {

    if (req.query.id === undefined || req.query.id === null) {
        res.status(400).send("Invalid request. No ID found.");
        return;
    }

    await conn.execute(
        "SELECT code FROM Solutions WHERE id = ? AND NOW() > (SELECT date_end FROM Problems WHERE id = Solutions.problem_id)",
        [req.query.id],
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured.");
            } else if (rep.length === 0) {
                res.status(404).send("No public solution with that id.")
            } else {
                res.json(rep[0]);
            }
        }
    );
}


/**
 * Retrieves the list of top 50 solutions for a given problem and language, as well as any upgrades to those solutions.
 * 
 * @param {Request} req - The request containing the language and problem ID in the query parameters.
 * @param {Response} res - The response to be sent containing the solutions.
 * @returns A Promise resolving once the response has been sent.
 * @throws 400 error if either the language or problem ID is missing from the request query parameters.
 * @throws 404 error if the problem ID doesn't exist or isn't over yet.
 * 
 * @remarks
 * - The function first checks if both the language and problem ID are present in the request query parameters, and sends a 400 error if not.
 * - It then checks if the problem with the given ID exists and is over by querying the database. If not, it sends a 404 error indicating that the problem doesn't exist or isn't over.
 * - The function then retrieves the top 50 normal solutions and upgrades for the problem and language by querying the database. 
 * - The normal solutions are sorted by ascending size and date submitted, and the upgrades are sorted by ascending size.
 * - Finally, the function sends a JSON response containing the list of solutions, including their IDs, codes, sizes, names of their owners, and whether they are upgrades.
 */
export const getSolutions = async (req: Request, res: Response): Promise<void | Response> => {

    // Get the lang and the id (of the problem)
    const {lang, id} = req.query as {[key: string]: string};

    // If the request isn't correct
    if (lang === undefined || id === null) {
        return res.status(400).send("Invalid request. No ID or Language found.");
    }

    // Check if the problem is over
    const [{exist}] = await sqlExec(
        "SELECT EXISTS(SELECT * FROM Problems WHERE date_end < NOW() AND id = ?) AS exist",
        [id]
    )

    // If the problem doesn't exists or isn't over
    if (exist === 0) {
        return res.status(404).send("No problem with that ID is over.");
    }


    // Get the top 50 normal solutions
    const top50 = await sqlExec(
        `SELECT 
            id,
            code,
            size,
            0 AS upgrade,
            (SELECT username FROM Users WHERE id = Solutions.owner_id) AS name
        FROM Solutions
        WHERE problem_id = ?
        AND lang = ?
        AND FROM_UNIXTIME(date_submit) < (SELECT date_end FROM Problems WHERE Problems.id = Solutions.problem_id)
        ORDER BY size ASC, date_submit ASC
        LIMIT 50`,
        [id, lang.toLowerCase()]
    );

    // Get the upgrades
    const upgrades = await sqlExec(
        `SELECT 
            id,
            code,
            size,
            1 AS upgrade,
            (SELECT username FROM Users WHERE id = s1.owner_id) AS name
        FROM Solutions s1
        WHERE lang = ?
        AND problem_id = ?
        AND FROM_UNIXTIME(date_submit) > (SELECT date_end FROM Problems WHERE Problems.id = s1.problem_id)
        AND size < (
            SELECT MIN(size) -- Get the minimum size
            FROM Solutions s2
            WHERE s1.lang = s2.lang
            AND s1.problem_id = s2.problem_id
            AND s1.date_submit > s2.date_submit -- Of all the solutions submitted before
        )
        ORDER BY size`,
        [lang.toLowerCase(), id]
    );

    res.json([...upgrades, ...top50])
}



/**
 * Retrieves the best solution for a given problem and language previously submitted by the authenticated user.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request containing the problem ID and language.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the request is invalid (no ID or Lang found).
 * @throws 404 error if no solution for the given problem and language was found.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function retrieves the problem ID and language from the request query.
 * - If either the ID or Lang is undefined, the function sends a 400 error indicating that the request is invalid.
 * - The function then queries the database to retrieve the best solution submitted by the authenticated user for the given problem and language.
 * - If no solution is found, the function sends a 404 error indicating that no solution was found for the given problem and language.
 * - Otherwise, the function sends a JSON response containing the code of the best solution.
 */
export const getPreviousSolution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    const {lang, id} = req.query;
    const token = req.token;

    // Verify that the content of the request is valid
    if (lang === undefined || id === undefined) {
        res.status(400).send("Invalid request. No ID or Lang found.");
    }

    // Get the best solution of the user
    await conn.execute(
        `SELECT code
        FROM Solutions
        WHERE problem_id = ? 
        AND lang = ?
        AND owner_id = (SELECT id FROM Users WHERE token = ?)
        ORDER BY size ASC
        LIMIT 1`,
        [id, lang, token],
        (err, rep) => {
            if (err || rep === undefined) {
                res.status(500).send("An error occured while trying to get the best solution for that problem and lang.");
            } else if (rep.length === 0) {
                res.status(404).send("No solution for that problem and language.")
            } else {
                res.json(rep[0]);
            }
        }
    );
}



 

const calculateNumberOfPoint = ( newBytesNb: number, beforeBytesNb: number, total: number): number => {
    const diff = beforeBytesNb - newBytesNb;



    return total

    // const score =
    //   Math.log(Math.min(diff, 100) + 10) / Math.log(5) * 3600 * Math.log(1 + total / 150);
  
    // return Math.max(score, 0);
}
  


const getSizeSolution = (code: string, lang: string): number => {
    let lengthOfCode: number;
    let SBCS: string | undefined;

    if (!["vyxal", "apl", "jelly", "bqn"].includes(lang)) {
        lengthOfCode = Buffer.from(code.replace(/\r\n/g, "\n")).length;
    } else {
        lengthOfCode = 0;

        switch (lang) {
            case "vyxal":
                SBCS = "λƛ¬∧⟑∨⟇÷×«\n»°•ß†€½∆ø↔¢⌐æʀʁɾɽÞƈ∞¨ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]`^_abcdefghijklmnopqrstuvwxyz{|}~↑↓∴∵›‹∷¤ð→←βτȧḃċḋėḟġḣḭŀṁṅȯṗṙṡṫẇẋẏż√⟨⟩‛₀₁₂₃₄₅₆₇₈¶⁋§ε¡∑¦≈µȦḂĊḊĖḞĠḢİĿṀṄȮṖṘṠṪẆẊẎŻ₌₍⁰¹²∇⌈⌊¯±₴…□↳↲⋏⋎꘍ꜝ℅≤≥≠⁼ƒɖ∪∩⊍£¥⇧⇩ǍǎǏǐǑǒǓǔ⁽‡≬⁺↵⅛¼¾Π„‟";
                break;
            case "apl":
                SBCS = "⌶%'⍺⍵_abcdefghijklmnopqrstuvwxyz¯.⍬0123456789⊢\$∆ABCDEFGHIJKLMNOPQRSTUVWXYZ?⍙ÁÂÃÇÈÊËÌÍÎÏÐÒÓÔÕÙÚÛÝþãìðòõ{}⊣⌷¨ÀÄÅÆ⍨ÉÑÖØÜßàáâäåæçèéêëíîïñ[/⌿\\⍀<≤=≥>≠∨∧-+÷×?∊⍴~↑↓⍳○*⌈⌊∇∘(⊂⊃∩∪⊥⊤|;,⍱⍲⍒⍋⍉⌽⊖⍟⌹!⍕⍎⍫⍪≡≢óôöø\"#&┘┐┌└┼─├┤┴┬│@ùúû^ü`:⍷⋄←→⍝)]⎕⍞⍣\n ⊆⍠⍤⌸⌺⍸⍥⍢√⊇…⌾⍮⍭⍧⍛";
                break;
            case "jelly":
                SBCS = "¡¢£¤¥¦©¬®µ½¿€ÆÇÐÑ×ØŒÞßæçðıȷñ÷øœþ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¶\n°¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ƁƇƊƑƓƘⱮƝƤƬƲȤɓƈɗƒɠɦƙɱɲƥʠɼʂƭʋȥẠḄḌẸḤỊḲḶṂṆỌṚṢṬỤṾẈỴẒȦḂĊḊĖḞĠḢİĿṀṄȮṖṘṠṪẆẊẎŻạḅḍẹḥịḳḷṃṇọṛṣṭ§Äẉỵẓȧḃċḋėḟġḣŀṁṅȯṗṙṡṫẇẋẏż«»‘’“”";
                break;
            case "bqn":
                SBCS = "\n\r\t !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~×÷⋆√⌊⌈¬∧∨≠≤≥≡≢⊣⊢⥊∾≍⋈↑↓↕«»⌽⍉⍋⍒⊏⊑⊐⊒∊⍷⊔˙˜˘¨⌜⁼´˝∘○⊸⟜⌾⊘◶⎉⚇⍟⎊⋄⇐←↩⟨⟩‿·𝕊𝕏𝕎𝔽𝔾𝕤𝕩𝕨𝕗𝕘π∞¯•";
                break;
            default:
                SBCS = undefined;
                break;
        }

        for (const char of [...code]) {
            if (SBCS?.includes(char)) {
                lengthOfCode += 1;
            } else {
                lengthOfCode += 2;
            }
        }
    }


    return lengthOfCode;
}





interface submitSolutionType {
    code: string,
    id: number,
    lang: string,
}

/**
 * Retrieves the list of languages upvoted by the authenticated user during the current phase.
 *
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws {ServerError} 500 error if an internal error occurs during the database query.
 * @throws {ServiceUnavailableError} 503 error if the current phase is not 2 or 3.
 * @throws {ForbiddenError} 403 error if the provided authentication token is invalid.
 *
 * @remarks
 * - The function queries the database to determine the current phase.
 * - If the current phase is not 2 or 3, the function sends a 503 error indicating that the user cannot vote during the current phase.
 * - The function then retrieves the ID of the authenticated user and queries the database to retrieve the languages upvoted by the user during the current phase.
 * - Finally, the function sends a JSON response containing the list of languages upvoted by the user during the current phase.
 */
export const submitSolution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    let { code, lang, id: problemId }: submitSolutionType = req.body;
    const token: string = req.token;

    // Format the lang
    lang.replace("#", "sharp").replace("javascript", "node").replace("golang", "go");



    // Verify that the content is ok.
    if (code === undefined || lang === undefined || problemId === undefined || token === undefined) {
        res.status(400).send("Invalid request.");
        return;
    }

    // Don't double count new lines
    code = code.replace(/(\r\n|\n\r)/g, '\n');


    // If it's the happy new year challenge
    let challengeNewYearValid: boolean = true;
    let missingLetters: string[] = [];
    if (problemId === 26) {
        for (const char of [...'happynewyear2023']) {
            challengeNewYearValid &&= code.includes(char);

            if (!code.includes(char)) {
                missingLetters.push(char);
            }
        }
    }



    // // Get the last challenge id
    // const [{id: lastChallengeId}] = await sqlExec(
    //     "SELECT id, title FROM Problems WHERE UNIX_TIMESTAMP(date_enable) <= UNIX_TIMESTAMP(NOW()) ORDER BY id DESC LIMIT 1");

    await conn.execute(
        "SELECT id as lastChallengeId, title FROM Problems WHERE UNIX_TIMESTAMP(date_enable) <= UNIX_TIMESTAMP(NOW()) ORDER BY id DESC LIMIT 1",
        async (err, rep) => {
            const lastChallengeId = rep[0].lastChallengeId;

            // If the ID is invalid
            if (lastChallengeId < problemId || problemId < 1) {
                res.status(400).send("Invalid problem ID");
                return;
            }



            // Get the number of test cases
            const [caseNb] = await sqlExec(
                "SELECT show_case, random_case, title FROM Problems WHERE id = ? LIMIT 1;",
                [problemId]
            );
            const problemName: string = caseNb["title"]; // Get the problem now => Can be useful after and we don't need to query again
            const showCase: number = caseNb["show_case"];
            const randomCase: number = caseNb["random_case"];

            // Get all the inputs of the problem
            const inputsResult = await sqlExec(
                "SELECT input, expected_output, id_output FROM VerifySolution WHERE problem_id = ?;",
                [problemId]
            );

            // Declare arrays that correspond to expected output and ouput and input
            let inputs: string[] = [];
            let outputs: string[] = [];
            let errors: string[] = [];
            let expectedOutputs: string[] = [];
            let successArray: boolean[] = [];
            let success = true;

            // Add the public test case
            for (let i = 0; i < showCase ; i++) {
                inputs.push(inputsResult[i].input);
                expectedOutputs.push(inputsResult[i].expected_output);
            }

            // Add the random test case
            const randomTests = inputsResult.slice(showCase).shuffle();
            for (let i = 0; i < Math.min(randomCase, randomTests.length); i++) {
                inputs.push(randomTests[i].input);
                expectedOutputs.push(randomTests[i].expected_output);
            }




            // Define the request
            // const requestURL: string = "http://localhost:5800/";
            const requestURL: string = "http://217.69.14.183/";

            // Declare the data
            let data: any;
            
            const options = {
                method: 'POST',
                uri: requestURL,
                body: {
                    lang,
                    code,
                    inputs,
                },
                json: true
            };


            // Send the request
            try {
                data = await request(options);
                console.log(data);
            } catch (error) {
                console.error(error);
                res.status(500).send(`An error occured while executing the code.\n${error}`);
                return;
            }
            // while (data === undefined);




            // For every test case
            for (let i = 0; i < inputs.length; i++) {

                console.log("<=============================+>")
                console.log(data);
                console.log("<=============================+>")

                // Push the new data to ouput
                outputs.push(data.out[i].trim().replace(/\s+\n/g, '\n'));



                // Push the error to error
                if (typeof data.err[i] === 'string' && data.err[i].length > 0) 
                    errors.push(data.err[i]);

                // Push the success
                successArray.push(data.out[i].trim().replace(/\s+\n/g, '\n') === expectedOutputs[i].trim());
                // Add this to the success var
                success &&= data.out[i].trim().replace(/\s+\n/g, '\n') === expectedOutputs[i].trim();
            }

            // If it's the new year challenge and that the user didn't put every letter
            if (problemId === 26 && !challengeNewYearValid) {
                success = false;

                for (let error in errors) {
                    error =`This challenge is a special challenge for the year 2023!
            Your code needs to have all the letters in "happynewyear2023" for it to work!
            Case and duplicate doesn't matters
            ----------------------------------------------------------------------------
            Missing letters: ${missingLetters.join(', ')}`;
                }
            }




            // If the solution is valid
            if (success) {
                // We need to see if it's new best score.

                // Get the name and the username of the user
                const [{id: userId, username: name}] = await sqlExec(
                    "SELECT id, username FROM Users WHERE token = ?",
                    [token]
                );

                // Get the personnal best size of the user 
                // To check if this answer needs to be inserted in the datatbase.
                const personnalBestSizeResult =  await sqlExec(`
                    SELECT size
                    FROM Solutions
                    WHERE problem_id = ? AND lang = ? AND owner_id = ?
                    ORDER BY size ASC
                    LIMIT 1;`,
                    [problemId, lang, userId]
                );

                const sizeCurrentSolution = getSizeSolution(code, lang);


                console.log(sizeCurrentSolution, personnalBestSizeResult, personnalBestSizeResult[0])


                // If it's a new personal score
                if (personnalBestSizeResult.length === 0 ||
                    sizeCurrentSolution < personnalBestSizeResult[0].size) {


                    // Know we want to know, if this solution is a new best solution.
                    // So we need to find the current best score.
                    let bestSize: number = Infinity;
                    const dataSize = await sqlExec(
                        `SELECT size, owner_id
                        FROM Solutions
                        WHERE problem_id = ? AND lang = ?
                        ORDER BY size ASC, date_submit ASC
                        LIMIT 1;`,
                        [problemId, lang]
                    );
                
                    if (dataSize.length > 0) {
                        bestSize = dataSize[0].size;
                    }

                    // After that, we can add the best solution of the user
                    // Add the solution of the user
                    await sqlExec(
                        `INSERT INTO Solutions (problem_id, code, size, lang, owner_id, date_submit)
                        VALUES                 (?         , ?   , ?   , ?   , ?       , UNIX_TIMESTAMP(NOW()));`,
                        [problemId, code, sizeCurrentSolution, lang, userId]
                    );


                    // If it's a new best score
                    if (bestSize > sizeCurrentSolution) {
                        // Get the name of the previous user
                        const previousUserResult =
                        dataSize.length > 0 ?
                            await sqlExec(
                                "SELECT username as name FROM Users WHERE id = ? LIMIT 1",
                                [dataSize[0].owner_id]
                            ) : 
                            null

                        // Check if the challenge is over
                        const challengeIsOver = await sqlExec(
                            `SELECT date_end
                            FROM Problems
                            WHERE id = ?
                            AND date_end > NOW()`,
                            [problemId]
                        );

                        
                        // Store if it's an upgrade or new best score in this variable
                        const upgrade = challengeIsOver.length === 0;

                        // If it's an upgrade
                        if (upgrade) {
                            // We need to get the previous number of bytes
                        }

                        // Push it to the activity
                        await sqlExec(
                            `INSERT INTO Activity (title, lang, bytes, old_bytes, problem_id, owner_id, old_user_id, activity_date, major)
                            VALUES ("New ${ upgrade ? "upgrade" : "record" }!", ?, ?, ?, ?, ?, ?, NOW(), 2);`,
                            [
                                lang,
                                sizeCurrentSolution,
                                bestSize > 1e5 ? 0 : bestSize,
                                problemId,
                                userId,
                                dataSize.length === 0 ? null : dataSize[0].owner_id
                            ]
                        );

                        // The data to send to the webhook
                        const webhookData = {
                            "title": `${name} made a${upgrade ? 'n upgrade' : ' new best score'} with ${formatLang[lang.toLowerCase()]}`,
                            "upgrade": +upgrade,
                            "params": {
                                "lang": formatLang[lang.toLowerCase()],
                                "name": name,
                                "diff": bestSize > 1e5 ? 0 : bestSize - sizeCurrentSolution, // If the bestSize was Infinity
                                "before_name": previousUserResult === null || !previousUserResult.length ? null : previousUserResult[0].name,
                                "new_size": sizeCurrentSolution,
                                "before_size": bestSize,
                                "problem_name": problemName,
                            }
                        }

                        console.log("Webhook ======<")
                        console.log(webhookData);

                        discordSendWebhook(webhookData);


                        // Post to the webhook
                        // await discordSendWebhook(webhookData);
                    }
                    // If it's not a new best, add a basic activity
                    else {
                        await sqlExec(
                            `INSERT INTO Activity (title, lang, bytes, problem_id, owner_id, activity_date)
                            VALUES ("New personnal score!", ?, ?, ?, ?, NOW());`,
                            [lang, sizeCurrentSolution, problemId, userId, ]
                        );
                    }
                }
            }


            // Return the data
            res.json(
                {
                    success,
                    inputs,
                    expectedOutputs,
                    outputs,
                    successArray,
                    errors,
                }
            );
        }
    )
}





/**
 * Sends a Discord webhook with information about a golfing submission.
 * 
 * @param {Object} data - The data containing information about the golfing submission.
 * @param {string} data.title - The title of the golfing submission.
 * @param {Object} data.params - The parameters of the golfing submission.
 * @param {string} data.params.lang - The language of the golfing submission.
 * @param {string} data.params.problem_name - The name of the problem being golfed.
 * @param {number} data.params.before_size - The size of the problem before golfing.
 * @param {number} data.params.new_size - The size of the problem after golfing.
 * @param {number} data.params.diff - The difference in size between the problem before and after golfing.
 * @param {string} data.params.before_name - The name of the previous author of the golfing submission.
 * @param {string} data.params.name - The name of the current author of the golfing submission.
 * @param {boolean} data.upgrade - Whether or not the submission is an upgrade from a previous submission.
 * @returns Promise that resolves once the request has been sent.
 * @throws Error if the request to the webhook fails.
 * 
 * @remarks
 * - The function sends a JSON payload containing information about the golfing submission to a Discord webhook.
 * - The payload includes the username, text-to-speech settings, title, timestamp, color, thumbnail, and fields of the Discord embed.
 * - The function uses Axios to send a POST request to the webhook URL specified in the environment variables.
 * - If the request to the webhook fails, the function throws an error.
 */
const discordSendWebhook = async (data: any) => {

    // The json to send
    const json = {
        // Username
        "username": "WeekGolf",

        // text-to-speech
        "tts": false,
        "embeds": [
            {
                // Title
                "title":  data.title,
    
                // Embed Type, do not change.
                "type": "rich",
    
                // Timestamp, only ISO8601
                "timestamp": new Date().toISOString(),
    
                // Left border color, in HEX
                "color": parseInt(colorLang[data.params.lang.toLowerCase()].slice(1), 16),

                "thumbnail": {
                    "url": `http://localhost:3000/src/assets/imgs/${data.params["lang"].toLowerCase()}.png`
                },

                "fields" : [
                    {
                        "name" : "Problem",
                        "value": data.params["problem_name"],
                        "inline": false
                    },
                    {
                        "name": "Previous size",
                        "value": data.params["before_size"].toString(),
                        "inline": true
                    },
                    {
                        "name": "New size",
                        "value": data.params["new_size"].toString(),
                        "inline": true
                    },
                    {
                        "name": "Difference",
                        "value": data.params["diff"].toString(),
                        "inline": true
                    },
                    {
                        "name": "Previous author",
                        "value": data.params["before_name"] ?? "Nobody",
                        "inline": true
                    },
                    {
                        "name": "New author",
                        "value": data.params["name"],
                        "inline": true
                    },
                    {
                        "name": "Language",
                        "value":formatLang[data.params["lang"].toLowerCase()],
                        "inline": true
                    }
                ]
            }
        ]
    };


    // Send the request
    await axios({
        method: 'post',
        url: data.upgrade ? process.env.WEBHOOK_URL_UP : process.env.WEBHOOK_URL,
        headers: { 'Content-Type': 'application/json' },
        data: json
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(`errowor ${error}`);
        console.error(error);
    });
}






interface statParamsType {
    user: string | null,
    lang: string,
    problem: string,
}
/**
 * Retrieves the list of code stats for a given user, language and problem from the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} Promise that resolves once the response has been sent.
 * @throws 400 error if the request is invalid.
 * @throws 404 error if there is no user with the provided name.
 * @throws 500 error if an error occurs during the database query.
 *
 * @remarks
 * - The function receives a GET request with the following query parameters: user, lang and problem.
 * - If any of the parameters are undefined, the function sends a 400 error indicating that the request is invalid.
 * - The function verifies that the provided problem exists in the database and that its end date has passed.
 * - If there is no problem with that ID or if the problem hasn't ended yet, the function sends a 400 error indicating that the request is invalid.
 * - If the user parameter is 'null' or null, the function retrieves the code stats for the given language and problem for all users.
 * - If the user parameter is not 'null' or null, the function retrieves the code stats for the given user, language and problem.
 * - The function retrieves the code stats from the database, which includes the code, size and username of the solution owner.
 * - The function sends a JSON response containing the code stats retrieved from the database.
 */
export const getCodeStats = async (req: Request, res: Response) => {
    const { user, lang, problem } = req.query as unknown as statParamsType;

    // If the request is invalid
    if (user === undefined || lang === undefined || problem === undefined) {
        return res.status(400).send("Invalid request.");
    }


    // Verifiy that the problem is correct
    const problemQuery = await sqlExec(
        "SELECT id FROM Problems WHERE title = ? AND date_end < NOW()",
        [problem],
    )

    // If there isn't any problem with that ID, or that the problem isn't over
    if (problemQuery.length === 0) {
        res.status(400).send("Invalid request. The problem doesn't exists or isn't over.");
    }

    // If it's global
    if (user === null || user === 'null') {
        res.json(
            await sqlExec(
                `SELECT 
                    code,
                    size,
                    (SELECT username FROM Users WHERE id = s1.owner_id) AS name
                FROM Solutions s1
                WHERE lang = ?
                AND problem_id = ?
                AND size < (
                    SELECT COALESCE(MIN(size), 9999999) -- Get the minimum size
                    FROM Solutions s2
                    WHERE s1.lang = s2.lang
                    AND s1.problem_id = s2.problem_id
                    AND s1.date_submit > s2.date_submit -- Of all the solutions submitted before
                )
                ORDER BY size DESC`,
                [lang, problemQuery[0].id]
            )
        );
    } else {
        // Else get the id of the user to see if it's a valid id
        const rep = await sqlExec("SELECT id FROM Users WHERE username = ? LIMIT 1", [user]);

        // Get the ID of the user
        if (rep === undefined) {
            return res.status(500).send("An error occured while getting the user ID");
        }

        // If there is no user with that name
        if (rep.length === 0) {
            return res.status(404).send("There is no user with that name");
        }

        res.json(
            await sqlExec(
                `SELECT 
                    code,
                    size,
                    (SELECT username FROM Users WHERE id = s1.owner_id) AS name
                FROM Solutions s1
                WHERE lang = ?
                AND owner_id = ?
                AND problem_id = ?
                AND size < (
                    SELECT COALESCE(MIN(size), 9999999) -- Get the minimum size
                    FROM Solutions s2
                    WHERE s1.lang = s2.lang
                    AND s1.owner_id = s2.owner_id
                    AND s1.problem_id = s2.problem_id
                    AND s1.date_submit > s2.date_submit -- Of all the solutions submitted before
                )
                ORDER BY size DESC`,
                [lang, rep[0].id, problemQuery[0].id]
            )
        );
    }
}







/**
 * Retrieves the history of solutions for a given problem and language, submitted by the authenticated user.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {TypeOfResponse} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the request is invalid.
 * @throws 500 error if an internal error occurs during the database query.
 * 
 * @remarks
 * - The function retrieves the problem ID and language from the query parameters of the authenticated request.
 * - The function then verifies that the request is valid by checking if the problem ID and language are defined in the query parameters.
 * - The function executes a SQL query to retrieve the history of solutions submitted by the authenticated user for the given problem and language.
 * - The function then sends a JSON response containing the code and size of the solutions retrieved by the SQL query.
 */
export const getHistory = async (req: AuthenticatedRequest, res: Response) => {
    // Get the data from the query
    const {id: problemId, lang} = req.query;
    const token = req.token;


    // Verify that the request is valid
    if (problemId === undefined ||lang === undefined) {
        return res.status(400).send("Invalid request. Expected id and lang.");
    }

    // Execute the query and send it
    res.json(
        await sqlExec(
            "SELECT code, size FROM Solutions WHERE problem_id = ? AND lang = ? AND owner_id = (SELECT id FROM Users WHERE token = ?)",
            [problemId, lang, token],
        )
    );
}
