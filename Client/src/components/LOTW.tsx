import { For, Show, createSignal } from "solid-js";
import "../style/LOTW.scss";
import description from '../data/description.json';
import formatLang from "../data/formatLang.json"
import CodeBlock from "./CodeBlock";
import MonacoEditor from "./IDE";


const formatLangTyped: {[key: string]: string} = formatLang;
const descriptionTyped: {[key: string]: any} = description;

interface LOTWProps {
    hide: () => void,
    lotw: string,
    changeLang: (arg0: string) => void,
}


const LOTW = (props: LOTWProps) => {
    const [selectedLang, setSelectedLang] = createSignal<string>(props.lotw);


    return <>
         <Show when={props.hide !== null && props.hide !== undefined}>
            <div
                class="background-shadow"
                onClick={props.hide}
            />
        </Show>
        <div class="content-lotw">
            <nav>
                <h1>Languages</h1>
                <ul>
                <For each={Object.keys(description)}>
                {
                    l => <li
                        class={props.lotw.toLowerCase() === l.toLowerCase() ? "lotw" : ""}
                        onclick={() => setSelectedLang(l.toLowerCase())}    
                    >
                        <img src={`src/assets/icons/${l.toLowerCase().replace("#","s")}_white.svg`}/>
                        {l}
                    </li>
                }
                </For>
                </ul>
            </nav>
            <main>
                {/* Title */}
                <h1>{formatLangTyped[selectedLang().toLowerCase()]}</h1>

                {/* History */}
                <h2>History</h2>
                <div class="line"/>
                <p
                    innerHTML={
                        descriptionTyped[
                            formatLangTyped[
                                selectedLang().toLowerCase()
                            ]
                        ]
                        .history
                        .replaceAll("\n", "<span class='spacer'></span>")
                    }
                />

                {/* Characteristics */}
                <h2>Characteristics</h2>
                <div class="line"/>
                <ul
                    innerHTML={
                        "<li>" + 
                        descriptionTyped[
                            formatLangTyped[
                                selectedLang().toLowerCase()
                            ]
                        ]
                        .characteristics
                        .slice(2)
                        .split("\n-")
                        .join("</li><li>")
                        + "</li>"
                    }
                />


                {/* Program */}
                <h2>Program</h2>
                <div class="line"/>
                <MonacoEditor
                    code={
                        descriptionTyped[
                            formatLangTyped[
                                selectedLang().toLowerCase()
                            ]
                        ]
                        .program
                    }
                    bgColor="--darken-bg-theme-color"
                    style={{
                        height: "200px",
                        "margin-top": "10px",
                        "border-radius": "10px",
                        overflow: "hidden"
                    }}
                    lang={selectedLang().toLowerCase().replace("#","s")}
                    setValueIde={true}
                />

                <button
                    onclick={() => {
                        props.changeLang(selectedLang());
                        props.hide()
                    }}
                >
                    Golf in this language!
                </button>
            </main>
        </div>
    </>
}


export default LOTW;