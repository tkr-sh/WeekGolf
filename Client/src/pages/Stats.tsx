import { For, Index, Show, createEffect, createSignal, onMount } from "solid-js";
import "../style/Stats.scss"
import { A } from "@solidjs/router";
import MonacoEditor from "../components/IDE";
import "../utils/uniq";
import formatLang from "../data/formatLang.json"



interface PointsType {
    size: number,
    code: string,
    name: string,
}



const Stats = () => {

    // Solutions infos
    const [minSize, setMinSize] = createSignal<number>(0, {equals: false});
    const [maxSize, setMaxSize] = createSignal<number>(1, {equals: false});
    const [points, setPoints] = createSignal<PointsType[]>([], {equals: false});
    const [selectedSolution, setSelectedSolution] = createSignal<number>(0, {equals: false});
    // List of fields
    const [list, setList] = createSignal<any>({Users: [], Languages: [], Problems: []}, {equals: false});
    const [name, setName] = createSignal<string | null>(null, {equals: false});
    const [lang, setLang] = createSignal<string>("python", {equals: false});
    const [problem, setProblem] = createSignal<string>("", {equals: false});
    // Filter of theses items
    const [filter, setFilter] = createSignal({Languages: "", Problems: "", Users: ""}, {equals: false});
    // Style 
    const [hue, setHue] = createSignal<number>(parseInt(localStorage.getItem("color-theme") ?? '0') ?? parseInt(
        getComputedStyle(document.documentElement)
        .getPropertyValue("--hue")
        .split('deg')[0]
        .split('(')[1]
    ));



    onMount(() => {
        // Get users
        fetch("http://localhost:5000/api/v1/users")
        .then(rep => rep.json())
        .then(rep => {
            setList(p => {
                p["Users"] = ["GLOBAL 🌎", ...rep.map((l: {[key: string]: string}) => l.username)];

                return p;
            });
        });


        // Get languages
        fetch("http://localhost:5000/api/v1/languages")
        .then(rep => rep.json())
        .then(rep => {
            setList(p => {
                p["Languages"] = rep.map((l: {[key: string]: string}) => l.lang).sort();
                return p;
            });
        });

        // Get problem
        fetch("http://localhost:5000/api/v1/problems?profile=true")
        .then(rep => rep.json())
        .then(rep => {
            setList(p => {
                p["Problems"] = rep.sort((a: any, b:any) => a.id + b.id).slice(1).map((l: {[key: string]: string}) => l.title)
                setProblem(p['Problems'][0]);
                return p;
            });
        });
    });



    createEffect(() => {
        fetch(`http://localhost:5000/api/v1/code-stats?user=${name()}&problem=${encodeURIComponent(problem())}&lang=${encodeURIComponent(lang())}`)
        .then(rep => rep.json())
        .then(rep => {
            // If the size is correct
            if (rep.length > 0){
                setMaxSize(rep[0]?.size);
                setMinSize(rep.slice(-1)[0]?.size);
                setTimeout(() => {
                    setSelectedSolution(Math.max(rep.length - 1, 0));
                    setPoints(rep);
                }, 100);
            } else {
                setSelectedSolution(Math.max(rep.length - 1, 0));
                setPoints(rep);
            }
        })
        .catch((err) => console.error("An error occured while trying to get the code. " + err));
    });




    return <section class="Stats">
        <Show when={points().length > 0}>
        <main class="graph">
            <aside>
            <For each={[...Array(7).keys()]}>
            {
                i => <span>
                    {Math.round(minSize() * i / 6 + maxSize() * (6-i) / 6)}
                </span>
            }
            </For>
            </aside>
            <main>
                <div class="x-axis"/>
                <div class="y-axis"/>

                {/* Lines for the graph */}
                <For each={[...Array(5).keys()]}>
                {
                    i => <div class="bar" style={{bottom: `${-~i*100/6}%`}}/>
                }
                </For>

                {/* Points */}
                <Index each={points()}>
                {
                    (p, i) => 
                        <button
                            class='point'
                            style={{
                                left: (i / ~-points().length * 100) + "%",
                                bottom: ((p().size - minSize()) / (maxSize() - minSize()) * 100) + "%",
                                'background-color':
                                    name() !== null ?
                                    "" :
                                    `hsl(${
                                        points()
                                        .map(n => n.name)
                                        .uniq()
                                        .indexOf(p().name) * 40
                                        + 

                                        hue()
                                        }, 60%, 50%)`
                            }}
                            
                            onClick={() => setSelectedSolution(i)}
                        />
                }
                </Index>
            </main>
        </main>



        {/* The section with the code */}
        <section class="code">
            {/* Previous */}
            <Show when={selectedSolution()}>
                <button class="previous" onclick={() => setSelectedSolution(p => p - 1)}>Previous</button>
            </Show>

            {/* Next */}
            <Show when={selectedSolution() !== points().length - 1}>
                <button class="next" onclick={() => setSelectedSolution(p => p + 1)}>Next</button>
            </Show>

            {/* Solution */}
            <h1>
                Solution N°{1 + selectedSolution()} by {""}
                <A href={`/profile?name=${points().length > selectedSolution() ? points()[selectedSolution()]?.name : ''}`}>
                    {points().length > selectedSolution() ? points()[selectedSolution()]?.name : "Nobody"}
                </A>
                {""} with {points().length > selectedSolution() ? points()[selectedSolution()].size : 0}bytes
            </h1>

            {/* Monaco */}
            <MonacoEditor
                lang={lang().toLowerCase()}
                code={points().length > selectedSolution() && selectedSolution() >= 0 ? points()[selectedSolution()]?.code : ""}
                bgColor="--darken-bg-color-2"
                style={{
                    height: "300px",
                    width: "90%",
                    "margin-left": "5%",
                    "border-radius": "5px",
                    "overflow": "hidden"
                }}
                setValueIde={true}
                readonly={true}
            />
        </section>
        </Show>



        {/* The parameters section */}
        <section class="parameters">
            <For each={["Users", "Languages", "Problems"]}>
            {
                c => <section>
                    <h1>{c}</h1>
                    <input
                        placeholder={c.slice(0,-1) + "..."}
                        onKeyDown={(e) => setFilter(p => {(p as any)[c] = e.currentTarget.value; return p})}
                    />
                    <ul>
                        <For
                            each={
                                (list() ??  {})[c]
                                .filter((e: string) => {
                                    return e.toLowerCase().includes((filter() as any)[c].toLowerCase())
                                })
                            }
                            fallback={"..."}
                        >
                        {
                            e => <li
                                onClick={() => {
                                    switch (c) {
                                        case "Users":
                                            setName(e === "GLOBAL 🌎" ? null : e)
                                            break;
                                        case "Languages":
                                            setLang(e)
                                            break;
                                        case "Problems":
                                            setProblem(e)
                                            break;
                                    }
                                }}
                                class={(() => {
                                    switch (c) {
                                        case "Users":
                                            return name() === e || (name() === null && e === "GLOBAL 🌎");
                                        case "Languages":
                                            return lang() === e;
                                        case "Problems":
                                            return problem() === e;
                                        default:
                                            return false
                                    }
                                })().toString()}
                            >
                                {c === "Languages" ? (formatLang as {[key: string]: string})[e] : e}
                            </li>
                        }
                        </For>
                    </ul>
                </section>
            }
            </For>
            {/* <section>
                <h1>Users</h1>
            </section>
            <section>
                <h1>Language</h1>
            </section>
            <section>
                <h1>Problem</h1>
                
            </section> */}
        </section>
    </section>;
}





export default Stats;