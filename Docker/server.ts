import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import languagesJSON from "./languages.json";
const app = express();


const languagesJSONTyped: {[key: string]: {[key: string]: string}} = languagesJSON;


app.use(express.json())
export {};


/**
 * Read securely the content of a file
 * 
 * @param path the path
 * @returns 
 */
const readFileContents = (path: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


/**
 *  Generate a random string
 * 
 * @param n Length of the string
 * @returns A random string
 */
const generateRandomString = (n: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < n; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}


/**
 *  Remove a directory
 * 
 * @param path The path to the directory to delete
 */
const deleteDirectory = (path: string) => {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path);
        
        files.forEach((file) => {
            const curPath = `${path}/${file}`;
        
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        
        fs.rmdirSync(path);
    }
}



const waitForFile = (path: string, callback: Function,) => {
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            setTimeout(() => waitForFile(path, callback), 10);
        } else {
            callback();
        }
    });
}


// Create the app
app.post('/', async (req: Request, res: Response) => {
    // Extract the data
    let { lang, code, inputs } = req.body;

    lang=lang.replace("#","s").replace("c++","cpp");

    if (lang === "cs" || lang === "fs") {
        lang += 'harp';
    }

    console.log(lang, code, inputs);


    // Escaped code
    const randomStr = generateRandomString(10);

    // Create the temp directory
    fs.mkdir('tmp/'+randomStr, (err) =>  {
        if (err) {
            console.error(err);
            res.status(500).send("An error occurred while trying to create the directory");
            throw err;
        }

        // Say that the directory is created
        console.log('Directory created successfully!');

        // Create the program file
        fs.writeFile(
            `tmp/${randomStr}/prog.${languagesJSONTyped[lang.toLowerCase()]?.extension ?? 'js'}`,
            code,
            (err) => err && res.status(500).send("Error while creating the file")
        );


        // Create all the files
        for (let i = 0; i < inputs.length; i++) {
            fs.writeFile(
                `tmp/${randomStr}/input${i}.txt`,
                inputs[i],
                (err) => {
                    if (err) {
                        res.status(500).send("Error while creating the file");
                        throw err;
                    }
                }
            );
        }

    });


    // Wait for the last input file to exists
    waitForFile(`tmp/${randomStr}/input${inputs.length - 1}.txt`, () => {
        exec(`./launchvm.sh ${lang} ${randomStr} ${inputs.length}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                if (error.code === 137) {
                    res.status(500).send("The program took to much memory.");
                    return;
                } else {
                    // Error while executing the program, but their might still be something
                    // res.status(500).send("An error occured while executing the program: " + error.code);
                }
                // console.error(`An error occured: ${error}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`);
                // res.status(500).send("Timeout.");
            }

            let out: string[] = [];
            let err: string[] = [];

            // For each input
            for (let i = 0; i < inputs.length; i++) {
                // Output
                await readFileContents(`tmp/${randomStr}/out${i}.txt`)
                .then(data => {
                    out.push(data as string);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Error while reading the content of the file.");
                    return;
                });

                // Error
                await readFileContents(`tmp/${randomStr}/err${i}.txt`)
                .then(data => {
                    err.push(data as string);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Error while reading the content of the file.")
                    return;
                });
            }


            // Send JSON
            res.status(200).json({out, err});

            // After that, delete the directory.
            console.log(`Deleting tmp/${randomStr}...`)
            deleteDirectory(`tmp/${randomStr}`)
        })
    });
});


// Make the app listen
app.listen(5800, () => {
    console.log('Server listening on port 5800');
});


// Make the program never stops
process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception:', err);
});
