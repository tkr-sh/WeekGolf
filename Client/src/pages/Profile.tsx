import "../style/Profile.scss";
import userPfp from "../assets/imgs/nouser_white.jpg";
import defaultBanner from "../assets/imgs/banner.jpg";
import { batch, createEffect, createSignal, For, Index, Match, onMount, Show, Switch } from "solid-js";
import rankToClass from "../utils/rankToClass";
import SearchData from "../components/SearchData";
import PerformanceFormat from "../components/PerformanceFormat";
import createAuth from "../hooks/createAuthFetch";
import formatLang from "../data/formatLang.json"
import colorLang from "../data/colorLang.json"
import { jsonStringToString } from "../utils/jsonTypeString";
import formatNumber from "../utils/formatNumber";
import { A, useParams, useSearchParams } from "@solidjs/router";
import FriendList from "../components/FriendList";
import FormatActivity from "../components/FormatActivity";
import CommentFormat from "../components/CommentFormat";


const formatLangTyped: jsonStringToString = formatLang;
const colorLangTyped: jsonStringToString = colorLang;

// Types
//// For langs
interface langFormatType {
    lang: string,
    score: number,
    color: string,
    rank: string,
}
//// For performances
interface perfFormatType {
    lang: string,
    rank: number,
    nb_players: number,
    size: number,
    problem: string,
}



/**
 * Component for the profile
 * 
 * @returns JSX
 */
const Profile = () => {
    // Hooks
    //// Params
    const [searchParams, setSearchParams] = useSearchParams();
    //// Signal
    ////// Tab
    const [tab, setTab] = createSignal(1);
    ////// Data of the user
    const [id, setId] = createSignal(searchParams.id);
    const [bio, setBio] = createSignal("");
    const [score, setScore] = createSignal([1, 1, 1]);
    const [ranking, setRanking] = createSignal([0, 0, 0]);
    const [name, setName] = createSignal(searchParams.name, {equals: false});
    const [pfp, setPfp] = createSignal(userPfp)
    const [banner, setBanner] = createSignal("")
    const [totLang, setTotLang] = createSignal(31);
    const [country, setCountry] = createSignal("XX");
    const [discordId, setDiscordId] = createSignal('820663765392425011');
    const [discord, setDiscord] = createSignal('...#9999');
    const [self, setSelf] = createSignal(false);
    const [relation, setRelation] = createSignal(-1);
    ////// Performances
    const [allPerfs, setAllPerfs] = createSignal([]);
    const [totPerf, setTotPerf] = createSignal(0);
    const [showPerf, setShowPerf] = createSignal(false);
    const [pagePerf, setPagePerf] = createSignal(1);
    const [maxPage, setMaxPage] = createSignal(1);
    const [filterPerf, setFilterPerf] = createSignal({}, { equals: false });
    const [previewPerf, setPreviewPerf] = createSignal<perfFormatType[]>([]);
    ////// Problems
    const [problems, setProblems] = createSignal<{[key: number]: string}>({});
    ////// Comments
    const [totComments, setTotComments] = createSignal(0);
    const [showCom, setShowCom] = createSignal(false);
    const [allComments, setAllComments] = createSignal([]);
    const [filterComments, setFilterComments] = createSignal({}, {equals: false});
    const [previewComments, setPreviewComments] = createSignal<any[]>([
        // {
        //     vote: 30,
        //     content: "This is a very good comment.",
        // }
    ]);
    const [langJSON, setLangJSON] = createSignal<langFormatType[]>([], { equals: false });
    ////// Activity
    const [activity, setActivity] = createSignal<any>();
    const [filter, setFilter] = createSignal<any>({});
    const [pageActivity, setPageActivity] = createSignal<number>(1);
    const [maxPageActivity, setMaxPageActivity] = createSignal<number>(1);
    //// Reference
    let navButtonRef: HTMLButtonElement[] | undefined[] = [undefined, undefined, undefined];
    //// Auth 
    const {token, authFetch} = createAuth();



    /**
     * Get the % of width that a ranking / score category should take
     * 
     * 
     * @param {number} i The index of the score
     * @returns 
     */
    const getRepartition = (arr: () => number[], i: number, ranking: boolean=false) => {
        if (arr().every(n => n === 0)) return 0
        return (100 * (arr()[i] - (ranking ? [1, 0, -1][i] : 0)) / arr().reduce((a,b) => a + b));
    }


    /**
     * Get the relation between the profile of the user and yourself
     */
    const getRelation = () => {
        authFetch(`http://localhost:5000/api/v1/relation?id=${id()}&name=${name()}`)
        .then(rep => {
            if (rep.error) {
                throw rep.error;
            }

            setRelation(rep.data.status);
        });
    }


    /**
     * Get the comments of the user
     */
    const getComments = () => {
        fetch(`http://localhost:5000/api/v1/comments-user?id=${id()}&name=${name()}`)
        .then(rep => rep.json())
        .then(rep => {
            rep = rep.map((json: any) => {json.vote = json.upvote; return json}).sort((a:any,b:any) => a.vote + b.vote);
            setTotComments(rep.length);
            setPreviewComments(rep.slice(0,3));
            setAllComments(rep);
        });
    }


    // Change the relation
    const changeRelation = () => {

        // If the user isn't valid
        if (id() === undefined && name() === undefined) return;

        // Define the content that needs to be send
        const requestOptions: object = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(
                {
                    id: id(),
                    name: name(),
                }
            )
        }

        // Change the relation of the two users in the front
        setRelation(p => p % 2 === 1 ? p - 1 : p + 1)

        // Post to the back-end that we're changing the relation
        authFetch(`http://localhost:5000/api/v1/relation`, requestOptions)
    }


    // Get performances
    const getPerformances = (preview: boolean=false) => {
        authFetch(`http://localhost:5000/api/v1/performances?id=${id()}&preview=${preview}&page=${pagePerf()}&filter=` + encodeURIComponent(JSON.stringify(filterPerf())))
        .then(rep => {

            if (rep.error) {
                return;
            }

            const nbPages = rep.data[0]?.pages;

            const repProblem = rep.data.map(
                (d: any) => {
                    d["problem"] = problems()[d.problem_id]
                    delete d.pages;

                    return d;
                }
            );

            // Change data 
            if (preview) {
                console.log(repProblem)
                setPreviewPerf(repProblem);
            } else {
                setTotPerf(rep.data.length < 15 ? rep.data.length : nbPages * 15);
                setAllPerfs(rep.data);
                setMaxPage(nbPages);
            }
        });
    }

    // Get the personal data, like pfp, name, ranking etc.
    const getPersonalInformations = () => {

        let url = "http://localhost:5000/api/v1/profile";
        
        if (name() !== undefined && name() !== null) {
            url += "?name=" + name();
        } else if (id() !== undefined && id() !== null) {
            url += "?id=" + id();
        } else {
            // Shouldn't happen.
            throw new Error("Name and Id aren't valid.");
        }


        // Fetch the URL to get the information about the user
        fetch(url)
        .then(rep => rep.json())
        .then(rep => {
            // Basic info
            setBio(rep.bio);
            setName(rep.username);
            setPfp(rep.pfp);
            setBanner(rep.banner ?? defaultBanner);
            setCountry(rep.country);
            setDiscordId(rep.discord_id ?? 0);
            setDiscord(rep.discord ?? "");

            // Update ranking
            setRanking([rep.rank, rep.sameRank, rep.totUsers - rep.rank - rep.sameRank])

            // Update score
            setScore([rep.golf_score, rep.upgrade_score, rep.coop_score]);

            // Update total number of lang
            setTotLang(rep.totLang ?? 32)

            // Languages of the user
            const langs = Object
                .keys(rep)
                .filter(k => k.includes("_rank"))
                .map(l => l.split("_")[0])
                .sort((a,b) => rep[b+"_score"] - rep[a+"_score"]);

            // Set up the "Languages category"
            setLangJSON(
                langs.map((l) => {
                    return {
                        lang: formatLangTyped[l.toLowerCase()],
                        score: rep[l+"_score"],
                        color: colorLangTyped[l.toLowerCase().replace("cpp","c++").replace("js","javascript")   ],
                        rank: rep[l+"_rank"],
                    }
                })
            )
        });
    }
    
    // Consts
    const scoreCategories: string[] = ["Golf points", "Upgraded the answer", "Cooperation points"];
    const rankingCategories: (() => string)[] = [
        () => `People that have a better ranking than ${name()}`,
        () => `People that have the same ranking as ${name()}`,
        () => `${name()} has a better ranking than these people`
    ];


    // Style navigation button when hover
    const styleNavButton = (e: any, i: number) => {
        const {left, top, width, height} = e.target.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (navButtonRef[i] !== undefined) {
            navButtonRef[i]?.style.setProperty("--mouse-x", x+"px");
            navButtonRef[i]?.style.setProperty("--mouse-y", y+"px");
            navButtonRef[i]?.style.setProperty("--opacity-before", "1");
        }
    }

    // De-style navigation button when not hover
    const deStyleNavButton = (e: any, i: number) => {
        navButtonRef[i]?.style.setProperty("--opacity-before", "0");
    }


    /**
     * Get the activity of the user
     */
    const getActivity = () => {
        
        console.log(name());

        fetch(`http://localhost:5000/api/v1/activity?page=${pageActivity()}&filter=${encodeURIComponent(JSON.stringify({...filter(), name: name()}))}`)
        .then(rep => rep.json())
        .then(rep => {
            setMaxPageActivity(+rep[0].pages);
            setActivity(rep);
        });
    }




    createEffect(() => {
        console.log(filterPerf());
        getPerformances()
        console.log(langJSON());
    });


    //  On mount fetch data for profile
    onMount(() => {

        // Get all the problems
        fetch("http://localhost:5000/api/v1/problems?profile=true")
        .then(rep => rep.json())
        .then(rep =>
            setProblems(
                rep.reduce((acc: any, cur: any) => {
                    acc[cur.id] = cur.title;
                    return acc;
                },
                {})
            )
        );

        
        // If name and ID are undefined
        // If so, it's just our own profile
        if (name() === undefined && id() === undefined) {
            // Say that its your own profile
            setSelf(true);

            // Get the ID of the user
            authFetch("http://localhost:5000/api/v1/id")
            .then(
                rep => {
                    if (!rep.error) {
                        setId(rep.data.id);
                        getPersonalInformations();
                        getPerformances(true)
                        // Get the activity
                        setTimeout(getActivity, 100);
                        getComments();
                    }
                }
            );
        } else if (id() === undefined) {
            // Get the ID of the user
            fetch("http://localhost:5000/api/v1/id?name="+name())
            .then(rep => rep.json())
            .then(
                rep => {
                    setId(rep.id);
                    getPersonalInformations();
                    getPerformances(true)
                    // Get the activity
                    setTimeout(getActivity, 100);
                    getComments();
                }
            );
        } else {
            getPersonalInformations();
            getPerformances(true);
            getRelation();
            // Get the activity
            setTimeout(getActivity, 100);
            getComments();
        }
    });




    return <section class="Profile">
        <header>

            {/* Banner */}
            <div
                class="banner"
                style={{"background-image": `url('${banner()}'`}}
            />

            {/* Profile picture */}
            <div class="pfp-div">
                <div class="pfp-content">
                    <img src={pfp() ?? userPfp}/>
                </div>
            </div>

            {/* Pannel */}
            <section class="pannel">
                {/* Top section */}
                <div class="top">
                    {
                        country().toLowerCase() === 'xx' ?
                            <div/>:
                            <div class="country">
                                <img src={`src/assets/icons/flags/${country().toLowerCase()}.svg`}/>
                            </div>
                    }
                    <Show when={self()}>
                        <A href="/settings" class="self">
                            Edit
                            <img src='src/assets/icons/edit.svg'/>
                        </A>
                    </Show>
                </div>

                {/* Middle */}
                <div class="middle">
                    <button
                        class="discord"
                        style={
                        {
                            opacity: discord() ? "1" : '0',
                            'max-height': discord() ? "" : '0px',
                            'margin-top': discord() ? "" : '-15px',
                        }}
                    >
                        <Show when={discord() !== ""}>
                            <a href={"https://discordapp.com/users/" + discordId()}>
                                <img src="src/assets/icons/discord.svg"/>
                                <span>{discord().split("#").slice(0,-1).join("#")}</span>
                                <span class="tag">#{discord().split("#").slice(-1)[0]}</span>
                            </a>
                        </Show>
                    </button>
                    <span class="name">{name()}</span>
                    <Switch>
                        {/* If it's your profile */}
                        <Match when={self() || relation() === -1}>
                            <button onclick={changeRelation}>
                                <img src="src/assets/icons/mirror.svg"/>
                                <span>
                                    Hey, it's you!
                                </span>
                            </button>
                        </Match>
                        {/* No relation */}
                        <Match when={relation() === 0}>
                            <button
                                style={{
                                    background: "hsl(0, 0%, 57%)"
                                }}
                                onclick={changeRelation}
                            >
                                <img src="src/assets/icons/follow.svg"/>
                                <span>
                                    Nothing
                                </span>
                            </button>
                        </Match>
                        {/* You're following */}
                        <Match when={relation() === 1}>
                            <button
                                style={{
                                    background: "hsl(20, 60%, 50%)"
                                }}
                                onclick={changeRelation}
                            >
                                <img src="src/assets/icons/watching.svg"/>
                                <span>
                                    Following
                                </span>
                            </button>
                        </Match>
                        {/* You are followed. (Watch out!) */}
                        <Match when={relation() === 2}>
                            <button
                                style={{
                                    background: "hsl(357, 60%, 50%)"
                                }}
                                onclick={changeRelation}
                            >
                                <img src="src/assets/icons/heart.svg"/>
                                <span>
                                    Followed
                                </span>
                            </button>
                        </Match>
                        {/* You are friends */}
                        <Match when={relation() === 3}>
                            <button
                                style={{
                                    background: "hsl(140, 60%, 50%)"
                                }}
                                onclick={changeRelation}
                            >
                                <img src="src/assets/icons/friends.svg"/>
                                <span>
                                    Friends
                                </span>
                            </button>
                        </Match>
                    </Switch>
                </div>

                {/* Bio */}
                <aside class="bio">
                    {bio()}
                </aside>

                {/* Bottom */}
                <nav>
                    <Index
                        each={["Friends", "Information", "Activity"]}
                        fallback={<button>Loading...</button>}
                    >
                        {
                            (c,i) => <button
                                ref={el => navButtonRef[i] = el}
                                onMouseLeave={(e) => deStyleNavButton(e, i)}
                                onMouseMove={(e) => styleNavButton(e, i)}
                                onClick={() => setTab(i)}
                            >
                                {c()}
                            </button>
                        }
                    </Index>
                </nav>
            </section>
        </header>



        {/* Depend on the tab */}
        <Switch>
            <Match when={tab() === 0}>
                <FriendList
                    name={name()}
                    id={id()}
                />
            </Match>
            <Match when={tab() === 1}>
                <main class="info">

                    {/* Left part */}
                    <section class="part">

                        {/* Score */}
                        <span class="title">
                            <h1>Score</h1><h2> - {formatNumber(score().reduce((a,b) => a + b))} points</h2>
                        </span>
                        <div class="line"/>
                        
                        {/* Graph for score */}
                        <div class="graph">
                            <Index each={score()}>
                                {
                                    (s, i) => <div
                                        class={"color" + (1 + i) }
                                        style={{width: getRepartition(score, i) +"%"}}
                                    />
                                }
                            </Index>
                        </div>

                        {/* Sub graph with % */}
                        <div class="sub-graph">
                            <Index each={score()}>
                                {
                                    (s, i) => {

                                        return <span
                                            style={{width: getRepartition(score, i) + "%", "max-width": 'calc(100% - 100px)', "min-width": "50px"}}
                                        >
                                            {getRepartition(score, i).toFixed(2)}%
                                        </span>
                                    }
                                }
                            </Index>
                        </div>

                        {/* Description of the graph */}
                        <div class="description-graph">
                            <Index each={scoreCategories}>
                                {
                                    (title, i) => <div
                                        class="description"
                                    >
                                        <div class={"color color" + (i+1)}/>
                                        <span>{title()}</span>
                                    </div>
                                }
                            </Index>
                        </div>


                        {/* Language */}
                        <span class="title">
                            <h1>Language</h1><h2> - {langJSON().length}/{totLang()} </h2>
                        </span>
                        <div class="line"/>
                        <div class="content-lang">
                            <For each={langJSON()} fallback={<div>No languages</div>}>
                                {
                                    l => <>
                                        <div class="lang">
                                            <img src={`src/assets/icons/${l.lang.replace("#","s").toLowerCase()}.svg`}/>
                                            <span><h1>{l.lang}</h1><h2>&nbsp;- [{l.rank}]</h2></span>
                                        </div>
                                        <div class="graph-lang">
                                            <div style={{
                                                width: (100 * l.score / langJSON().map(l=>l.score).reduce((a,b) => a+b)) + "%",
                                                "background-color": l.color
                                            }}>
                                                <Show when={ 0.15 < l.score / langJSON().map(l=>l.score).reduce((a,b) => a+b)}>
                                                    {
                                                        (100 * l.score / langJSON().map(l=>l.score).reduce((a,b) => a+b)).toFixed(2) + "%"
                                                    }
                                                </Show>
                                            </div>

                                            <span class="percent-right">
                                                <Show when={ 0.15 > l.score / langJSON().map(l=>l.score).reduce((a,b) => a+b)}>
                                                    {
                                                        (100 * l.score / langJSON().map(l=>l.score).reduce((a,b) => a+b)).toFixed(2) + "%"
                                                    }
                                                </Show>
                                            </span>
                                        </div>
                                    </>
                                }
                            </For>
                        </div>
                    </section>

                    {/* Right part */}
                    <section class="part">
                        <span class="title">
                            <h1>Global ranking</h1><h2> - {formatNumber(ranking()[0])}/{formatNumber(ranking().reduce((a,b) => a + b))} </h2>
                        </span>
                        <div class="line"/>

                        {/* Graph for score */}
                        <div class="graph">
                            <Index each={ranking()}>
                                {
                                    (s, i) => <Show when={(i !== 1 || s() > 0)}>
                                    <div
                                        class={"color" + (1 + i) }
                                        style={{width: getRepartition(ranking, i, true) + "%"}}
                                    />
                                    </Show>
                                }
                            </Index>
                        </div>

                        {/* Sub graph with % */}
                        <div class="sub-graph">
                            <Index each={ranking()}>
                                {
                                    (s, i) =>  <Show when={(i !== 1 || s() > 0)}><span
                                        style={{width: getRepartition(ranking, i, true) +"%"}}
                                    >
                                        {Math.round(getRepartition(ranking, i, true))}%
                                    </span>
                                    </Show>
                                }
                            </Index>
                        </div>

                        {/* Description of the graph */}
                        <div class="description-graph">
                            <Index each={rankingCategories}>
                                {
                                    (title, i) => <Show when={(i !== 1 || ranking()[1] > 0)}>
                                        <div
                                            class="description"
                                        >
                                            <div class={"color color" + (i+1)}/>
                                            <span>{title()()}</span>
                                        </div>
                                    </Show>
                                }
                            </Index>
                        </div>


                        {/* Best performances */}
                        <span class="title">
                            <h1>Best performances</h1><h2> - {totPerf()} </h2>
                        </span>
                        <div class="line"/>
                        <div class="best-perf-preview">
                            <Index each={previewPerf()}>
                                {
                                    (perf, i) => <div
                                        class="perf"
                                    >
                                        <div
                                            class={"rank-icon " + rankToClass(perf().rank)}
                                        >
                                            <img src={`src/assets/icons/${perf().lang.toLowerCase().replace("#","s")}_white.svg`}/>
                                        </div>
                                        <div class="perf-info">
                                            <div class="problem-title">
                                                {perf().problem}
                                            </div>
                                            <div class="perf-rank">
                                                <b>Rank</b>: {perf().rank}/{perf().nb_players} ({perf().size} byte{perf().size === 1 ? "" : "s"})
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Index>
                        </div>
                        <Show when={totPerf() > 3}>
                            <span class="show-more" onclick={() => setShowPerf(true)}>Show more performances</span>
                        </Show>


                        {/* Best Comments */}
                        <span class="title">
                            <h1>Best comments</h1><h2> - {totComments()} </h2>
                        </span>
                        <div class="line"/>
                        <div class="best-comments-preview">
                            <Index each={previewComments()}>
                                {
                                    (comment, i) => <div
                                        class="comment"
                                    >
                                        <div class="vote">
                                            <img src={`src/assets/icons/upvotewhite.svg`}/>
                                            {comment().vote}
                                        </div>
                                        <span>
                                            {comment().content}
                                        </span>
                                    </div>
                                }
                            </Index>
                        </div>
                        <Show when={totComments() > 3}>
                            <span class="show-more" onclick={() => setShowCom(true)}>Show more comments</span>
                        </Show>
                    </section>
                </main>
            </Match>
            <Match when={tab() === 2}>
                <main class="activity">
                    <SearchData
                        preview={[{
                            lang: "Python",
                            problem: (activity() as any)[0]?.problem,
                        }]}
                        title="Activity"
                        data={activity()}
                        Comp={FormatActivity}
                        currentFilter={filter()}
                        changeFilter={setFilter}
                        resfreshData={getActivity}
                        updatePage={setPageActivity}
                        nbPages={maxPage()}
                    />
                </main>
            </Match>
        </Switch>

        <Show when={showCom()}>
            <SearchData
                preview={previewComments()}
                hide={() => setShowCom(false)}
                title="All comments"
                data={allComments()}
                Comp={CommentFormat}
                currentFilter={filterComments()}
                changeFilter={setFilterComments}
                resfreshData={getComments}
                updatePage={(setPagePerf)}
                nbPages={1}
            />
        </Show>

        <Show when={showPerf()}>
            <SearchData
                preview={previewPerf()}
                hide={() => setShowPerf(false)}
                title="All performances"
                data={allPerfs()}
                Comp={PerformanceFormat}
                currentFilter={filterPerf()}
                changeFilter={setFilterPerf}
                resfreshData={getPerformances}
                updatePage={setPagePerf}
                nbPages={maxPage()}
            />
        </Show>
    </section>;
}



export default Profile;