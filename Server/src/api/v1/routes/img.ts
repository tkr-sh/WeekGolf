import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import multer, { File } from 'multer';
import axios from "axios";
import * as dotenv from 'dotenv';
import FormData from 'form-data';
import fs from "fs";
import sqlExec from "../utils/sqlExec";

// Load environment variables from .env file
dotenv.config();


/**
 * Uploads an image file to Imgur and inserts the image link into the database for the authenticated user.
 * 
 * @param {AuthenticatedRequest} req - The authenticated request containing the image file and metadata.
 * @param {Response} res - The response to be sent.
 * @returns Promise that resolves once the response has been sent.
 * @throws 400 error if the request is invalid.
 * @throws 500 error if an internal error occurs during the image upload or database insertion.
 * 
 * @remarks
 * - The function checks if the request is valid by checking if the type of request is "banner" or "pfp".
 * - If the request is invalid, the function sends a 400 error response indicating that the request is invalid.
 * - If the request is valid, the function reads the image file from the request, creates a FormData object containing the image, and sends it to the Imgur API to upload the image.
 * - If the image upload is successful, the function retrieves the image link from the response and inserts it into the database for the authenticated user.
 * - The function then sends a response containing the image link.
 */
export const uplaodImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    // Get the type of the data
    const type: string | null | undefined = req.body.type;

    

    // If the request is invalid
    if (type === null || type === undefined || !["banner", "pfp"].includes(type)) {
        res.status(400).send("Invalid type of request");
        return;
    }
    

    try {
        if ('file' in req && req.file) {
            // Retrieve the image file
            const imageFile: File = req.file;
            // Get the image from the link
            const imageFromPath = fs.readFileSync(imageFile.path);


            // Initiate the form data
            const data = new FormData();
            data.append('image', imageFromPath, imageFile.originalname);

        
            // Send the image to imgur and get back the image ID
            const response = await axios.post('https://api.imgur.com/3/image', data, {
                headers: {
                    Authorization: `Client-ID 43979c180f2b9f7`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        
            // If there is an error
            if (response.data.status !== 200) {
                res.send(response.data.data.status).send("An error occured");
            } else {
                // Define the image link
                const imageLink: string | null | undefined = response.data.data.link;

                // If the image is somehow invalid
                if (imageLink === undefined || imageLink === null) {
                    res.status(500).send("An error occured");
                    return;
                }

                // Insert it in the DB
                await sqlExec(
                    `UPDATE Users
                    SET ${type === 'pfp' ? 'pfp' : 'banner'} = ?
                    WHERE token = ?`,
                    [imageLink, req.token]
                )

                // Send the image ID back to the client
                res.send(imageLink);
            }
        } else {
            console.log(req)
            res.status(400).send('Invalid request. No image.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading image');
    }
}
