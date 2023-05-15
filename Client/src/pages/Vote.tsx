import { Component, createSignal, For, Match, onMount, Switch, useContext } from 'solid-js';
import "../style/Vote.scss";
import send from "../assets/icons/paper_plane.svg";
import createAuth from '../hooks/createAuthFetch';
import colorLang from '../data/colorLang.json';
import { darkenColor } from '../utils/darkenRGB';
import capitalize from '../utils/capitalize';
import question from '../assets/icons/question.svg';
import formatLang from '../data/formatLang.json';
import Timer from '../components/Timer';
import { DisplayMessageContext, DisplayMessageProviderType } from '../hooks/createDisplayMessage';

const colorLangTyped: {[key: string]: string} = colorLang;
const formatLangTyped: {[key: string]: string} = formatLang;


interface languageType {
    lang: string,
    upvote?: number,
}


const Vote: Component = () => {
    const [phase, setPhase] = createSignal<number>(1);
    // const [languages, setLanguages] = createSignal<languageType[]>(Object.keys(colorLang).map(r =>{return{lang: r, upvote: Math.floor(Math.random() * 100)}})); 
    const [languages, setLanguages] = createSignal<languageType[]>([]); 
    const [votedLanguage, setVotedLanguages] = createSignal<string[]>([], {equals: false}); 
    const [timeRemaining, setTimeRemaining] = createSignal(0, {equals: false});
    let inputRef: HTMLInputElement | undefined;
    const {token, authFetch} = createAuth();

    const { handleError } = useContext(DisplayMessageContext) as DisplayMessageProviderType;


    const getPhase = () => {

        fetch("http://localhost:5000/api/v1/phase")
        .then(rep => rep.json())
        .then(rep => {
            setPhase(rep.phase);
            setLanguages(rep.languages);
            setTimeRemaining(Math.floor((Date.parse(rep.timeRemaining) - new Date().getTime()) / 1000));

            if (rep.phase > 1 && rep.phase < 4 && token() !== null) {
                authFetch("http://localhost:5000/api/v1/personnal-upvotes")
                .then(rep => {
                    if (rep.error) {
                        return;
                    }

                    console.log(rep)

                    setVotedLanguages(rep.data);
                    console.log(votedLanguage());
                })
            }
        });
        
    }

    onMount(() => {
        getPhase();
    });


    /**
     * @brief Handle the submit for phase one, to submit a language
     * 
     * @param e The event
     */
    const handleSubmit = (e: any) => {

        e.preventDefault()

        const requestOptions: object = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({lang: inputRef?.value})
        }

        authFetch(`http://localhost:5000/api/v1/submit-language`, requestOptions)
        .then(rep => {
            if (!rep.error) {
                setLanguages(arr => [...arr, {lang: inputRef?.value as string}])
            }
        });

    }


    const voteLanguage = (lang: string) => {

        // When you vote on phase 3, you can't vote for more than 1 language
        if (phase() === 3) {
            const languageAlreadyVoted = votedLanguage().includes(lang);

            votedLanguage().map(
                votedLang => 
                setLanguages(obj =>
                    obj
                    .map(l =>
                        l.lang.toLowerCase() === votedLang.toLowerCase() && votedLang !== lang?
                        {lang: l.lang, upvote: (l.upvote ?? 0) -  1} :
                        l
                    )
                )
            );

            setVotedLanguages(languageAlreadyVoted ? [lang] : []);
        }

        // Handle the update of the score in the front
        if (votedLanguage().includes(lang)) {
            setVotedLanguages(arr => arr.filter(l => l !== lang));
            setLanguages(obj => obj.map(l => l.lang.toLowerCase() !== lang.toLowerCase() ? l : {lang: l.lang, upvote: (l.upvote ?? 0) -  1}))
        } else {
            setVotedLanguages(arr => [...arr, lang]);
            setLanguages(obj => obj.map(l => l.lang.toLowerCase() !== lang.toLowerCase() ? l : {lang: l.lang, upvote: (l.upvote ?? 0) +  1}))
        }

        // Send request to the back
        //// Request options
        const requestOptions: object = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({lang: lang})
        }

        //// Send the request
        authFetch(`http://localhost:5000/api/v1/vote-language`, requestOptions)
        .then(rep => {
        });
    }

    return (
        <section class={
            "Vote" +
            (phase() > 2 ? " light" : "") +
            (+(localStorage.getItem('layout')  ?? '0')< 3 ? " header" : '')
        }>
            <header>Phase {phase()}</header>

            <Timer
                time={timeRemaining()}
            />

            <main class={"phase" + phase()}>
            <Switch>
                <Match when={phase() === 1}>
                    <form onsubmit={handleSubmit}>
                        <input
                            class="add-lang"
                            type='text'
                            placeholder='Add a language...'
                            ref={inputRef}
                        />
                        <button
                            type="submit"
                        >
                            <img src={send}/>
                        </button>
                    </form>
                    <ul>
                        <For each={languages()} fallback={<span>No languages for now.</span>}>
                        {
                            lang => <li class="lang phase1">
                                {
                                    (() => {
                                        console.log(colorLangTyped)
                                        console.log(lang.lang in colorLangTyped)
                                        console.log(lang.lang)
                                        return ''
                                    })()
                                }
                                <header
                                    style={{
                                        "background-color": darkenColor(lang.lang.toLowerCase() in colorLangTyped ? colorLangTyped[lang.lang.toLowerCase()] : "#444444", 0.2)
                                    }}
                                >
                                    <div
                                        class="circle-lang"
                                        style={{
                                            "background-color": lang.lang.toLowerCase() in colorLangTyped ? colorLangTyped[lang.lang.toLowerCase()] : "#444444"
                                        }}
                                    >
                                        <img
                                            src={`src/assets/icons/${lang.lang.toLowerCase().replace("#","s").replace("><>", "fish")}_white.svg`}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = question;
                                            }}    
                                        />
                                    </div>
                                    {lang.lang in formatLangTyped ? formatLangTyped[lang.lang] : capitalize(lang.lang)}
                                </header>
                            </li>
                        }
                        </For>
                    </ul>
                </Match>
                <Match when={phase() === 2}>
                    <ul>
                        <For each={languages()}>
                        {
                            lang => <li class="lang phase2" style={{order: 100 - (lang.upvote ?? 0)}}>
                                <header
                                    style={{
                                        "background-color": darkenColor(lang.lang.toLowerCase() in colorLangTyped ? colorLangTyped[lang.lang.toLowerCase()] : "#333", 0.2),
                                    }}
                                >
                                    <div
                                        class="circle-lang"
                                        style={{
                                            "background-color": lang.lang.toLowerCase() in colorLangTyped ? colorLangTyped[lang.lang.toLowerCase()] : "#333"
                                        }}
                                    >
                                        <img
                                            src={`src/assets/icons/${lang.lang.toLowerCase().replace("#","s").replace("><>", "fish")}_white.svg`}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = question;
                                            }}    
                                        />
                                    </div>
                                    {lang.lang in formatLangTyped ? formatLangTyped[lang.lang] : capitalize(lang.lang)}
                                </header>

                                <footer class="vote">
                                    <div class="counter">
                                        <button
                                            class={"arrow" + (votedLanguage().includes(lang.lang.toLowerCase()) ? " vote" : "")}
                                            onclick={() => voteLanguage(lang.lang.toLowerCase())}
                                        />
                                        {lang.upvote}
                                    </div>
                                    upvote{lang.upvote !== 1 ? "s" : ""}
                                </footer>
                            </li>
                        }
                        </For>
                    </ul>
                </Match>
                <Match when={phase() === 3}>
                    <For each={languages().sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0)).slice(0, 2)}>
                    {
                        lang =>
                        <section
                            style={{
                                "background-color": lang.lang.toLowerCase() in colorLangTyped ? colorLangTyped[lang.lang.toLowerCase()] : "#333"
                            }}
                        >
                            <button class={"arrow" + (votedLanguage().includes(lang.lang.toLowerCase()) ? " vote" : "")} onclick={() => voteLanguage(lang.lang)}/>
                            <span class="upvote">{ lang.upvote }<br/>Vote{ lang.upvote !== 1 ? "s" : ""}</span>
                            <img src={`src/assets/icons/${lang.lang.toLowerCase().replace("#","s").replace("><>", "fish")}_white.svg`}/>


                            <h1>
                            {lang.lang.toLowerCase() in formatLangTyped ? formatLangTyped[lang.lang.toLowerCase()] : capitalize(lang.lang)}
                            </h1>
                        </section>
                    }
                    </For>
                    <div class="bar">
                        <For each={languages().slice(0, 2)}>
                        {
                            lang =>
                            <div
                                style={lang.upvote !== undefined ? {
                                    "background-color": lang.lang.toLowerCase() in colorLangTyped ? colorLangTyped[lang.lang.toLowerCase()] : "#333",
                                    "width": (100 * lang.upvote /
                                        languages()
                                        // ?.sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0))
                                        ?.slice(0, 2)
                                        ?.map(l => l.upvote ?? 0)
                                        ?.reduce((a,b) => a + b)) + "%"
                                }: {
                                    width: '50%'
                                }}
                            >


                                <h1>
                                {

                                    (() => {
                                        if (lang.upvote !== undefined) {
                                            return "50%";
                                        }

                                        const percent =
                                        (100 * (lang?.upvote ?? 50) /
                                        languages()
                                        // ?.sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0))
                                        ?.slice(0, 2)
                                        ?.map(l => l.upvote ?? 0)
                                        ?.reduce((a,b) => a + b)).toFixed(2) + "%"

                                        console.log(percent, lang);
                                        console.log( languages()
                                        // ?.sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0))
                                        ?.slice(0, 2)
                                        ?.map(l => l.upvote ?? 0));


                                        return percent === "NaN%" ? "50%" : percent;
                                    })()
                                }
                                </h1>
                            </div>
                        }
                        </For>
                    </div>
                </Match>
                <Match when={phase() === 4}>
                    {
                    (() => {

                    const lang = languages().sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0))[0] as languageType;

                    return <>
                    <section
                        style={{
                            "background-color": lang.lang in colorLangTyped ? colorLangTyped[lang.lang] : "#333"
                        }}
                    >
                        <h1>
                        {lang.lang in formatLangTyped ? formatLangTyped[lang.lang] : capitalize(lang.lang)} won!
                        </h1>
                        <img src={`src/assets/icons/${lang.lang.toLowerCase().replace("#","s").replace("><>", "fish")}_white.svg`}/>
                        <span class="upvote">with { lang.upvote } vote{ lang.upvote !== 1 ? "s" : ""}.</span>


                    </section>
                    <div class="bar">
                        <For each={languages().sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0)).slice(0, 2)}>
                        {
                            lang =>
                            <div
                                style={lang.upvote !== undefined ? {
                                    "background-color": lang.lang in colorLangTyped ? colorLangTyped[lang.lang] : "#333",
                                    "width": (100 * lang.upvote /
                                        languages()
                                        ?.sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0))
                                        ?.slice(0, 2)
                                        ?.map(l => l.upvote ?? 0)
                                        ?.reduce((a,b) => a + b)) + "%"
                                }: {}}

                                title={lang.lang in formatLangTyped ? formatLangTyped[lang.lang] : capitalize(lang.lang)}
                            >


                                <h1>
                                {
                                    lang.upvote &&
                                    (100 * lang.upvote /
                                    languages()
                                    ?.sort((a,b) => (b?.upvote ?? 0) - (a?.upvote ?? 0))
                                    ?.slice(0, 2)
                                    ?.map(l => l.upvote ?? 0)
                                    ?.reduce((a,b) => a + b)).toFixed(2) + "%"
                                }
                                </h1>
                            </div>
                        }
                        </For>
                    </div>
                    <span class="added-soonly">This language will be soonly available in WeekGolf!</span>
                    </>
                    })()
                }
                </Match>
            </Switch>
            </main>
        </section>
    );
}



export default Vote;