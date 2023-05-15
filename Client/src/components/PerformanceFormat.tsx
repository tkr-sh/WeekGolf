import capitalize from "../utils/capitalize";
import rankToClass from "../utils/rankToClass";
import { createSignal, JSX, Show } from 'solid-js';
import MonacoEditor from "./IDE";

interface PerformanceFormatProps {
    lang: string,
    rank: number,
    nb_players: number,
    size: number,
    problem: number,
    id: number
}


const PerformanceFormat = (props: PerformanceFormatProps) => {
    const [showCode, setShowCode] = createSignal(false);
    const [code, setCode] = createSignal('', {equals: false});
    let articleRef: undefined | HTMLElement;


    // Get the code
    const getCode = () => {
        if (code().length < 1) {
            fetch('http://localhost:5000/api/v1/solution?id='+props.id)
            .then(rep => rep.json())
            .then(rep => setCode(rep.code))
            .then(() =>  setShowCode(p => !p));
        } else {
            setShowCode(p => !p);
        }
    }

    // Style article when hover
    const styleArticle = (e: any) => {
        const {left, top, width, height} = e.target.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (articleRef !== undefined) {
            articleRef?.style.setProperty("--mouse-x", x+"px");
            articleRef?.style.setProperty("--mouse-y", y+"px");
            articleRef?.style.setProperty("--opacity-before", "1");
        }
    }

    // De-style article when not hover
    const deStyleArticle = (e: any) => {
        articleRef?.style.setProperty("--opacity-before", "0");
    }
    

    return <>
        <article
            class="PerformanceFormat"
            ref={articleRef}
            onMouseLeave={(e) => deStyleArticle(e)}
            onMouseMove={(e) => styleArticle(e)}
            onClick={() => {getCode()}}
        >
            <div class="main-info">
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
            </div>
        </article>
        <Show when={showCode()}>
            <MonacoEditor
                readonly={true}
                lang={props.lang}
                code={code()}
                fontSize={20}
                style={{
                    'min-height': `${code().split('\n').length * 30}px`,
                    'height': `${code().split('\n').length * 30}px`,
                    'overflow': "hidden",
                    'border-radius': "5px",
                    width: "calc(100% + 20px)",
                }}
            />
        </Show>
    </>
}

export default PerformanceFormat;