import { createSignal, For, onCleanup, onMount } from "solid-js";
import "../style/PickLang.scss";
import colorLang from "../data/colorLang.json";
import { isAlpha } from "../utils/is";

const PickLang = (props: any) => {
    const [langs, setLangs] = createSignal<string[]>([]);
    const [search, setSearch] = createSignal<string>("");


    const handleKey = (e: any) => {
        if (isAlpha(e.key) && e.key.length === 1) {
            setSearch(p => p + e.key.toLowerCase());
        }

        if (e.key === 'Backspace') {
            setSearch(p => p.slice(0, -1));
        }

        if (e.key === 'Enter') {
            // Change the lang
            if (search().length === 0 || langs().filter(l => l.includes(search())).length === 0) {
                props.setLang('python');
                console.log(search())
                console.log(langs())
            } else {
                props.setLang(langs().filter(l => l.includes(search()))[0]);
                console.log(search())
                console.log(langs())
            }


                
            setTimeout(props.hide, 100)
        }
    }  

    // on Mount
    onMount(() => {
        fetch("http://localhost:5000/api/v1/languages")
        .then(rep => rep.json())
        .then(rep => {
            setLangs(
                rep
                .map((l: {[key: string]: string}) => l.lang)
                .sort()
            );
        });

        window.addEventListener("keydown", handleKey);
    })


    // On Clean up
    onCleanup(() => {
        window.removeEventListener("keydown", handleKey);
    });


    return <>
        <div
            class="background-shadow"
            onClick={props.hide}
        />
       <div class="PickLang">
            <h1>
                Change of language
            </h1>
            <div class="search">
                {search()}
            </div>
            <main class="pick-lang">
                <For each={langs().filter(l => l.includes(search()))}>
                {
                    lang =>
                    <button onclick={() => {props.setLang(lang); props.hide()}}>
                        <div
                            class="bg"
                            style={{
                                'background-color': (colorLang as {[key: string]: string})[lang.toLowerCase()]
                            }}
                        />
                        <img src={`src/assets/icons/${lang}.svg`} class="color"/>
                        <img src={`src/assets/icons/${lang}_white.svg`} class="white"/>
                    </button>
                }
                </For>
            </main>
        </div>     
    </>
}

export default PickLang;