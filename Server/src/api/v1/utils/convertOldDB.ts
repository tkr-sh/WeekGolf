//import conn from "../../../config/initDB";

//const convertActivity = async () => {
//    conn.execute("SELECT * FROM CurrentLang", async (err, rep) => {
//        if (err || rep.length === 0) {
//            console.error("No languages found");
//            return;
//        }

//        const languagesList = rep.map((l) => l.lang.toLowerCase());
//        console.log(languagesList);

//        conn.execute("SELECT * FROM Activity", async (err, rep) => {
//            const newData = rep.map(async (obj) => {
//                // console.log("1")
//                let lang: string | null;
//                let problem: string | null;

//                if (obj.content === null) {
//                    return obj;
//                }

//                // LANG DETERMINATION
//                ///////////////////////////
//                // If it's a new best score
//                if (obj.major === 2 && obj.title[0] === "[") {
//                    lang = /\[(.*?)\]/.exec(obj.title)[1];
//                }

//                // If it's 'just' a golf
//                else if (
//                    languagesList.includes(obj.title.split(" ").at(-1).slice(0, -1).toLowerCase())
//                ) {
//                    lang = obj.title.split(" ").at(-1).slice(0, -1).toLowerCase();
//                }

//                // Else, there is language
//                else {
//                    lang = null;
//                }

//                // PROBLEM DETERMINATION
//                ///////////////////////////
//                // If there is a lang and that there is at least 2 quotes
//                if (lang !== null && obj.content?.split("\"")?.length >= 3) {
//                    problem = /\"(.*?)\"/.exec(obj.content)[1]; // Take everything between quotes <=> problem name
//                    obj.problem = problem;
//                    conn.execute(
//                        'SELECT id FROM Problems WHERE title = "' + problem + "\"",
//                        (err2, rep2) => {
//                            if (rep2 !== undefined) {
//                                obj.problem_id = rep2[0]?.id;
//                            } else {
//                                console.error(err2);
//                            }
//                        },
//                    );
//                }

//                // If the lang isn't null, try to guess the current size, the current byte,
//                if (lang !== null) {
//                    obj.lang = lang;

//                    // If it's the new best
//                    if (obj.major === 2) {
//                        obj.title = "New record!";
//                        const content = obj.content
//                            .toLowerCase()
//                            .replace(/[^\d\w\s]/g, "");
//                            .split(" ");

//                        const firstByteIndex: number | null = content.indexOf("bytes");
//                        let secondByteIndex: number | null = content
//                            .slice(0, -3)
//                            .lastIndexOf("bytes");
//                        let newBytes: number | null;
//                        let oldBytes: number | null;
//                        let oldUser: number | null;
//                        let diff: number | null;

//                        if (firstByteIndex !== null && firstByteIndex !== -1) {
//                            newBytes = parseInt(content[firstByteIndex - 1]);
//                        }

//                        if (secondByteIndex !== null && secondByteIndex !== -1) {
//                            // Get the bytes of the old best answer
//                            try {
//                                oldBytes = parseInt(content[secondByteIndex - 1]);
//                            } catch {
//                                oldBytes = -1;
//                            }

//                            // Get the user who did it
//                            try {
//                                oldUser = content[secondByteIndex + 2];
//                                conn.execute(
//                                    "SELECT id FROM Users WHERE username = '" + oldUser + "'",
//                                    (err2, rep2) => {
//                                        if (rep2 !== undefined) {
//                                            obj.oldUserId = rep2[0]?.id;
//                                        } else {
//                                            console.error(err2);
//                                        }
//                                    },
//                                );
//                            } catch {
//                                oldUser = null;
//                            }
//                        }

//                        // Get the difference between the new one and the old one
//                        if (oldBytes > 0) {
//                            diff = oldBytes - newBytes;
//                        }

//                        obj.bytes = newBytes;
//                        obj.oldBytes = oldBytes;
//                        obj.oldUser = oldUser;

//                        delete obj.content;
//                    }

//                    // If it's awarding of points
//                    if (obj.major === 1) {
//                        obj.title = "Points were awarded!";

//                        let receivedIndex: number | null = obj.content
//                            .toLowerCase()
//                            .split(" ")
//                            .indexOf("received");
//                        let points: number | null;

//                        if (receivedIndex !== null && receivedIndex !== -1) {
//                            try {
//                                points = parseInt(
//                                    obj.content.toLowerCase().split(" ")[receivedIndex + 1],
//                                );
//                            } catch {
//                                points = null;
//                            }
//                            obj.points = points;
//                        }

//                        delete obj.content;
//                    }

//                    // If it's something else
//                    if (obj.major === 0) {
//                        // If we know that this is a new score
//                        if (obj.title.includes("made a new score")) {
//                            obj.title = "New personnal score!"; // Change the title

//                            let byteIndex: number | null = obj.content
//                                .toLowerCase()
//                                .replace(/[^\d\w\s]/g, "")
//                                .split(" ")
//                                .indexOf("bytes");
//                            let newBytes: number | null;

//                            if (byteIndex !== null && byteIndex !== -1) {
//                                newBytes = parseInt(
//                                    obj.content
//                                        .toLowerCase()
//                                        .replace(/[^\d\w\s]/g, "")
//                                        .split(" ")[byteIndex - 1],
//                                );
//                                obj.bytes = newBytes;
//                            }

//                            delete obj.content;
//                        }

//                        // Else, we don't change the title.
//                    }
//                }

//                try {
//                    obj.activity_date = new Date(obj.activity_date)
//                        .toISOString()
//                        .slice(0, 19)
//                        .replace("T", " ");
//                } catch {
//                    obj.activity_date = 0;
//                }

//                return obj;
//            });

//            // console.log(newData.slice(1500));

//            Promise.all(newData.map((p) => p.then((result) => result)))
//                .then(async (myArray) => {
//                    for (let i = 0; i < 401; i++) {
//                        let s = `INSERT IGNORE INTO NewActivity
//                            (id, title, content, bytes, old_bytes, old_user_id, lang, problem_id, points, owner_id, activity_date, major)
//                            VALUES`;

//                        s += myArray
//                            .map((obj: any) => {
//                                return `
//                                    (
//                                        ${obj.id},
//                                        ${"\"" + obj.title + "\""},
//                                        ${obj.content === undefined ? "NULL" : `'${obj.content}'`},
//                                        ${obj.bytes ?? "NULL"},
//                                        ${
//                                            obj.oldBytes === null || isNaN(obj.oldBytes)
//                                                ? "NULL"
//                                                : obj.oldBytes
//                                        },
//                                        ${obj.oldUserId ?? "NULL"},
//                                        ${
//                                            obj.lang === null
//                                                ? "NULL"
//                                                : `'${obj.lang?.toLowerCase()}'`
//                                        },
//                                        ${obj.problem_id ?? "NULL"},
//                                        ${obj.points ?? "NULL"},
//                                        ${obj.owner_id ?? "NULL"},
//                                        ${
//                                            obj.activity_date === undefined
//                                                ? "NULL"
//                                                : `'${obj.activity_date}'`
//                                        },
//                                        ${obj.major ?? "NULL"}
//                                    )`;
//                            })
//                            .slice(100 * i, 100 * -~i)
//                            .join(",");

//                        // console.log(s);

//                        conn.execute(s, (err2, rep2) => {
//                            console.error(err2);
//                            console.error(rep2);
//                        });
//                    }
//                    // let s = `INSERT IGNORE INTO NewActivity
//                    // (id, title, content, bytes, old_bytes, old_user_id, lang, problem_id, points, owner_id, activity_date, major)
//                    // VALUES`;

//                    // s += myArray.map(
//                    //     (obj: any) => {
//                    //         return `
//                    //         (
//                    //             ${obj.id},
//                    //             ${'"' + obj.title + '"'},
//                    //             ${obj.content === undefined ? "NULL" : `'${obj.content}'`},
//                    //             ${obj.bytes ?? "NULL"},
//                    //             ${obj.oldBytes === null || isNaN(obj.oldBytes) ? "NULL" : obj.oldBytes},
//                    //             ${obj.oldUserId ?? "NULL"},
//                    //             ${obj.lang === null ? "NULL" : `'${obj.lang}'`},
//                    //             ${obj.problem_id ?? "NULL"},
//                    //             ${obj.points ?? "NULL"},
//                    //             ${obj.owner_id ?? "NULL"},
//                    //             ${obj.activity_date === undefined ? "NULL" : `'${obj.activity_date}'`},
//                    //             ${obj.major ?? "NULL"}
//                    //         )`
//                    //     }
//                    // ).slice(0,100).join(',')

//                    // // console.log(s);

//                    // conn.execute(s, (err2, rep2) => {
//                    //     console.error(err2);
//                    //     console.error(rep2);
//                    // });
//                })
//                .catch((error) => {
//                    console.log("");
//                    console.error(error);
//                });
//        });
//    });
//};

//convertActivity();
