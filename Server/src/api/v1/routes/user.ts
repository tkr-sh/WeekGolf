import { query, Request, Response } from "express";
import conn from "../../../config/initDB";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import generateRandomString from "../utils/randomString";
import sqlExec from "../utils/sqlExec";
import Password from "node-php-password";
import bcrypt from "bcrypt";
import elasticEmailVar from '@elasticemail/elasticemail-client'; // Import e-mail client
import nodemailer from 'nodemailer';


// Email config
let elasticEmailVar: any;
// E-mail API
import('@elasticemail/elasticemail-client')
.then(e => {console.log(e); elasticEmailVar = e});


/**
 * Is the user and admin ?
 *
 * @async
 * @function
 * @param {AuthenticatedRequest} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @throws {Error} - If an error occurs while retrieving the profile from the database.
 */
export const isAdmin = async (req: AuthenticatedRequest, res: Response) => {
	await conn.execute(
		`SELECT id
		FROM Users
		WHERE token = ?`,
		[req.token],
		(err, rep) => {
			if (err)
				return res.status(500).send("An error occured while trying to get the id of the users");
			res.json({ admin: rep[0].id === 1 });
		}
	)
}


/**
 * Retrieves a user's profile by name or ID from the database.
 *
 * @async
 * @function
 * @param {AuthenticatedRequest} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - The Promise that resolves when the response has been sent.
 * @throws {Error} - If an error occurs while retrieving the profile from the database.
 * @example
 * // GET /api/v1/profile?name=johndoe
 * getProfile(req, res);
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    // Retrieve the 'name' and 'id' query parameters from the request object
    const { name, id } = req.query;
	let data: any = {};
	let nbUsers: null | number;
	let score: null | number;


    // Check if 'name' and 'id' are undefined in the request parameters
    if (name === undefined && id === undefined && req.token === undefined) {
        // If both 'name' and 'id' are undefined, send a 400 (Bad Request) response with an error message
        res.status(400).send("Invalid request. Name and ID are undefined.");
		return;
    }


    // Retrieve the user profile data from the database using the MySQL2 driver
    await conn.execute(
        `SELECT id, username, bio, banner, pfp, golf_score, upgrade_score, coop_score, discord_id, discord, discord_display, country
		FROM Users WHERE username = ? OR id = ? OR token = ? LIMIT 1`,
        [name ?? "", id ?? "", req.token ?? ''],
        async (err, rep) => {

            // Check if the database query returned an undefined or non-array response
            if (rep === undefined || rep === null || !(rep instanceof Array)) {
                // If the response is undefined or non-array, send a 500 (Internal Server Error) response with an error message
                res.status(500).send("An error occurred");
				console.error(err)
				return;
            }

            // Check if the database query returned an empty array
            if (rep.length === 0 ) {
                // If the response array is empty, send a 404 (Not Found) response with an error message
                res.status(404).send("User doesn't exist");
				return;
            }


            try {
				// Check if the 'id' property of the first element in the response array is undefined
				if (rep[0].id === undefined) {
					// If the 'id' property is undefined, send a 404 (Not Found) response with an error message
					res.status(404).send("User doesn't exist");
					return;
				} 

				score = rep[0].golf_score + rep[0].upgrade_score + rep[0].coop_score;
			} catch {
				// If there was an error accessing the 'id' property of the response, send a 500 (Internal Server Error) response with an error message
				res.status(500).send("An error occurred: ID is undefined");
			}

			// If the user doesn't want to display it's discord.
			if (rep[0].discord_display !== 1) {
				delete rep[0].discord_display;
				delete rep[0].discord_id;
				delete rep[0].discord;
			}


			// Update the data
			data = {...rep[0], ...data};
			
			// Get the languages score of the user
			await conn.execute(
				"SELECT * FROM UserLanguages WHERE owner_id = ?",
				[id ?? data.id],
				async (err2, rep2) => {
					// Check if the database query returned an undefined or non-array response
					if (rep2 === undefined || rep2 === null || !(rep2 instanceof Array)) {
						// If the response is undefined or non-array, send a 500 (Internal Server Error) response with an error message
						res.status(500).send("An error occurred");
						return;
					}

					// Check if the database query returned an empty array
					if (rep2.length === 0 ) {
						// If the response array is empty, send a 404 (Not Found) response with an error message
						res.status(404).send("User score not exist");
						return;
					}



					// Get the number of languages
					await conn.execute("SELECT COUNT(*) FROM CurrentLang", (err3, rep3) => {
						// Check if the database query returned an undefined or non-array response
						if (rep3 === undefined || rep3 === null || !(rep3 instanceof Array)) {
							// If the response is undefined or non-array, send a 500 (Internal Server Error) response with an error message
							res.status(500).send("An error occurred with the number of users");
						}

						data = {...data, totLang: rep3[0]["COUNT(*)"]};
					});



					// Get the number of users
					await conn.execute("SELECT COUNT(*) FROM Users;", (err3, rep3) => {
						// Check if the database query returned an undefined or non-array response
						if (rep3 === undefined || rep3 === null || !(rep3 instanceof Array)) {
							// If the response is undefined or non-array, send a 500 (Internal Server Error) response with an error message
							res.status(500).send("An error occurred with the number of users");
						}

						data = {...data, totUsers: rep3[0]["COUNT(*)"]};
					});



					// Get the number of user with a better score => get the rank
					await conn.execute(`SELECT COUNT(*) FROM Users WHERE golf_score + upgrade_score + coop_score > ${score}`, (err3, rep3) => {
						// Check if the database query returned an undefined or non-array response
						if (rep3 === undefined || rep3 === null || !(rep3 instanceof Array)) {
							// If the response is undefined or non-array, send a 500 (Internal Server Error) response with an error message
							res.status(500).send("An error occurred with the number of users");
						}

						data = {...data, rank: rep3[0]["COUNT(*)"]+1} // +1 to get the rank
					});


					// Get the number of user with a the same score => the same rank
					await conn.execute(`SELECT COUNT(*) FROM Users WHERE golf_score + upgrade_score + coop_score = ${score}`, (err3, rep3) => {
						// Check if the database query returned an undefined or non-array response
						if (rep3 === undefined || rep3 === null || !(rep3 instanceof Array)) {
							// If the response is undefined or non-array, send a 500 (Internal Server Error) response with an error message
							res.status(500).send("An error occurred with the number of users");
						}

						data = {...data, sameRank: rep3[0]["COUNT(*)"]-1} // -1 to exclude our self
					});



					// Get only
					const languageScore = Object.fromEntries(
						Object.entries(rep2[0]).filter(([k, v]) => v !== 0 && k !== "owner_id")
					);

					// If there is no data
					if (Object.keys(languageScore).length === 0) {
						res.json(data);	
					}

					// Get the rank in every lang
					Object
					.keys(languageScore)
					.map(
						async (k) => {
							await conn.execute(
								// Get the people with a better score
								`SELECT COUNT(*) FROM UserLanguages WHERE ${k} > ?;`,
								[languageScore[k]],

								// Get the people that compete in this lang
								async (errLang, rank) => {
									await conn.execute(
										`SELECT COUNT(*) FROM UserLanguages WHERE ${k} > 0;`,
										(errLangTot, tot) => {
											data[k.split("_")[0] + "_rank"] = rank[0]["COUNT(*)"] + 1 + "/" + tot[0]["COUNT(*)"];
											data[k.split("_")[0] + "_score"] = languageScore[k];

											if (Object.keys(languageScore).at(-1) === k) {
												res.json(data);
											}
										}
									);
								}	
							);
						}
					)
				}
			);
		}
	);
}



// Type for the filter used in getPerformances
interface typeFilter {
	size: string,
	lang: string,
	problem: number,
	rank: string,
}
/**
 *
 * @brief Retrieves performances from the database based on user ID and optional filters, and returns them as a JSON response.
 * 
 * @async
 * @function
 * 
 * @param {Request} req - The request object containing the user ID and optional filters in query parameters.
 * @param {Response} res - The response object used to send a JSON response with the performances data.
 * @returns {Promise<void>} - A Promise resolving to void.
 * @throws {Error} - If there is an error while querying the database.
 * @throws {Error} - If the request is missing the 'id' query parameter.
 * @throws {Error} - If there is an invalid filter parameter in the request.
 * @throws {Error} - If there is an error while parsing the 'filter' query parameter.
 */
export const getPerformances = async (req: Request, res: Response): Promise<void> => {

    const { id, preview, page, filter } = req.query;

	const previewType: boolean = (preview ?? 'false') === 'true';
	const pageType: number = (parseInt(page as string) ?? 1) - 1;
	let filterType: typeFilter | undefined = undefined;

	if (filter !== undefined) {
		try {
			filterType = JSON.parse(filter as string);
		} catch {
			filterType = undefined;
		}
	}


   // Check if 'id' is undefined in the request parameters
   if (id === undefined) {
		// If both 'id' is undefined, send a 400 (Bad Request) response with an error message
		res.status(400).send("Invalid request. ID is undefined.");
		return;
	}


	// If it's only a preview
	if (previewType === true) {
		await conn.execute(
				"SELECT rank, nb_players, size, lang, problem_id FROM Solutions WHERE owner_id = ? AND rank > 0 ORDER BY rank / nb_players LIMIT 3",
				[id],
				(err, rep) => {
					// If there is an error in the response
					if (rep === undefined || rep === null || !(rep instanceof Array)) {
						res.status(500).send("An error occured while trying to get the preview of the best solutions")
						return;
					}

					// Send the data
					res.json(rep)
				}
			);
	}
	// Else, if we need to have more information and filter
	else {
		// The query and the pararmeters of that query that will be added depending on the filters that there are
		let querySQL = "WHERE owner_id = ? AND rank > 0";
		let arrayParamaters: (string | number)[] = [id as string];

		// If there is a filter
		if (filterType !== undefined) {
			// If there is a size in the filter
			if (filterType?.size !== undefined) {
				// If it's not an empty string
				if (filterType?.size.length === 0) {
					res.status(400).send("Invalid size filter");
					return;
				}

				// Add different instructions depending on the first char
				switch (filterType?.size[0]) {
					case "<":
						querySQL += " AND size < ?";
						break;
					case ">":
						querySQL += " AND size > ?";
						break;
					default:
						querySQL += " AND size = ?";
						break;
				}


				// Only get the digit in the string in score
				const filteredScore: string = [...filterType.size]
					.filter(c => c.charCodeAt(0) >= 48 && c.charCodeAt(0) < 59)
					.join("")

				// If it's an empty string
				if (filteredScore.length === 0) {
					res.status(400).send("Invalid request. The size filter is empty");
					return;
				}


				// Add tthe score to the array of parameters for the query
				arrayParamaters = [
					...arrayParamaters,
					parseInt(filteredScore)
				];
			}

			// If there is a rank in the filter
			if (filterType?.rank !== undefined) {
				// If it's not an empty string
				if (filterType?.rank.length === 0) {
					res.status(400).send("Invalid rank filter");
					return;
				}

				// Add different instructions depending on the first char
				switch (filterType?.rank[0]) {
					case "<":
						querySQL += " AND rank < ?";
						break;
					case ">":
						querySQL += " AND rank > ?";
						break;
					default:
						querySQL += " AND rank = ?";
						break;
				}


				// Only get the digit in the string in score
				const filteredRank: string = [...filterType.rank]
					.filter(c => c.charCodeAt(0) >= 48 && c.charCodeAt(0) < 59)
					.join("")

				// If it's an empty string
				if (filteredRank.length === 0) {
					res.status(400).send("Invalid request. The rank filter is empty");
					return;
				}


				// Add tthe rank to the array of parameters for the query
				arrayParamaters = [
					...arrayParamaters,
					parseInt(filteredRank),
				];
			}

			// If there is a lang in the filter
			if (filterType?.lang !== undefined) {
				// If it's not an empty string
				if (filterType?.lang.length === 0) {
					res.status(400).send("Invalid lang filter");
					return;
				}

				querySQL += " AND lang LIKE CONCAT('%', ?, '%')"
				// Add the lang to the filter parameters
				arrayParamaters = [
					...arrayParamaters,
					filterType.lang,
				];
			}

			// If there is a problem in the filter
			if (filterType?.problem !== undefined) {
				// If it's not an empty string
				if (filterType?.problem > 0) {
					res.status(400).send("Invalid problem filter");
					return;
				}

				querySQL += " AND problem_id = (SELECT id FROM Problem WHERE title = CONCAT('%', ?, '%')"

				// Add the lang to the filter parameters
				arrayParamaters = [
					...arrayParamaters,
					filterType.problem,
				];
			}
		}

		arrayParamaters = [...arrayParamaters, ...arrayParamaters,  15 * pageType, 15 * -~pageType];


		await conn.execute(
			`SELECT  id, rank, nb_players, size, lang, problem_id,
			(
				SELECT CEIL(COUNT(*) / 15) FROM Solutions ${querySQL}
			) AS pages
			FROM Solutions ${querySQL}
			ORDER BY rank / nb_players
			LIMIT ?, ?`,
			arrayParamaters,
			(err, rep) => {
				// If there is an error in the response
				if (rep === undefined || rep === null || !(rep instanceof Array)) {
					res.status(500).send("An error occured while trying to get the preview of the best solutions")
				}

				// Send the data
				res.json(rep)
			}
		);
	}
}



/**
 * Asynchronously retrieves a specific field from the database for a user based on the provided parameter value.
 * 
 * @param {string} field - The name of the field to retrieve from the database.
 * @param {any} param - The value of the parameter used to select the user from the database.
 * @param {string} nameParam - The name of the parameter used to select the user from the database.
 * @param {Response} res - The response object used to send the result or error.
 * 
 * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success or failure of the operation.
 *          If the operation is successful, the function retrieves the specified field value and sends a response with the result.
 *          If the operation fails, the function sends an error response and returns false.
 */
const getFieldTemplate = async (field: string, param: any, nameParam: string, res: Response) => {
	// If param is valid
	if (param !== undefined && param !== null) {
		await conn.execute(
			`SELECT ${field} FROM Users WHERE ${nameParam} = ? LIMIT 1`,
			[param],
			(err, rep) => {
				try {
					if (err || rep === undefined) {
						res.status(500).send("An error occured.");
						return false;
					} else if (rep.length === 0) {
						res.status(404).send(`No user with that ${nameParam}.`);
						return false;
					} else {
						let dic = {};
						dic[field] = rep[0][field];
						res.json(dic);
						return true;
					}
				} catch (err) {
					res.status(500).send("An error occured.");
					return false;
				}
			}
		)
	} else {
		return false
	}
}



/**
 * Retrieves the ID of a user from the database based on the provided token or name parameter.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object containing the token and query parameters.
 * @param {Response} res - The response object used to send the result or error.
 * 
 * @returns {Promise<void>} A Promise that resolves with the retrieved user ID or sends an error response.
 */
export const getId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	const token: string | undefined = req.token;
	const { name } = req.query;



	if (token === undefined && name === undefined) {
		res.status(400).send("Expected a token or a name");
	}

	await getFieldTemplate('id', token, "token", res);
	await getFieldTemplate('id', name, "username", res);
}



/**
 * Retrieves the username of a user from the database based on the provided token or ID parameter.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object containing the token and query parameters.
 * @param {Response} res - The response object used to send the result or error.
 * 
 * @returns {Promise<void>} A Promise that resolves with the retrieved username or sends an error response.
 */
export const getName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	const token: string | undefined = req.token;
	const { id } = req.query;


	if (token === undefined && id === undefined) {
		res.status(400).send("Expected a token or an ID");
	}

	await getFieldTemplate('username', token, "token", res);
	await getFieldTemplate('username', id, "id", res);
}





/**
 * Retrieves comments from the database for the authenticated user with the given ID.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request object.
 * @param {Response} res - The response object to send the result or error.
 * 
 * @returns A Promise that resolves with void when the operation is complete.
 *          The function retrieves the comments and sends a response with the result,
 *          or sends an error response if an error occurs during the operation.
 */
export const getCommentsOfUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	const { id } = req.query;

	await conn.execute(
		`SELECT * FROM Comments WHERE owner_id = ?`,
		[id],
		(err, rep) => {
			try {
				if (err || rep === undefined) {
					res.status(500).send("An error occured.");
				} else if (rep.length === 0) {
					res.status(404).send(`No comment of the user with this ID.`);
				} else {
					res.json(rep);
				}
			} catch (err) {
				res.status(500).send("An error occured.");
			}
		}
	)
}





// Type for the filter used in getActivity
interface typeFilterActivity {
	lang: string,
	problem: string,
	player: string,
	name: string,
}
/**
 *
 * @brief Retrieves performances from the database based on user ID and optional filters, and returns them as a JSON response.
 * 
 * @async
 * @function
 * 
 * @param {Request} req - The request object containing the user ID and optional filters in query parameters.
 * @param {Response} res - The response object used to send a JSON response with the performances data.
 * @returns {Promise<void>} - A Promise resolving to void.
 * @throws {Error} - If there is an error while querying the database.
 * @throws {Error} - If the request is missing the 'id' query parameter.
 * @throws {Error} - If there is an invalid filter parameter in the request.
 * @throws {Error} - If there is an error while parsing the 'filter' query parameter.
 */
export const getActivity = async (req: Request, res: Response): Promise<void> => {

    const { page, filter } = req.query;

	const pageType: number = (parseInt(page as string) ?? 1) - 1;
	let filterType: typeFilterActivity | undefined = undefined;

	// Convert the filter to JSON
	if (filter !== undefined) {
		try {
			filterType = JSON.parse(filter as string);
		} catch {
			filterType = undefined;
		}
	}


	// If the "player" field is undefined but not the name
	if (filterType?.player === undefined && filterType.name !== undefined) {
		filterType.player = filterType.name;
	}


	// The query and the pararmeters of that query that will be added depending on the filters that there are
	let querySQL = "WHERE 1=1";
	let arrayParamaters: (string | number)[] = [];

	// If there is a filter
	if (filterType !== undefined) {
		// If there is a lang in the filter
		if (filterType?.lang !== undefined) {
			// If it's not an empty string
			if (filterType?.lang.length === 0) {
				res.status(400).send("Invalid lang filter");
				return;
			}

			querySQL += " AND lang LIKE CONCAT('%', ?, '%')"
			// Add the lang to the filter parameters
			arrayParamaters = [
				...arrayParamaters,
				filterType.lang,
			];
		}

		// If there is a problem in the filter
		if (filterType?.problem !== undefined) {
			// If it's not an empty string
			if (filterType?.problem.length === 0 ) {
				res.status(400).send("Invalid problem filter");
				return;
			}

			querySQL += " AND problem_id = (SELECT id FROM Problems WHERE title LIKE CONCAT('%', ?, '%'))"
			
			// Add the lang to the filter parameters
			arrayParamaters = [
				...arrayParamaters,
				filterType.problem,
			];
		}

		// if there is a player filter
		if (filterType?.player !== undefined) {
			// If it's not an empty string
			if (filterType?.player.length === 0) {
				res.status(400).send("Invalid lang filter");
				return;
			}

			querySQL += " AND owner_id = ( SELECT id FROM Users WHERE username = ? )"
			// Add the lang to the filter parameters
			arrayParamaters = [
				...arrayParamaters,
				filterType.player,
			];
		}
	}


	arrayParamaters = [...arrayParamaters, ...arrayParamaters,  50 * pageType, 50 * -~pageType];

	
	await conn.execute(
		`SELECT  *,
		(
			SELECT CEIL(COUNT(*) / 50) FROM Activity ${querySQL}
		) AS pages,
		(
			SELECT username FROM Users WHERE id = Activity.owner_id
		) AS username,
		(
			SELECT username FROM Users WHERE id = Activity.old_user_id
		) AS previous_user,
		(
			SELECT title FROM Problems WHERE id = Activity.problem_id AND Activity.problem_id IS NOT NULL
		) AS problem
		FROM Activity ${querySQL}
		ORDER BY id DESC
		LIMIT ?, ?`,
		arrayParamaters,
		(err, rep) => {
			// If there is an error in the response
			if (rep === undefined || rep === null || !(rep instanceof Array)) {
				console.error(err);
				res.status(500).send("An error occured while trying to get the activity")
			}

			// Send the data
			res.json(rep)
		}
	);
}




/**
 *
 * @brief Creates the account of an user
 */
export const createAccount = async ({name, email, pfp, bio, pwd, github_id, stack_id, discord_id, discord, country}: any) => {
	// The token of the user
	const token = generateRandomString(64);
	let alreadyExists;
	let newName: string;


	console.log("token", token);


	if (country === null || country === undefined) {
		country = "XX"
	}

	console.log("country", country)

	let i = -1;
	do {
		newName = name + (i === -1 ? "" : i.toString());
		alreadyExists = await sqlExec("SELECT username FROM Users WHERE username = ? LIMIT 1", [newName]);
		i++;
	} while (alreadyExists.length > 0);

	console.log("new name", newName)



	if (i > 0) {
		name = newName;
	} 

	// Execute the creation of the account
	await conn.execute(
		`
		INSERT INTO Users (token, username, email, pfp, bio, pwd, country, github_id, stack_id, discord_id, discord)
		VALUES            (?    , ?       , ?    , ?  , ?  , ?  , ?      , ?        , ?       , ?         , ?      )`,
						  [token, name    , email, pfp, bio, pwd, country, github_id, stack_id, discord_id, discord].map(v => v === undefined ? null : v),
		async (err, rep) => {
			// If there was an error during the insertion.
			if (err) {
				console.error(err);
				console.error(err);
				return undefined;
			}




			// Else, get the ID of the user that has been created
			const [idRow] = await sqlExec("SELECT id FROM Users WHERE token = ?", [token]);

			if (idRow === undefined) {
				return undefined;
			}

			// Get the user ID
			const userId = idRow.id;

			console.log(userId)

			// Add languages points
			await sqlExec("INSERT INTO UserLanguages (owner_id) VALUES (?)", [userId]);
			
			// Add activity
			await sqlExec(
				`INSERT INTO Activity (owner_id, title, activity_date)
				VALUES (?, CONCAT("Welcome ", ?, "!"), NOW())`,
				[userId, name]
			);



			console.log(`Token: ${token}`)

			return token;
		}
	);
}


/**
 * 
 * @param email
 * @param name 
 * @param pwd 
 */
export const createTempAccount = async (email: string, name: string, pwd: string, country?: string) => {
	let alreadyExists;
	let newName: string;
	const saltRounds: number = 16;

	// Check if the country is valid
	if (country === null || country === undefined) {
		country = "XX"
	}

	// Make sure that 
	let i: number = -1;
	do {
		newName = name + (i === -1 ? "" : i.toString());
		alreadyExists = await sqlExec(
			`SELECT username
			FROM TempUsers
			WHERE username = ?
			UNION
			SELECT username
			FROM Users
			WHERE username = ?`,
			[newName, newName]
		);
		i++;
	} while (alreadyExists.length > 0);

	// If the name wasn't valid.
	if (i > 0) {
		name = newName;
	} 

	// The code to validate the account
	const code: string = generateRandomString(6);

	// Hash the password
	bcrypt.hash(pwd, saltRounds, async (err, hash) => {
		if (err) {
			console.error("ERROR WHILE TRYING TO GENERATE A NEW HASH.");
			return;
		}
	
		// Execute the creation of the account
		await conn.execute(
		   `INSERT INTO TempUsers (email, username, pwd, code, country, created)
			VALUES            	  (?    , ?       , ?  , ?   , ?      , NOW()  )`,
								  [email, name    ,hash, code, country],
			(err, rep) => {
				// If there is an error, just pass.
				if (err) {
					console.error(err);
					return;
				}
				const defaultClient = elasticEmailVar.ApiClient.instance;
				const apikeyEmail = defaultClient.authentications['apikey'];
				apikeyEmail.apiKey = process.env.EMAIL_API_KEY;
				const apiEmail = new elasticEmailVar.EmailsApi();


				// Create the e-mail object
				const emailObject = elasticEmailVar.EmailMessageData.constructFromObject({
					Recipients: [
						new elasticEmailVar.EmailRecipient(email)
					],
					Content: {
						Body: [
							elasticEmailVar.BodyPart.constructFromObject({
								ContentType: "HTML",
								Content: `
								<span style="width: 100%; display: block; text-align: center">
									Your verification code is <b>${code}</b>
								</span>`
							})
						],
						Subject: "Verify your account - " + code,
						From: "no-reply@weekgolf.net"
					}
				});
				
				// Send the mail
				apiEmail.emailsPost(emailObject, (error, data, response) => {
					if (error) {
						console.error(error);
					} else {    
						console.log('API called successfully:' + response);
					}
				});
			}
		);
	});
}





/**
 *
 * @brief Log in a user
 * 
 * @async
 * @function
 * 
 * @param {Request} req - The request object containing the user ID and optional filters in query parameters.
 * @param {Response} res - The response object used to send a JSON response with the performances data.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
export const login = async (req: Request, res: Response): Promise<void> => {

	const { pwd, name } = req.body;

	// If password or name aren't correct.
	if (pwd === undefined || pwd === null || name === undefined || name === null) {
		res.status(400).send("Invalid request.");
	}



	// The result
	const result = await sqlExec(
		"SELECT token, pwd FROM Users WHERE username = ? OR email = ?",
		[name, name]	
	)

	// If there is no user with that username or email
	if (result === undefined || result.length === 0) {
		res.status(404).send("No user with that name or email.");
	}



	// Get the token and the password
	const hashedPassword = result[0].pwd;
	const token = result[0].token;


	// Check if the pwd is a valid PHP pwd
	let validPwd: boolean;

	try {
		validPwd = Password.verify(pwd, hashedPassword)
	} catch {
		console.info("Not a valid password with PHP.")
		validPwd = false;
	}

	

	// Check if the password is correct using the old PHP crypt.
	if (validPwd) {
		// Password valide with PHP
		console.info("Password decoded with PHP crypt.")

		// Return the token to the client.
		res.json({token});

		// If the password is valid, update the password with a new encoding using bcrypt
		const saltRounds = 16;

		// Hash the password
		bcrypt.hash(pwd, saltRounds, async (err, hash) => {
			if (err) {
				console.error("ERROR WHILE TRYING TO GENERATE A NEW HASH.");
				return;
			}
			
			// Store hash in your password DB.
			await conn.execute(
				`UPDATE Users SET pwd = ? WHERE token = ?`,
				[hash, token],
				(err, rep) => {
					if (err) {
						console.error("ERROR while updating the password with a new hash");
					} else {
						console.log("Password updated successfully.");
					}
				}
			);
		});
	} else { // else (new password) decode it with bcrypt.
		console.info("Invalid PHP decode.")

		bcrypt.compare(pwd, hashedPassword, (err, result) => {
			if (err || !result) {
				res.status(401).send("Login invalid.");
			} else {
				console.info("Logged with bcrypt.");
				res.send({token});
			}
		});
	}
}




/**
 *
 * @brief Get the profile picture of a user
 * 
 * @async
 * @function
 * 
 * @param {Request} req - The request object containing the user ID and optional filters in query parameters.
 * @param {Response} res - The response object used to send a JSON response with the performances data.
 * @returns {Promise<void>} - A Promise resolving to void.
 */
export const getPfp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

	const token: string = req.token;

	if (token.length === 0) {
		res.status(400).send("The length of token shouldn't be of 0.");
		return;
	}	

	const result = await sqlExec("SELECT pfp FROM Users WHERE token = ? LIMIT 1", [token]);

	if (result === undefined || result === null || result.length === 0) {
		res.status(404).send("No user with that token");
		return;
	}


	res.json(result[0]);
}






export const verifyCode = async (req: Request, res: Response): Promise<void> => {

	// Get the code and the e-mail
	const { code, email } = req.body;

	if (code === undefined || email === undefined) {
		res.status(400).json({err: "Invalid request", valid: false});
		return;
	}

	// Check if the code is valid
	await conn.execute(
		"SELECT * FROM TempUsers WHERE email = ? AND code = ?",
		[email, code],
		async (err, rep) => {
			if (err || rep === undefined || rep.length === 0) {
				res.status(404).json({err: "Invalid code.", valid: false});
			} else {
				const data = rep[0];

				
				
				// Create the account
				await createAccount({
					name: data.username,
					pwd: data.pwd,
					email: data.email,
					country: data.country,
				})
				.then(token => res.json({valid: true, token: token}))
				.catch(() => res.status(500).send("An error occurred while trying to confirm your account."));
			}
		}
	)
}




/**
 * Creates a new user account with the provided name, email and password.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if name, email or password are invalid.
 * @throws 500 error if an internal error occurs while creating the account.
 * 
 * @remarks
 * - The function extracts the name, email and password from the request body and trims any leading or trailing spaces.
 * - The function validates the name, email and password according to specific criteria.
 * - If any of the validations fail, the function sends a 400 error response with an appropriate message.
 * - If all validations pass, the function creates a temporary account by calling the createTempAccount function with the provided parameters.
 * - If the account creation is successful, the function sends a 200 OK response.
 * - If an error occurs while creating the account, the function sends a 500 error response with an appropriate message.
 */
export const createAccountRequest = async (req: Request, res: Response): Promise<void> => {
	// Get the name, the e-mail and the password from the request
	let { name, email, pwd, } = req.body as {[key: string]: string};

	// Trim the spaces if the user forgot to put one
	name = name.trim();
	email = email.trim();

	// Verify the validity of the name
	if (name.length < 3 || name.length > 24) {
		res.status(400).send("The length of the name should be in [3; 24] chars.");
		return;
	}

	// Verify the validity of the password
	if (pwd.length < 6 || pwd.length > 128) {
		res.status(400).send("The length of the name should be in [6; 128] chars.");
		return;
	}

	// Verify the validity of the email
	if (email.length < 5 || email.length > 256 || !/^[\w\d._%+-]+@[\w\d.-]+\.[\w.]{2,}$/.test(email)) {
		res.status(400).send("The length of the email should be in [5; 256] chars and it should be a valid e-mail.")
		return;
	}

	// If everything is correct create the temporary account;
	try {
		console.log("Creating the account...")

		await createTempAccount(email, name, pwd)
		.then(() => res.status(200).send("OK."))
		.catch(() => res.status(500).send("An error occured while trying to create your account."));
	} catch (e) {
		console.error(e)
		res.status(500).send("An error occured while trying to create the account.");
	}
}



/**
 * Updates the user's information according to the provided data type and value.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the data provided is invalid or out of bounds.
 * @throws 409 error if the provided data already exists.
 * @throws 500 error if an internal error occurs during the database query.
 * @throws 403 error if the provided authentication token is invalid.
 * 
 * @remarks
 * - The function receives the data type and value to be updated through the request query parameter.
 * - If the data type is "country", the function checks if the provided value has a length of 2, then updates the user's country.
 * - If the data type is "bio", the function checks if the provided value has a length of 1024 characters or less, then updates the user's bio description.
 * - If the data type is "email", the function checks if the provided value is a valid email format and not already in use by another account, then updates the user's email.
 * - If the data type is "username", the function checks if the provided value has a length between 3 and 24 characters and not already in use by another account, then updates the user's username.
 * - If the data type is not recognized, the function sends a 400 error indicating an invalid request.
 */
export const updateInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

	// Get the type of data an it's value
	const { type, data } = req.query as {[key: string]: string};
	let exist: number;

	/**
	 * Switch between the data type
	 */
	switch (type) {
		// Country
		case "country":
			if (data.length !== 2) {
				res.status(400).send("The length of flag should be of 2");
				return;
			}

			// Update the country
			await conn.execute(
				"UPDATE Users SET country = ? WHERE token = ? LIMIT 1",
				[data.toLowerCase(), req.token],
				(err, rep) => {
					// If there is an error
					if (err || rep === undefined) {
						res.status(500).send("An error occured while updating your country")
						return;
					}

					res.send("OK.");
				}
			)
			break;

		// Bio description
		case "bio":

			if (data.length > 1024) {
				res.status(400).send("The length of bio shouldn't be above 1024 chars");
				return;
			}

			// Update the country
			await conn.execute(
				"UPDATE Users SET bio = ? WHERE token = ? LIMIT 1",
				[data.toLowerCase(), req.token],
				(err, rep) => {
					// If there is an error
					if (err || rep === undefined) {
						res.status(500).send("An error occured while updating your bio")
						return;
					}

					res.send("OK.");
				}
			)
			break;

		// E-mail address
		case "email":
			// Check if the email is valid
			if (data.length < 5 || data.length > 256 || !/^[\w\d._%+-]+@[\w\d.-]+\.[\w.]{2,}$/.test(data)) {
				res.status(400).send("The e-mail is invalid");
				return;
			}

			// Check if this email already exists
			[{exist}] = await sqlExec(
				`SELECT EXISTS(SELECT * FROM Users WHERE email = ?) AS exist`,
				[data.toLowerCase()]
			)


			// This email is already user by another account
			if (exist === 1) {
				res.status(409).send("An account with this e-mail already exists.");
				return;
			}

			// Update the country
			await conn.execute(
				"UPDATE Users SET email = ? WHERE token = ? LIMIT 1",
				[data.toLowerCase(), req.token],
				(err, rep) => {
					// If there is an error
					if (err || rep === undefined) {
						res.status(500).send("An error occured while updating your e-mail")
						return;
					}

					res.send("OK.");
				}
			)
			break;
		
		
		// Username 
		case "username":
			// Check if the name is valid
			if (data.length < 3 || data.length > 24) {
				res.status(400).send("The length of your name should be in [3; 24]");
				return;
			}

			// Check if this name already exists
			[{exist}] = await sqlExec(
				`SELECT EXISTS(SELECT * FROM Users WHERE username = ?) AS exist`,
				[data.toLowerCase()]
			)


			// This username is already user by another account
			if (exist === 1) {
				res.status(409).send("An account with this username already exists.");
				return;
			}

			// Update the country
			await conn.execute(
				"UPDATE Users SET username = ? WHERE token = ? LIMIT 1",
				[data, req.token],
				(err, rep) => {
					// If there is an error
					if (err || rep === undefined) {
						res.status(500).send("An error occured while updating your e-mail")
						return;
					}

					res.send("OK.");
				}
			)
			break;
	
		// Default
		default:
			res.status(400).send("Invalid request.");
			break;
	}
}







export const getUsers = async (req: Request, res: Response) => {
	res.json(await sqlExec(
		"SELECT username FROM Users ORDER BY golf_score + coop_score + upgrade_score DESC"
	));
}
