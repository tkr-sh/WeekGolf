import { A } from "@solidjs/router";
import { createEffect, createSignal, For, onMount } from "solid-js";
import createAuth from "../hooks/createAuthFetch";
import "../style/ContributeMenu.scss";




interface contributionType {
    vote: number,
    id: number,
    title: string,
    description: string,
    author: string,
    state: number,
}


interface voteContributionType {
    id: number,
    up: boolean,
}


const ContributeMenu = () => {

    const [contributions, setContributions] = createSignal<contributionType[]>([], {equals: false});
    const [listVoted, setListVoted] = createSignal<voteContributionType[]>([], {equals: false});
    const {token, authFetch} = createAuth();

    onMount(() => {
        fetch("http://localhost:5000/api/v1/contributions")
            .then(rep => rep.json())
            .then(rep => setContributions(rep));


        if (token() !== undefined &&  token() !== "") {
            authFetch("http://localhost:5000/api/v1/votes-contributions")
                .then(
                     (rep) => {
                        if (!rep.error) {
                            setListVoted(rep.data);
                        }
                    }
                )

        }
    });


    const vote = (up: boolean, id: number) => {
        // If the user doesnt have a token, they cant vote.
        if (token() === undefined || token().length === 0) return;

        // Send the request
        authFetch(
            "http://localhost:5000/api/v1/vote-contribution",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id, up }),
            }
        );

        // Is it upvoted or downvoted ?
        const wasUpvoted = listVoted().some(v => v.id === id && v.up);
        const wasDownvoted = listVoted().some(v => v.id === id && !v.up);

        // If the user clicked on the button but it was still there before
        if ((wasDownvoted && !up) || (wasUpvoted && up)) {

            setListVoted((p:any) =>
                p.filter(e => e.id !== id)
            );

            const newContributions =
                [...contributions().map(e => {
                    if (e.id === id) {
                        if (up) {
                            e.vote -= 1;
                        } else {
                            e.vote += 1;
                        }
                    }

                    return {...e};
                })]

            setContributions(p => newContributions);

        } else {

            // If there wasn't' a vote before
            if (!listVoted().some(v => v.id === id)) {
                setListVoted(
                    p => [...p, {up: false, id: id}]
                )
            }

            setListVoted((p:any) =>
                p.map(e => {
                    if (e.id === id) {
                        e.up = up;
                    }
                    return e;
                })
            );

            const newContributions =
                [...contributions().map(e => {
                    if (e.id === id) {
                        if (up) {
                            e.vote += 1 + +wasDownvoted - +wasUpvoted;
                        } else {
                            e.vote -= 1 + +wasUpvoted - +wasDownvoted;
                        }
                    }

                    return {...e};
                })]

            setContributions(newContributions);

        }
    }


    createEffect(() => {
        console.log(contributions());
    })

    return <main class="contribute-menu">
        <h1>Contribution</h1>
        <p>
            Here, this is where WeekGolf members can create their own problems!<br/>
            You can propose a statement for a problem, but you can also vote and comment on the different problems ideas that users submitted!
        </p>
        
        <A href="/create-contribution"  class="create">
        +
        </A>

        <ul>
            <For each={contributions()}>
            {
                c => 
                <li class={"contribution " + ["refused", "", "accepted"][c.state + 1]}>
                    <div>
                        <button
                            class={`upvote ${listVoted().some(v => v.id === c.id && v.up) ? 'on' : ''}`}
                            onClick={() => vote(true, c.id)}
                        />
                        {
                            c.vote
                        }
                        <button
                            class={`downvote ${listVoted().some(v => v.id === c.id && !v.up) ? 'on' : ''}`}
                            onClick={() => vote(false, c.id)}
                        />
                    </div>
                    <A href={`/contribution?id=${c.id}`}>
                        <h2>
                        {
                            c.title
                        }
                        </h2>

                        <p>
                        {
                            c.description
                        }
                        </p>
                        <footer>
                        By 
                        <A href={`/profile?name=${c.author}`}>
                        {
                            c.author
                        }
                        </A>
                        </footer>
                    </A>
                </li>
            }
            </For>
        </ul>
    </main>
}


export default ContributeMenu;
