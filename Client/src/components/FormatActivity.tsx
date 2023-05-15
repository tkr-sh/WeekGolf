import capitalize from "../utils/capitalize";
import rankToClass from "../utils/rankToClass";
import colorLang from "../data/colorLang.json";
import formatLang from "../data/formatLang.json";
import { createSignal, For, JSX, Show } from 'solid-js';
import info from "../assets/icons/info.svg";
import { A } from "@solidjs/router";

interface FormatProps {
    lang: string | undefined | null,
    problem: number,
    major: number,
    bytes: number,
    id: number,
    title: string,
    content: string,
    owner_id: number,
}

const formatName: {[key: string]: string} = {
    "activity_date": "Date",
    "lang": "Language",
    "points": "Points",
    "bytes": "New size",
    "old_bytes": "Previous size",
    "username": "User",
    "previous_user": "Previous user",
    "problem": "Problem"
}


const FormatActivity = (props: FormatProps) => {
    let articleRef: undefined | HTMLAnchorElement;
    const infos: (string | null)[] = Object.keys(props).filter(k => !["content", "old_user_id", "title", "major", "id", "pages", "owner_id", "problem_id"].includes(k));


    // Style article when hover
    const styleArticle = (e: any) => {
        const {left, top, width, height} = e.target.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (articleRef !== undefined) {
            articleRef?.style.setProperty("--mouse-x", x+"px");
            articleRef?.style.setProperty("--mouse-y", y+"px");
            articleRef?.style.setProperty("--opacity-before", "1");

            if (props.major === 2)
                articleRef?.style.setProperty("--lang-color", (colorLang as {[key: string]: string})[props?.lang?.toLowerCase() ?? "python"] + "A0");
        }
    }

    // De-style article when not hover
    const deStyleArticle = (e: any) => {
        articleRef?.style.setProperty("--opacity-before", "0");
    }
    

    return <>
        <A
            class="FormatActivity"
            ref={articleRef}
            href={"/profile?id=" + props.owner_id}
            onMouseLeave={(e) => deStyleArticle(e)}
            onMouseMove={(e) => styleArticle(e)}
        >
            <aside
                class={"lang-icon" + (props.major === 1 ? " up" : "")}

                style={
                    props.major === 2 ?    
                    {
                        'background-color': (colorLang as {[key: string]: string})[props?.lang?.toLowerCase() ?? "python"]
                    } :
                    {

                    }
                }
            >
                {
                    props.lang !== 'undefined' && props.lang !== undefined && props.lang !== null ?
                    <img
                        src={`src/assets/icons/${props?.lang.toLowerCase().replace("#","s")}_white.svg`}
                        title={capitalize(props?.lang)}
                        alt={capitalize(props?.lang)}
                    /> :
                    <img
                        src={info}
                        title="Info"    
                        alt="Info"
                    />
                }
            </aside>

            <main class={"best" + (localStorage.getItem("activityRow") === 'true' ? ' row' : "") + (props.major === 1 ? " upgrade" : "")}>
                <div class="txt-info">
                    <h2>
                    {
                        props.title
                    }
                    </h2>
                    <h3>
                        {props.content}
                    </h3>
                </div>
                <div class="info">
                    <For each={infos as (keyof FormatProps)[]}>
                    {
                        (c: keyof FormatProps) => c !== null &&
                        c in props &&
                        props[c] !== null &&
                        props[c] !== undefined && <div>
                            <b>
                                {
                                    c in formatName ?
                                    formatName[c] :
                                    c
                                }
                            </b>:
                            <span> </span>
                            {
                                c === 'lang' ?
                                (formatLang as {[key: string]: string})[props[c]?.toLowerCase() ?? 'python'] :
                                c.toString() === "activity_date" ?
                                new Date(props[c]).toISOString().slice(0, 19).replace('T', ' ') :
                                props[c]
                            }
                        </div>
                                                
                    }
                    </For>

                </div>
            </main>

            {/* <div class="main-info">
                <div class={"lang-icon " + rankToClass(props.rank)}>
                    <img
                        src={`src/assets/icons/${props.lang.toLowerCase().replace("#","s")}_white.svg`}
                        title={capitalize(props.lang)}
                        alt={capitalize(props.lang)}
                    />
                </div>
                <div class="txt-info">
                    <h2>{props.problem}</h2>
                    <h3>Rank: {props.rank}/{props.nb_players}</h3>
                </div>
            </div>

            <div class="bytes">
                <h2>
                {
                    props.size
                }
                </h2>

                bytes
            </div> */}
        </A>
    </>
}

export default FormatActivity;