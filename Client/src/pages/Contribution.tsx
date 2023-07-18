import { A, useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import MonacoEditor from "../components/IDE";
import "../style/Problem.scss";
import "../style/Contribution.scss";
import createAuth from "../hooks/createAuthFetch";
import formatDate from "../utils/formatDate";
import transformParagraph from "../utils/transformParagraph";


interface ContributionType {
    id: number,
    author: string,
    title: string,
    description: string,
    example: string,
    more_info: string,
    vote: number,
    input: string,
    output: string,
    state: number,
}

type TComment = {
    content: string,
    author: string,
    date_send: string,
    upvote: number,
    id: number
}

const Contribution = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [informations, setInformations] = createSignal<null | ContributionType>(null, {equals: false});
    const [voteSignal, setVoteSignal] = createSignal<number>(0);
    const [comment, setComment] = createSignal<string>('');
    const [comments, setComments] = createSignal<TComment[]>([]);
    const [voteComments, setVoteComments] = createSignal<any[]>([]);
    const [amIAdmin, setAmIAdmin] = createSignal<boolean>(false);
    const [creator, setCreator] = createSignal<boolean>(false);
    const {token, authFetch} = createAuth();


    /*
     * The the component in mounted
     */
    onMount(() => {
        /*
         * Get votes
         */
        authFetch("http://localhost:5000/api/v1/votes-contributions")
        .then(rep => rep.data)
        .then(rep => rep.filter(e => searchParams.id === "" + e.id))
        .then(rep => {
            if (rep.length === 0) {
                setVoteSignal(0);
            } else {
                setVoteSignal(2 * rep[0].up - 1);
            }
        })

        /*
         * Get the information about a contribution
         */
        fetch("http://localhost:5000/api/v1/contribution?id="+searchParams.id)
        .then(rep => rep.json())
        .then(rep => setInformations(rep));

        /*
         * Get the comments
         */
        fetch("http://localhost:5000/api/v1/contribution-comments?id="+searchParams.id)
        .then(rep => rep.json())
        .then(rep => setComments(rep));

        /*
         * Get the votes of a user for comments in this contribution
         */
        authFetch("http://localhost:5000/api/v1/votes-contribution-comments?id="+searchParams.id)
        .then(rep => {
            if (rep.error) {
                return;
            }

            setVoteComments(rep.data);
        });

        /**
         * Am I an administrator ???
         */
        authFetch("http://localhost:5000/api/v1/am-i-admin")
        .then(rep => {
            if (rep.error) {
                return;
            }
 
            setAmIAdmin(rep.data.admin)
        });

        /**
         * Am I the creator of that question ?
         */
        authFetch("http://localhost:5000/api/v1/am-i-author?id=" + searchParams.id)
        .then(rep => {
            if (rep.error) {
                return;
            }

            setCreator(true);
        })
    });


    /*
     * Function to update the vote when clicking on a button
     */
    const vote = (up: boolean) => {
        // If the user doesnt have a token, they cant vote.
        if (token() === undefined || token().length === 0) return;

        // Send the request
        authFetch(
            "http://localhost:5000/api/v1/vote-contribution",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id: searchParams.id, up }),
            }
        );

        // Is it upvoted or downvoted ?
        const wasUpvoted = voteSignal() === 1;
        const wasDownvoted = voteSignal() === -1;

        // If the user clicked on the button but it was still there before
        if ((wasDownvoted && !up) || (wasUpvoted && up)) {

            setVoteSignal(0);

            setInformations(p => {
                let e = {...p};
                e.vote = e.vote - +wasUpvoted + +wasDownvoted;
                return e;
            })
        } else {
            setVoteSignal(2 * +up - 1);

            setInformations(p => {
                let e = {...p};

                if (up) {
                    e.vote += 1 + +wasDownvoted - +wasUpvoted;
                } else {
                    e.vote -= 1 + +wasUpvoted - +wasDownvoted;
                }

                return e;
            })
        }
    }


    /*
     * Post a comment
     */
    const postComment = (e: Event) => {

        // Prevent default
        e.preventDefault();

        const now = new Date();
        const utcDate = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
              now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

        setComments(p => [{
            id: -1,
            upvote: 0,
            content: comment(),
            author: "You",
            date_send: ""+(utcDate),
        }, ...p])

        authFetch(
            "http://localhost:5000/api/v1/comment-contribution",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id: searchParams.id, comment: comment() }),
            }
        );
    }


    /*
     * Vote for a comment
     */
    const voteComment = (idComment: number) => {

        // If the user already voted for that problem
        if (voteComments().some(e => e.id === idComment)) {
            setVoteComments(p => p.filter(e => e.id !== idComment));
            setComments(
                p => 
                    p.map(
                        e => {
                            if (e.id === idComment)
                                e.upvote -= 1;
                            return {...e};
                        }
                    )
            )
        } else {
            setVoteComments(p => [...p, {id: idComment}])
            setComments(
                p => 
                    p.map(
                        e => {
                            if (e.id === idComment)
                                e.upvote += 1;
                            return {...e};
                        }
                    )
            )
        }
        
        // Send the request
        authFetch(
            'http://localhost:5000/api/v1/vote-comment-contribution',
            {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id: idComment }),
            }
        )
    }


    /*
     * Accept or decline a contribution
     */
    const changeState = (accepted: boolean) => {
        authFetch(
            "http://localhost:5000/api/v1/change-state",
            {
                method: "PUT",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ accepted, id: searchParams.id }),
            }
        );
    }

    return <main class="Contribution">
        <section class="vote">
            <button
                class={`upvote ${voteSignal() === 1 ? 'on' : ''}`}
                onClick={() => vote(true)}
            />
            {
                informations()?.vote
            }
            <button
                class={`downvote ${voteSignal() === -1 ? 'on' : ''}`}
                onClick={() => vote(false)}
            />

            <Show when={amIAdmin()}>
                <img src="src/assets/icons/correct.svg" class="accept" onclick={() => changeState(true)}/>
                <img src="src/assets/icons/incorrect.svg" class="refuse" onclick={() => changeState(false)}/>
            </Show>
        </section>

        <section class="Problem">
            {/* Description of  the problem */}
            <section class={"description" + (localStorage.getItem('opaqueProblem') === 'true' ? ' opaque' : "")}>
                <h1>
                    {informations() === null ? "" : informations().title}
                </h1>
                <Show when={!creator()}>
                    <h5>
                        By {" "}
                        <A href={"/profile?name="+informations()?.author}>
                        {
                            informations()?.author
                        }
                        </A>
                    </h5>
                </Show>
                <Show when={creator()}>
                    <h5>
                        <A href={"/edit-contribution?id=" + searchParams.id}>
                            Edit contribution
                        </A>
                    </h5>
                </Show>
                <section class="description-problem">
                    <div class="text">
                        <p>
                        {
                            transformParagraph(informations()?.description)
                        }
                        </p>
                    </div>
                    <div class="more-info">
                        <p>
                        {
                            transformParagraph(informations()?.more_info)
                        }
                        </p>
                    </div>
                    <div class="example">
                        <div class='content-ide'>
                            <For each={[informations()?.input, informations()?.output]}>
                                {
                                    code =>  <MonacoEditor
                                        bgColor='--bg-theme-color'
                                        readonly={true}
                                        code={code}
                                        lang="txt"
                                        style={{
                                            width: '50%',
                                            'max-height': '120px',  
                                            'min-height': '50px',  
                                            'height': Math.max(...[informations()?.input ?? '', informations()?.output ?? ''].map((s: string) => s.split("\n").length * 22)) + "px",
                                            overflow: 'hidden',
                                            'border-radius': "5px"
                                        }}
                                    />
                                }
                            </For>
                        </div>
                        <p>
                            {
                                transformParagraph(informations()?.example)
                            }
                        </p>
                    </div>
                </section>
            </section>
        </section>


        <section class="Comments">
            <form onsubmit={postComment}>
                <textarea onChange={txt => setComment(txt.target.value)}/>
                <button type="submit">
                    <img src="src/assets/icons/paper_plane.svg"/>
                </button>
            </form>
            <ul>
                <For each={comments()}>
                {
                    c => <li>
                        <div class="vote">
                            <button
                                class={`upvote ${voteComments().some(e => e.id === c.id) ? 'on' : ''}`}
                                onClick={() => voteComment(c.id)}
                            />
                            {c.upvote}
                        </div>
                        <div class="content">
                            <p>
                            {
                                c.content
                            }
                            </p>
                            <span class="author">
                            {
                                formatDate(Date.parse(c.date_send) / 1000 )
                            } -
                            <A href={"/profile?name="+c.author}>
                            {
                                c.author
                            }
                            </A>
                            </span>
                        </div>
                    </li>
                }
                </For>
            </ul>
        </section>
    </main>
}


export default Contribution;
