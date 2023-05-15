import { For, Show, createEffect, createSignal, onMount } from "solid-js"
import star from '../assets/icons/star_white.svg'
import CssFilterConverter from "css-filter-converter";
import hslToRgb from "../utils/hslToRGB";
import createAuth from "../hooks/createAuthFetch";





interface noteType {
    sum_votes: number,
    voters: number,
}


const NoteProblem = ({problemId}: any) => {
    const [infos, setInfos] = createSignal<null | noteType>(null, {equals: false});
    const [noteUser, setNoteUser] = createSignal<number>(-1, {equals: false});
    const [submitNote, setSubmitNote] = createSignal<number>(-1);
    const [hidePop, setHidePop] = createSignal<boolean>(true);
    const { token, authFetch } = createAuth();
    let noteProblemRef: HTMLDivElement | undefined;

    /**
     * When the component is rendered, get the notes
     */
    onMount(() => {
        getNote()
    })



    /**
     * Get the note of a problem
     */
    const getNote = () => {
        // Get the public note
        fetch("http://localhost:5000/api/v1/note?id="+problemId)
        .then(
            rep => rep.json()
        )
        .then(
            rep => {
                setInfos(rep)
                console.log(rep)
            }
        )
        .catch(
            err => console.error(err)
        );

        // Get the personal note
        authFetch("http://localhost:5000/api/v1/personal-note?id="+problemId)
        .then(rep => {
            if (rep.error) {
                console.error(rep.error)
                return;
            }

            setSubmitNote(rep.data.note);
            setNoteUser(rep.data.note);

            if (rep.data.note === -1) {
                setHidePop(false);
            }
        }).
        catch(err => console.error(err));
    }

    /**
     * Handle the note of a problem
     * 
     * @param note The note of the user
     */
    const sendNote = (note: number) => {
        authFetch("http://localhost:5000/api/v1/note", {
            method: 'POST',
            body: JSON.stringify({note, id:problemId}),
            headers: { 'Content-Type': 'application/json', },
        });


        console.log(note, submitNote());

        // If the user deleted their note
        if (note === -1 && submitNote() !== -1) {
            setInfos(
                p => {
                    if (p?.voters !== undefined && p?.sum_votes !== undefined) {
                        p.voters -= 1;
                        p.sum_votes -= submitNote();
                    }

                    return p;
                } 
            )
        }
        // If the user add a vote and already voted
        else if (submitNote() !== -1) {
            setInfos(
                p => {
                    if (p?.voters !== undefined && p?.sum_votes !== undefined) {
                        p.sum_votes += note - submitNote();
                    }

                    return p;
                } 
            )
        }
        // If they delete their vote, but also never voted (wtf?)
        else if (note === -1) {
            // Pass
        }
        // If it's the first time that they vote
        else {
            setInfos(
                p => {
                    if (p?.voters !== undefined && p?.sum_votes !== undefined) {
                        p.sum_votes += + note;
                        p.voters += 1
                    }

                    return p;
                } 
            )

            console.log(infos())
        }


        setSubmitNote(note);
    }



    return <>
    <div class="note-problem" ref={noteProblemRef}>
        <header>
            <div>
                <b>Votes</b>: {infos()?.voters ?? 0}
            </div>
            <div>
                <b>Mean</b>: {(infos()?.sum_votes ?? 0) / (infos()?.voters ?? 1)}
            </div>
        </header>
        <main>
            <For each={[...Array(10).keys()]}>
            {
                i => <button
                    onClick={() => setNoteUser(i + 1)}
         
                >
                    <img
                        src={star}
                        style={(() => {

                            if (noteUser() - 1 < i ) {
                                return {filter: "brightness(70%)"}
                            }

                            // Get the color from local storage and convert it to #RGB
                            const arr: number[] =  getComputedStyle(document.documentElement)
                                .getPropertyValue("--main-color")
                                .split(",")
                                .map((s: string) =>
                                    parseInt(
                                        s
                                        .match(/\d+/g)
                                        ?.join('')
                                        ?? '0'
                                    )
                                )

                            console.log(arr);
                            console.log(hslToRgb(arr[0], arr[1]/100, arr[2]/100));

                            console.log(CssFilterConverter
                                .hexToFilter(
                                    hslToRgb(arr[0], arr[1]/100, arr[2]/100)
                                )
                                .color + "")
                            
                            return {
                                filter:
                                CssFilterConverter
                                .hexToFilter(
                                    hslToRgb(arr[0], arr[1]/100, arr[2]/100)
                                )
                                .color + ""
                            }
                        })()}
                    />
                </button>
            }
            </For>
        </main>
        <footer>
            <button onClick={() => sendNote(-1)}>
                DELETE NOTE
            </button>
            <button onClick={() => sendNote(noteUser())}>
                SEND NOTE
            </button>
        </footer>
    </div>

    {/* The dialog box for people to vote more often */}
    <Show when={!hidePop()}>
        <dialog>
            <main onClick={() => setHidePop(true)}>
                <span>
                    Do you like or hate this problem?
                </span>
                <button onClick={() => noteProblemRef?.scrollIntoView()}>
                    Note it!
                </button>
            </main>
        </dialog>
    </Show>
    </>;
}

export default NoteProblem;