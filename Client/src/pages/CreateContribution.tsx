import { useSearchParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import createAuth from "../hooks/createAuthFetch";
import "../style/CreateContribution.scss";


const CreateContribution = ({ editContribution }) => {

    const { authFetch } = createAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [originData, setOriginData] = createSignal();
    let formRef: (HTMLInputElement | HTMLTextAreaElement)[] | null = null;


    onMount(() => {

        // Get the previous data
        if (editContribution) {
            authFetch(
                "http://localhost:5000/api/v1/contribution?id=" + searchParams.id,
            )
            .then(rep => {
                if (rep.error) {
                    return;
                }

                const form = formRef;

                form[0].value = rep.data.title;
                form[1].value = rep.data.description;
                form[2].value = rep.data.example;
                form[3].value = rep.data.more_info;

                setOriginData(rep.data);
            });
        }
    });

    /*
     * Function that return a promise to read code
     */
    const readFileContent = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            if (file) {
                reader.readAsText(file);
            } else {
                reject(new Error('No file selected.'));
            }
        });
    }

    /**
     * Send request to create a Problem
     */
    const sendCreateProblemRequest = (form: any, fixContent: any, randomContent: any) => {
        // Send the request
        authFetch(
            "http://localhost:5000/api/v1/create-contribution",
            {
                method: 'POST',
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    title: form[0].value,
                    description: form[1].value,
                    example: form[2].value,
                    moreInfo: form[3].value,
                    fix: fixContent,
                    random: randomContent,
                }),
            }
        )
        .then(rep => {
            if (!rep.error) document.location.href = "/contribute-menu"
        });
    }


    /**
     * Send a requset to edit the form
     */
    const sendEditContribution = (diff: any) => {
        authFetch(
            "http://localhost:5000/api/v1/edit-contribution",
            {
                method: 'PUT',
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    ...diff,
                    id: searchParams.id,
                }),
            }
        )
        .then(rep => {
            if (rep.error) {
                return;
            }

            document.location.href = "/contribution?id="+searchParams.id
        });

    }





    const submitForm = (e: Event) => {
        // Prevent redirection
        e.preventDefault();


        // Get the form
        const form = e.target;

        // Get the fix file
        const fixFile = form[4].files[0];


        // Read the content of the fixfile
        readFileContent(fixFile)
        .then(rep => {
            try {
                // Parse the fix test case
                const fixTestCase = JSON.parse("" + rep);

                // If there is the file for random test cases:
                if (form[5]?.files?.length !== undefined && form[5]?.files?.length > 0) {
                    readFileContent(form[5].files[0])
                    .then(rep => {
                        const randomTestCase = JSON.parse("" + rep);

                        // Send request with random test cases
                        sendCreateProblemRequest(form, fixTestCase, randomTestCase);
                    });
                } else {
                    // Send request without random test cases
                    sendCreateProblemRequest(form, fixTestCase, []);
                }

            } catch (err)  {
                console.error("Invalid type of file.");
            }
        })
        .catch(_ => console.error("An error occured while trying to parse the file."));
    }

    const submitFormEdit = (e: Event) => {
        // Prevent default behaviour
        e.preventDefault();

        const form = e.target;


        // Object that keeps the difference 
        let diff = {};

        // Object that has the keys of the section that only have an input/textarea
        const keys: string[] = ["title", "description", "example", "more_info"];


        // For each field, we compare it to its initial value
        for (let idx = 0; idx < 4; idx++) {
            if (formRef[idx].value !== originData()[keys[idx]])
                diff[keys[idx]] = formRef[idx].value;
        }


        // Check for files
        if (form[4]?.files?.length === 0) {
            if (form[5]?.files?.length === 0) {
                sendEditContribution(diff);
            } else {
                readFileContent(form[5].files[0])
                .then(rep => {
                    const randomTestCase = JSON.parse("" + rep);

                    diff['random'] = randomTestCase;

                    sendEditContribution(diff);
                });
            }
        } else {
            readFileContent(form[4].files[0])
            .then(rep => {
                const randomTestCase = JSON.parse("" + rep);

                diff['fix'] = randomTestCase;

                if (form[5]?.files?.length === 0) {
                    sendEditContribution(diff);
                } else {
                    readFileContent(form[5].files[0])
                    .then(rep => {
                        const randomTestCase = JSON.parse("" + rep);

                        diff['random'] = randomTestCase;

                        sendEditContribution(diff);
                    });
                }
            });
        }

        console.log(diff)
    }


    return <div>

        <h1 style={editContribution ? {"margin-bottom": "0px"}: {}}>
            { editContribution ? "Edit" : "Create"} a contribution
        </h1>
        <Show when={editContribution}>
            <p style={{'margin-top': "0px"}}>
                You can leave the input as is, when you don't want to change them.
                If you want to upload new test cases, just select a new file.
                Else, if you don't want to change them, you have nothing to do, they will remain  the same even tho the "No file chosen".
            </p>
        </Show>

        <form
            class="CreateContribution"
            onsubmit={(e) => {editContribution ? submitFormEdit(e) : submitForm(e)}}
            ref={formRef as any}
        >
            {/* Title */}
            <div>
                <label for="title">Title:</label>
                <input name="title" required={!editContribution} placeholder="Fibonacci & Binary..."/>
                <span>The title of the problem</span>
            </div>
            {/* Description */}
            <div>
                <label for="description">Description:</label>
                <textarea name="description" required={!editContribution} placeholder="You will be given a string as Input."/>
                <span>The description of the problem. What is this about ?</span>
            </div>
            {/* Example */}
            <div>
                <label for="example">Example:</label>
                <textarea name="example" required={!editContribution} placeholder="The input is 'a', so the output should be 'b'"/>
                <span>An example for people to understand how it works, what is the look of the input and output? The input and output in you're example should be the first input/output in you're fix test case file.</span>
            </div>
            {/* More info */}
            <div>
                <label for="more-info">More info:</label>
                <textarea name="more-info" required={!editContribution} placeholder="0 < length_string_input < 1024"/>
                <span>More information about the problem, its limits, or additionnal informations.</span>
            </div>
            {/* Fix test cases */}
            <div>
                <label for="fix">Fix test cases:</label>
                <input name="fix" type="file" required={!editContribution} accept=".json"/>
            <span>The number of fix test cases can vary a lot. But for normal WeekGolf problems, the good number of fix test case is between 6 and 12. <br/>File type: <code>.json</code><br/>The format should be: <code>[&lbrace;"input": "...", "output": "..."&rbrace;, ...]</code></span>
            </div>
            {/* Random test cases */}
            <div>
                <label for="random">Random test cases:</label>
                <input name="random" type="file" accept=".json"/>
                <span>The good number of random test case is between 50 and 200. Tho, some problems don't need random test cases. For example, if the only test case that you have is robust, you don't need random test cases.<br/>File type: <code>.json</code></span>
            </div>


            <input type="submit" class="submit"/>
        </form>
    </div>
}


export default CreateContribution;
