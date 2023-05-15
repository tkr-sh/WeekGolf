import { Index, createSignal, onMount } from "solid-js";
import "../style/History.scss";
import MonacoEditor from "./IDE";
import createAuth from "../hooks/createAuthFetch";


const History = ({hide, id, lang}: any) => {

    const {token, authFetch} = createAuth();
    const [solutions, setSolutions] = createSignal<any>([]);
    const [selected, setSelected] = createSignal(0);
    
    onMount(() => {
        // authFetch(`http://localhost:5000/api/v1/history?id=${id}&lang=${lang}`)
        authFetch(`http://localhost:5000/api/v1/history?id=${id}&lang=${encodeURIComponent(lang)}`)
        .then(rep => {
            if (rep.error) {
                return;
            }

            setSolutions( rep.data.sort((a: any, b: any) => a.size - b.size));
        });
    });


    return <>
        <div class="shadow" onclick={() => {hide(); console.log("shadow")}}/>
        <section class="History">
            <h1>History</h1>
            <div>
                <aside>
                    <Index each={solutions()} fallback={"No solutions."}>
                    {
                        (s, i) => <button onclick={() => setSelected(i)}>
                            SOL N°{solutions().length - i}
                        </button>
                    }
                    </Index>
                </aside>
                <main>
                    <MonacoEditor
                        lang={lang}
                        code={((solutions()[selected()] ?? {}) as {[key: string]: string})?.code}
                        style={{
                            height: '100%',
                            'border-radius': '10px',
                            "overflow": "hidden"
                        }}
                        bgColor="--darken-bg-color-2"
                        readonly={true}
                        setValueIde={true}
                        showByte={true}
                    />
                </main>
            </div>
        </section>
    </>;
}




export default History;