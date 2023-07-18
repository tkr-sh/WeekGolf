import { NextFunction, Request, response, Response } from "express";
import conn from "../../../config/initDB";

/**
 * @brief Verify the validity of the token
 * 
 * @param {string} token
 * The token of the user
 * @returns {Promise<boolean>} isTokenValid
 */
export const tokenValidity =async (token: string): Promise<boolean> => {
    return new Promise((resolve) => {
        conn.execute(
            "SELECT EXISTS (SELECT 1 FROM Users WHERE token  = ?) AS valid",
            [token ?? ""],
            (err, rep) => {
                resolve(!err && rep[0]?.valid === 1);
            }
        );
    });
}


export interface AuthenticatedRequest extends Request {
    token: string;
}


/**

@brief The middleware that verify the validity of a token.
@param {Request} req
@param {Response} res
@param {NextFunction} next
@returns {void}
*/
export const verifyToken = async ( req: AuthenticatedRequest, res: Response, next: NextFunction ): Promise<void> => {

    // If it's an options request
    if (req.method === 'OPTIONS') {
        next();
        return;
    }


    const auth: string | undefined = req.headers.authorization;


    // If there isnt the authorization header
    if (auth === undefined || auth === null) {
        next();
        return;
    }
    
    // Get the token from the headers of the request
    const [typeAuth, token] = (req.headers.authorization as string).split(" ");


    // If the token sent is null
    if (token === "null") {
        next();
        return;
    }
    
    const validity: boolean = await tokenValidity(token);


    // Check the token's validity using the tokenValidity function
    if (!validity) {
        // If the token is not valid, return a 401 error with a message
        res.status(401).json({ err: 'Invalid token' });
        return;
    } else {
        req.token = token;
    }
    
    next();
}
