// Impors
//// SolidJS
import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router';
import { Component, createEffect, createSignal, For, Index, onCleanup, onMount, Show } from 'solid-js';
//// Components
import MonacoEditor from '../components/IDE';
import TimerNextProblem from '../components/Timer';
import Toggle from '../components/Toggle';
import PickLang from '../components/PickLang';
import LeaderboardUsers from '../components/LeaderboardUsers';
//// Style
import "../style/Problem.scss";
///// Data
import formatLang from '../data/formatLang.json';
import extensionLang from '../data/extensionLang.json';
import launchLang from '../data/launchLang.json';
//// Hooks
import createAuth from '../hooks/createAuthFetch';
//// Icons
import fullscreenIcon from '../assets/icons/fullscreen.svg';
import smallscreenIcon from '../assets/icons/smallscreen.svg';
import historyIcon from '../assets/icons/history.svg';
import reset from '../assets/icons/reset.svg';
import settings from '../assets/icons/settings.svg';
import trash from '../assets/icons/trash.svg';
import bulb from "../assets/icons/bulb.svg";
import send from "../assets/icons/paper_plane.svg";
//// Functions
import capitalize from '../utils/capitalize';
//// Socket
import { io } from "socket.io-client";
import addRank from '../utils/addRankLeaderboard';
import defaultCode from '../utils/defaultCode';
import formatDate from '../utils/formatDate';
import NoteProblem from '../components/NoteProblem';
import History from '../components/History';
import LOTW from '../components/LOTW';



// Socket declaration
const socket = io("http://localhost:5000/auth");


// JSON Typed
const formatLangTyped: {[key: string]: string} = formatLang;
const extensionLangTyped: {[key: string]: string} = extensionLang;
const launchLangTyped: {[key: string]: string} = launchLang;



// Transform a paragraph
const transformParagraph = (str: string | undefined) => {
    return str
    ?.replaceAll(/<[\w\/][^>]*>/g, '')
    ?.split('\n')
    ?.map(
        e => <p>{e}</p>
    );
}

// Interface for the output type 
interface outputType {
    valid: boolean,
    input: string,
    expected: string,
    obtained: string,
    error: string,
}

interface leaderboardType {
    pfp: string,
    name: string,
    bytes: number,
}



const Problem: Component = () => {
    // Hooks
    //// Parameters
    const [searchParams, setSearchParams] = useSearchParams();
    //// Signal
    ////// Settings 
    const [autoBrackets, setAutoBrackets] = createSignal<boolean>(localStorage.getItem('autoBrackets')==='true' ?? true);
    const [autoIndent, setAutoIndent] = createSignal<boolean>(localStorage.getItem('autoIndent')==='true' ?? true);
    const [cursorPosition, setCursorPosition] = createSignal<boolean>(localStorage.getItem('cursorPosition')==='true' ?? false);
    const [wordWrap, setWordWrap] = createSignal<boolean>(localStorage.getItem('wordWrap')==='true' ?? false);
    const [tabulation, setTabulation] = createSignal<boolean>(localStorage.getItem('tabulation')==='true' ?? false);
    const [showInvisible, setShowInvisible] = createSignal<boolean>(localStorage.getItem('showInvisible')==='true', {equals: false});
    const [openSettings, setOpenSettings] = createSignal<boolean>(false, {equals: false});
    const [heightSettings, setHeightSettings] = createSignal<string>("0px");
    const [deleteCode, setDeleteCode] = createSignal<boolean>(true);
    const [backToBest, setBackToBest] = createSignal<boolean>(true);
    ///// Full screen
    const [fullScreen, setFullScreen] = createSignal<boolean>(false);
    ///// Terminal related
    const [outputSelected, setOutputSelected] = createSignal<number>(-1);
    const [output, setOutput] = createSignal<outputType[]>([]);
    const [launch, setLaunch] = createSignal(<span></span>, {equals: false});
    const [name, setName] = createSignal<string>("root", {equals: false});
    const [code, setCode] = createSignal<string>("");
    ////// Problem info
    const [title, setTitle] = createSignal<string>("");
    const [timeRemaining, setTimeRemaining] = createSignal<number>(0);
    const [isLast, setIsLast] = createSignal<boolean>(true);
    const [inputOutput, setInputOutput] = createSignal<string[]>([]);
    const [description, setDescription] = createSignal("", {equals: false});
    ////// Lang
    const [selectedLang, setSelectedLang] = createSignal<string>(localStorage.getItem('selectedLang') ?? "python", {equals: false});
    const [pickLang, setPickLang] = createSignal<boolean>(false);
    const [currentLang, setCurrentLang] = createSignal<string[]>([], {equals: false});
    const [showLOTW, setShowLOTW] = createSignal<boolean>(false, {equals: false});
    const [lotw, setLotw] = createSignal<string | undefined>(undefined, {equals: false});
    ////// Leaderboard
    const [leaderboard, setLeaderboard] = createSignal<leaderboardType[]>([]);
    ///// Solutions
    const [solutionState, setSolutionState] = createSignal<string>("closed");
    const [solutions, setSolutions] = createSignal<any[]>([], {equals: false});
    const [selectedSolution, setSelectedSolution] = createSignal<number>(0, {equals: false});
    const [comments, setComments] = createSignal<any[]>([], {equals: false});
    const [votedComments, setVotedComments] = createSignal<number[]>([], {equals: false});
    const [commentContent, setCommentContent] = createSignal<string>("");
    ////// Hide
    const [hideHistory, setHideHistory] = createSignal<boolean>(true);
    //// Auth
    const {token, authFetch} = createAuth();
    //// Navigate
    const navigate = useNavigate();
    //// Ref
    let problemRef: HTMLDivElement | undefined;
    let settingsRef: HTMLDivElement | undefined;




    // On Mount
    onMount(() => {
        // Fetching things on mount
        //// Get the problem
        fetch(`http://localhost:5000/api/v1/problem?id=${searchParams.id ?? 1}`)
        .then(rep => rep.json())
        .then(rep => {
            setTitle(rep.title);
            setInputOutput([""+rep?.input, ""+rep?.expected_output]);
            setDescription(rep.descript);
            setLotw(rep.lotw);
            console.log(description().split("<br><b><u>Example:</u></b><br>")[1])
        });

        //// Get the name of the user
        authFetch("http://localhost:5000/api/v1/name")
        .then(rep => {

            if (rep.contentType?.includes("json") && !rep.error) {
                if (rep.data.username !== undefined && rep.data.username !== null) {
                    setName(rep.data.username.toLowerCase());
                }
            }
        });

        //// Get the current languages
        fetch("http://localhost:5000/api/v1/languages")
        .then(rep => rep.json())
        .then(rep => {
            setCurrentLang(rep.map((l: {[key: string]: string}) => l.lang).sort());
        });


        //// Get the last problem id
        fetch("http://localhost:5000/api/v1/last-problem")
        .then(rep => rep.json())
        .then(rep => {
            setIsLast(+searchParams.id === rep.id);

            // If it's the last problem
            if (+searchParams.id === rep.id) {
                setTimeRemaining(Math.floor((Date.parse(rep.date_end) - new Date().getTime()) / 1000));
            } else {
                // Get the upvoted languages of the user
                authFetch("http://localhost:5000/api/v1/upvoted-comments")
                .then(rep => {
                    if (rep.error) {
                        return;
                    }

                    setVotedComments(rep.data.map((arr: any) => arr.id));
                });


               fetchComments();
            }
        });



        // Auto save the code
        loopSaveCode();



        // Socket
        //// Connect
        socket.on("connect", () => {
            console.log("connected to server");
        });
        
        //// Disconnect
        socket.on("disconnect", () => {
            console.log("disconnected from server");
        });

        // When there is a new leaderboard
        socket.on("newPerformance", (data) => {
            const {bytes, user} = data;



            // Update the leaderboard with the new data
            setLeaderboard(p => {

                // For each user
                for (const userData of p) {
                    // If the name of the user is the name of the data
                    if (userData.name === user) {
                        userData.bytes = bytes; // Update the bytes
                    }
                }
                return addRank(p, "bytes", true); // Add the rank section for the updated data
            });
        });



        window.addEventListener("keydown", (e: Event) => {

            // If Ctrl key pressed
            if ((window?.event as KeyboardEvent).ctrlKey){

                // Execute code [ Ctrl + Enter ]
                if ((e as KeyboardEvent).keyCode == 13) {
                    runProgram();
                }

                // Change language [ Ctrl + Alt + C ]
                if ((e as KeyboardEvent).keyCode == 67 && (window?.event as KeyboardEvent).altKey) {
                    setPickLang(p => !p);
                }

                // Delete code language [ Ctrl + Alt + D ]
                if ((e as KeyboardEvent).keyCode == 68 && (window?.event as KeyboardEvent).altKey) {
                    setDeleteCode(p => !p);
                }

                // Delete code language [ Ctrl + Alt + S ]
                if ((e as KeyboardEvent).keyCode == 83 && (window?.event as KeyboardEvent).altKey) {
                    openSettings();
                }

                // Back to your best score [ Ctrl + Alt + Z ]
                if ((e as KeyboardEvent).keyCode == 90 && (window?.event as KeyboardEvent).altKey) {
                    setBackToBest(p => !p);
                }
                
                // See the history of your solutions [ Ctrl + Alt + H ]
                if ((e as KeyboardEvent).keyCode == 72 && (window?.event as KeyboardEvent).altKey) {
                    // hideHistory();
                }

                // See the LOTW [ Ctrl + Alt + L ]
                if ((e as KeyboardEvent).keyCode == 76 && (window?.event as KeyboardEvent).altKey) {
                    // showLOTW();
                }
            }
        });
    });

       
    // Update localStorage
    createEffect(() => {
        localStorage.setItem("selectedLang", selectedLang());
        localStorage.setItem("autoIndent", ""+autoIndent());
        localStorage.setItem("cursorPosition", ""+cursorPosition());
        localStorage.setItem("wordWrap", ""+wordWrap());
        localStorage.setItem("tabulation", ""+tabulation());
        localStorage.setItem("showInvisible", ""+showInvisible());
    });


    // Update the leaderboard when the lang changes
    createEffect(() => {
        // Get the new leaderboard
        getLeaderboard();

        // Get the solution if it's the solution time
        if (!isLast()) {
            // Fetch the solution
            fetch(`http://localhost:5000/api/v1/solutions?id=${searchParams.id}&lang=${encodeURIComponent(selectedLang())}`)
            .then(rep => rep.json())
            .then(rep => {
                setSolutions(rep);
            });
        }

        // If the user already have some data for this problem
        if (localStorage.getItem(`${selectedLang().toLowerCase()}${searchParams.id}`) !== null) {
            setCode(localStorage.getItem(`${selectedLang().toLowerCase()}${searchParams.id}`) as string);
        } else {
            const currentLang: string = selectedLang();
            setCode(currentLang in defaultCode ? (defaultCode as ({[key: string]: string}))[currentLang] : "");
        }


        // Update the rooms that you're in to receive the update of the leaderboard
        socket.emit("leaveAllRooms");
        socket.emit("joinRoom", `${selectedLang().toLowerCase()}${searchParams.id}`);
    });



    // When open settings also change the margin-top of the output div
    createEffect(() => {
        console.log(openSettings());

        // Wait for the animation to finish
        if (settingsRef)
            setHeightSettings((parseInt(window.getComputedStyle(settingsRef).getPropertyValue("height")) + 30) + "px");

        console.log(heightSettings())   
    });



    /**
     * Fetch the leaderboard of the problem
     */
    const getLeaderboard = () => {
        fetch(`http://localhost:5000/api/v1/leaderboard-problem?problemId=${searchParams.id}&lang=${encodeURIComponent(selectedLang())}`)
        .then(rep => rep.json())
        .then(rep =>
            setLeaderboard(
                addRank(rep, "bytes", true)
            )
            .sort((a: any, b: any) => a.date - b.date)
            .sort((a: any, b: any) => a.bytes - b.bytes)
        );
    }


    const fetchComments = async () => {
        // Fetch the comments
        await fetch(`http://localhost:5000/api/v1/problem-comments?id=${searchParams.id}`)
        .then(rep => rep.json())
        .then(rep => {
            setComments(rep);
        });
    }

    // Create the loop to save the code
    const loopSaveCode = () => {
        setTimeout(() => {
            localStorage.getItem(`${selectedLang().toLowerCase()}${searchParams.id}`)
            loopSaveCode();
        }, 1_000);
    }


    // Run the program
    const runProgram = () => {

        setOutput([]);

        // Set the launch template
        setLaunch(
            <span>
                <span class="launch">
                    {launchLangTyped[selectedLang().toLowerCase()]}
                </span>
                <span> </span>
                    
                prog.{extensionLangTyped[selectedLang().toLowerCase()]}

                <span> </span>

                <span class="at">
                    <Show when={outputSelected() >= 0 && outputSelected() < output().length}>
                        #{outputSelected() + 1}
                    </Show>
                </span>
            </span> 
        );


        // Define the content that needs to be send
        const requestOptions: object = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(
                {
                    lang: selectedLang(),
                    id: searchParams.id,
                    code: code(),
                }
            )
        }

        // Fetch the API to submit the solution
        authFetch("http://localhost:5000/api/v1/submit-solution", requestOptions)
        .then(rep => {
            if (rep.error) {
                return;
            }

            const dataFormated: outputType[] = [];

            for (let i = 0; i < rep.data.inputs.length; i++) {
                dataFormated.push({
                    valid: rep.data.successArray[i],
                    input: rep.data.inputs[i],
                    expected: rep.data.expectedOutputs[i],
                    obtained: rep.data.outputs[i],
                    error: rep.data.errors.length > i ? rep.data.errors[i] : "",
                })
            }

            // Update the output
            setOutput(dataFormated);
            setOutputSelected(0);
            
            // Update the leaderboard
            getLeaderboard();
        })
        .catch(err => {
            console.error(err);
        });
    }



    // Get the previous code
    //// This function is going to be passed to the editors
    const getPrevious = (editor: any) => {
        authFetch(`http://localhost:5000/api/v1/previous-solution?id=${searchParams.id}&lang=${encodeURIComponent(selectedLang().toLowerCase())}`, {}, false)
        .then(rep => {
            if (rep.error) 
                return;
            
            editor.setValue(rep.data.code);
        });
    }



    // Remove the connection
    onCleanup(() => {
        socket.disconnect();
    })



    return (
    <div class="Problem" ref={problemRef}>

        {/* Position fixed elements */}
        <Show when={pickLang()}>
            <PickLang
                hide={() => setPickLang(p => !p)}
                setLang={(l: string) => setSelectedLang(l)}
            />
        </Show>



        {/* Description of  the problem */}
        <section class={"description" + (localStorage.getItem('opaqueProblem') === 'true' ? ' opaque' : "")}>
            <h1>{title()}</h1>
            <Show when={!isLast()}>
                <button
                    class="next"
                    onclick={() => document.location.href =`/problem?id=${+searchParams.id + 1}`}
                >
                    Next
                </button>
            </Show>
            <Show when={+searchParams.id !== 1}>
                <button
                    class="previous"
                    onclick={() => document.location.href =`/problem?id=${+searchParams.id - 1}`}
                >
                    Previous
                </button>
            </Show>
            <section class="description-problem">
                <div class="text">
                    <p>
                        {
                            transformParagraph(description().split("<br><b><u>Example:</u></b><br>")[0])
                        }
                    </p>
                </div>
                <div class="more-info">
                    <p>
                        {
                            transformParagraph(description().split("More info</div>")[1])
                        }
                    </p>
                </div>
                <div class="example">
                    <div class='content-ide'>
                        <For each={inputOutput()}>
                            {
                                code =>  <MonacoEditor
                                    bgColor='--bg-theme-color'
                                    readonly={true}
                                    code={code}
                                    lang="txt"
                                    style={{
                                        width: '50%',
                                        'max-height': '120px',  
                                        'height': Math.max(...inputOutput().map((s: string) => s.split("\n").length * 22)) + "px",
                                        overflow: 'hidden',
                                        'border-radius': "5px"
                                    }}
                                />
                            }
                        </For>
                    </div>
                    <p>
                        {
                            transformParagraph(description()?.split("<br><b><u>Example:</u></b><br>")[1]?.split("More info</div>")[0] ?? "")
                        }
                    </p>
                </div>
            </section>
        </section>

        <Show when={lotw !== undefined && isLast()}>
            <button class="lotw" onclick={() => setShowLOTW(true)}>
                L<span class="hide">anguage</span>
                O<span class="hide">f</span>
                T<span class="hide">he</span>
                W<span class="hide">eek</span>
            </button>
        </Show>

        {/* Timer till next problem */}
        <TimerNextProblem
            time={timeRemaining()}
        />

        {/* The solution for when the problem is over */}
        <Show when={!isLast()}>
            <section class={`solution ${solutionState()}`}>
                <header>
                    <button
                        onclick={() => setSolutionState(p => p === "closed" ? "opened" : "closed")}
                        title="Show solutions of other users"
                    >
                        <img src={bulb} alt="A bulb"/>
                    </button>
                </header>
                <main>
                    <button
                        class="change-language"
                        onClick={() => setPickLang(true)}
                    >
                        <img
                            src={`src/assets/icons/${selectedLang().toLowerCase().replace('#',"s")}_white.svg`}
                        />
                    </button>
                    <nav>
                        <textarea
                            placeholder='Username...'
                        />
                        <textarea
                            placeholder='Size...'
                        />
                        <Index each={solutions()}>
                        {(s, i) => <button onclick={() => {setSelectedSolution(i); console.log(solutions()[selectedSolution()].code)}}>
                            {
                                s().upgrade ? 
                                "UP" :
                                "SOL"
                            }
                            &#10;N°
                            {
                                s().upgrade ? 
                                solutions().filter(z => z.upgrade).length - i:
                                i + 1 - solutions().filter(z => z.upgrade).length

                            }
                            </button>
                        }
                        </Index>
                    </nav>
                    <main>
                        <Show when={solutions() !== undefined}>
                            <span>
                                <b>{solutions()[selectedSolution()]?.size ?? 0}</b>bytes by 
                                <b>{solutions()[selectedSolution()]?.name ?? "No name"}</b>
                            </span>
                        </Show>
                        <MonacoEditor
                            bgColor='--bg-theme-color'
                            readonly={true}
                            code={solutions().length > selectedSolution() ? solutions()[selectedSolution()].code : "No solution selected"}
                            lang={selectedLang()}
                            style={{
                                'min-width': '1000px',
                                width: "100%",
                                'min-height': '50%',  
                                'max-height': 'calc(100% - 80px)',  
                                overflow: 'hidden',
                                'border-radius': "5px"
                            }}
                            // showByte={true}
                            setValueIde={true}
                        />
                        <section class="comments">
                            <div class="content-scroll">
                                <textarea
                                    placeholder='Enter a comment...'
                                    onkeydown={(e) => setCommentContent((e.target as HTMLTextAreaElement).value)}
                                />
                                <button
                                    class="send"
                                    onclick={() => {
                                        const requestOptions: object = {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', },
                                            body: JSON.stringify(
                                                {
                                                    id: solutions()[selectedSolution()].id,
                                                    content: commentContent()
                                                }
                                            )
                                        }

                                        
                                        authFetch(`http://localhost:5000/api/v1/comment`, requestOptions)
                                        .then(async (rep) => {

                                            await fetchComments()
                                        });
                                    }}
                                >
                                    <img src={send}/>
                                </button>
                                <For
                                    each={
                                        comments()
                                        .filter(c =>
                                            solutions().length > selectedSolution() ?
                                            c.solution_id === solutions()[selectedSolution()].id :
                                            false
                                        )
                                    }
                                >
                                {
                                    comment => <article>
                                        <div class="vote-content">
                                            <div
                                                class={votedComments().includes(comment.id) ? "voted" : ""}
                                                onclick={() => {
                                                        setVotedComments(p =>
                                                            p.includes(comment.id) ?
                                                            p.filter(c => c !== comment.id):
                                                            [...p, comment.id]
                                                        );


                                                        setComments((p: any[]) => 
                                                            p
                                                            .map(c => {

                                                                console.log(votedComments())

                                                                if (c.id === comment.id) {
                                                                    c.upvote += 2 * +votedComments().includes(c.id as number) - 1 
                                                                }
                                                                return c;
                                                            })
                                                        )


                                                        // Define the content that needs to be send
                                                        const requestOptions: object = {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json', },
                                                            body: JSON.stringify(
                                                                {
                                                                    id: comment.id,
                                                                }
                                                            )
                                                        }

                                                        // Fetch
                                                        authFetch(`http://localhost:5000/api/v1/vote-comment`, requestOptions);
                                                    }
                                                }    
                                            />
                                            {comment.upvote}
                                        </div>
                                        <div class='comment-content'>
                                            <div class="comment">
                                                {comment.content}
                                            </div>
                                            <footer>
                                                {formatDate(Date.parse(comment.date_send) / 1000)} - <A href={`/profile?name=${comment.name}`}>{comment.name}</A>
                                            </footer>
                                        </div>
                                    </article>
                                    
                                }
                                </For>
                                <div 
                                    style={{'min-width': "10px"}}
                                />
                            </div>
                        </section>
                    </main>
                </main>
            </section>
        </Show>


        {/* Main IDE part */}
        <main
            class={fullScreen() ? "fullscreen" : ""}
            style={ fullScreen() ? {
                'position': 'fixed',
                'width': problemRef !== undefined ? window.getComputedStyle(problemRef).getPropertyValue("width"): "0px",
                'height': parseInt(localStorage.getItem("layout") ?? '0') < 4 ? "calc(100% - 80px)" : "calc(100% - 20px)"
            } : {
                'padding-bottom': "50px"
            }}
        >
            {/* Buttons at the top */}
            <header class="buttons">
                <button
                    class='lang'
                    onClick={() => setPickLang(true)}
                    title="Change of language&#010;Ctrl + Alt + C"
                >
                    {formatLangTyped[selectedLang()]}
                </button>
                <div>
                    <button title="See the history" onclick={() => setHideHistory(false)}>
                        <img src={historyIcon} alt="A book"/>
                    </button>
                    <button
                        onclick={() => setFullScreen(p => !p)} 
                        class={!fullScreen() ? 'smallscreen' : 'fullscreen' }
                        title="Full screen&#010;Ctrl + Alt + F"
                    >
                        {
                            fullScreen() ?
                            <img src={smallscreenIcon}/> :
                            <img src={fullscreenIcon}/>
                        }
                    </button>
                    <button class="run" onClick={runProgram} title="Run program&#010;Ctrl + Enter">
                        <span>
                            RUN
                        </span>
                    </button>
                </div>
            </header>


            {/* IDE */}
            <main>
                <Show when={fullScreen()}>
                    <MonacoEditor
                        bgColor='--bg-theme-color'
                        code={"h"}
                        lang={selectedLang()}
                        style={{
                            width: problemRef !== undefined ? window.getComputedStyle(problemRef).getPropertyValue("width"): "0px",
                            overflow: 'hidden',
                            'border-radius': "5px",
                            'min-height': "100%",
                            height: '100%',
                        }}
                        fontSize={20}
                        showByte={true}
                        lineHighlight={true}
                        showInvisible={showInvisible()}
                        tabulation={tabulation()}
                        wordWrap={wordWrap()}
                        cursorPosition={cursorPosition()}
                        autoBrackets={autoBrackets()}
                        autoIndent={autoIndent()}
                        updateCode={setCode}
                        deleteCode={deleteCode}
                        previousCode={backToBest}
                        requestCode={getPrevious}
                    />
                </Show>
                <Show when={!fullScreen()}>
                    <MonacoEditor
                        bgColor='--bg-theme-color'
                        code={"h"}
                        lang={selectedLang()}
                        style={{
                            width: '100%',
                            overflow: 'hidden',
                            'border-radius': "5px",
                            'min-height': "300px",
                            height: '300px',
                        }}
                        fontSize={18}
                        showByte={true}
                        lineHighlight={true}
                        showInvisible={showInvisible()}
                        tabulation={tabulation()}
                        wordWrap={wordWrap()}
                        cursorPosition={cursorPosition()}
                        autoBrackets={autoBrackets()}
                        autoIndent={autoIndent()}
                        updateCode={setCode}
                        deleteCode={deleteCode}
                        previousCode={backToBest}
                        requestCode={getPrevious}
                    />
                </Show>
            </main>


            {/* Settings section */}
            <section class={"settings-section" + (openSettings() ? " open" : '')}>
                {/* Button to delete code */}
                <button
                    class="delete"
                    title="Go back from start&#010;Ctrl + Alt + D" 
                    onclick={() => setDeleteCode(p => !p)}
                >
                    <img src={trash} alt="Trash"/>
                </button>
                <div class="settings">
                    <div
                        class='settings-button'
                        onClick={() => setOpenSettings(p => !p)}
                        title="Open the settings&#010;Ctrl + Alt + S"
                    >
                        <img src={settings}/>
                    </div>
                    <main ref={settingsRef}>
                        {/* Tabulation */}
                        <article>
                            <h1>\\tabulation</h1>
                            Replace spaces with tabs<br/>
                            <Toggle
                                default={tabulation()}
                                on={() => setTabulation(true)}
                                off={() => setTabulation(false)}
                            />
                        </article>

                        {/* Word wrap */}
                        <article>
                            <h1>Word wrap</h1>
                            Make a word wrap instead of a long line<br/>
                            <Toggle
                                default={wordWrap()}
                                on={() => setWordWrap(true)}
                                off={() => setWordWrap(false)}
                            />
                        </article>

                        {/* Cursor position */}
                        <article>
                            <h1>Cursor position</h1>
                            Show the position of the cursor (line and column) <br/>
                            <Toggle
                                default={cursorPosition()}
                                on={() => setCursorPosition(true)}
                                off={() => setCursorPosition(false)}
                            />
                        </article>


                        {/* Show invisible */}
                        <article>
                            <h1>Show invisible</h1>
                            Show spaces and tabs <br/>
                            <Toggle
                                default={showInvisible()}
                                on={() => setShowInvisible(true)}
                                off={() => setShowInvisible(false)}
                            />
                        </article>

                        {/* Auto brackets */}
                        <article>
                            <h1>Auto brackets</h1>
                            Autocomplet (, [, &#123;, ', " <br/>
                            <Toggle
                                default={autoBrackets()}
                                on={() => setAutoBrackets(true)}
                                off={() => setAutoBrackets(false)}
                            />
                        </article>

                        {/* Show error */}
                        <article>
                            <h1>Show error</h1>
                            Show errors in the "terminal"<br/>
                            <Toggle/>
                        </article>

                        {/* Auto indent */}
                        <article>
                            <h1>Auto indent</h1>
                            Auto indent code<br/>
                            <Toggle
                                default={autoIndent()}
                                on={() => setAutoIndent(true)}
                                off={() => setAutoIndent(false)}
                            />
                        </article>

                        {/* Keyboards */}
                        <article>
                            <h1>Keyboards</h1>
                            Auto indent code<br/>
                            <Toggle
                                
                            />
                        </article>
                    </main>
                </div>
                <button
                    class="previous"
                    title="Go back to your previous best solution&#010;Ctrl + Alt + Z"
                    onclick={() => setBackToBest(p => !p)}
                >
                    <img src={reset}/>
                </button>
            </section>

            {/* Output */}
            <div class="output" style={{
                "margin-top": openSettings() ? heightSettings() : '0px'
            }}>
                {/* Console */}
                <div class="console">
                    <span class="light">┌──(</span><span class='name'>{name()}</span><span class='at'>@</span><span class='weekgolf'>weekgolf</span><span class="light">)-[</span><span class="wave">~</span><span class="light">]</span> <br/>
                    <span class="light">└─</span><span class='name'>$</span> {launch()}
                    <Show when={outputSelected() >= 0 && outputSelected() < output().length}>
                        {/* Input */}
                        <div>
                            <span class="light">&gt;&gt;&gt;</span> <span class='name'>STDIN</span>:<br/>
                            {output()[outputSelected()].input}
                        </div>

                        {/* Expected output */}
                        <div>
                            <span class="light">&gt;&gt;&gt;</span> <span class='name'>STDEXPECTED</span>:<br/>
                            {output()[outputSelected()].expected}
                        </div>

                        {/* Standard output */}
                        <div>
                            <span class="light">&gt;&gt;&gt;</span> <span class='name'>STDOUT</span>:<br/>
                            {output()[outputSelected()].obtained}
                        </div>

                        <Show when={output()[outputSelected()].error.length > 0}>
                            {/* Standard error */}
                            <div>
                                <span class="light">&gt;&gt;&gt;</span> <span class='name'>STDERR</span>:<br/>
                                {
                                    output()[outputSelected()]
                                    .error
                                }
                            </div>
                        </Show>

                    </Show>
                </div>
                <nav>
                    <Index each={output()} fallback={"No solutions submitted"}>
                        {
                            (c: any, i) => 
                                <button
                                    class={c().valid ? "valid" : "invalid"}
                                    onClick={() => setOutputSelected(i)}
                                >
                                    Test case #{i + 1}
                                </button>
                        }

                    </Index>
                </nav>
            </div>
        </main>

        <div class="content-leaderboard">
            <div class={"Leaderboard" + (localStorage.getItem('splitLeaderboard') === 'true' ? ' split' : '' )}>
                <header>
                    <h1>
                        Leaderboard
                    </h1>
                </header>
                <section>
                    <nav>
                        <ul>
                            <For each={currentLang()}>
                            {
                                // lang => <li onclick={() => {setSelectedLang(lang.toLowerCase()); getLeaderboard()}}>
                                lang => <li onclick={() => setSelectedLang(lang.toLowerCase())}>
                                    <img src={`src/assets/icons/${lang.toLowerCase().replace('#',"s")}_white.svg`}/>
                                    <span>
                                        {formatLangTyped[lang.toLowerCase()]}
                                    </span>
                                </li>   
                            }
                            </For>
                        </ul>
                    </nav>
                    <main>
                        <img
                            class="lang-img"
                            src={`src/assets/icons/${selectedLang().toLowerCase()}_white.svg`}
                            alt={formatLangTyped[selectedLang().toLowerCase()]}
                            title={formatLangTyped[selectedLang().toLowerCase()]}
                        />
                        <h4>{leaderboard().length} player{leaderboard().length !== -1 ? "s" : ""}</h4>
                        <LeaderboardUsers
                            users={leaderboard()}
                            type={'bytes'}
                        />
                    </main>
                </section>
            </div>
        </div>

        <NoteProblem problemId={searchParams.id}/>

        <Show when={!hideHistory()}>
            <History
                hide={() => setHideHistory(true)}
                lang={selectedLang()}
                id={searchParams.id}
            />
        </Show>
        <Show when={showLOTW()}>
            <LOTW
                hide={() => setShowLOTW(false)}
                lotw={lotw() ?? "python"}
                changeLang={setSelectedLang}
            />
        </Show>
    </div>
    )
}



export default Problem;