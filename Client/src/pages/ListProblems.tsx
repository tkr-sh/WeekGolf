import { Component, createSignal, For, onMount, Show } from 'solid-js';
import "../style/ListProblems.scss";
import formatLang from "../data/formatLang.json";
import CssFilterConverter from 'css-filter-converter';
import colorLang from '../data/colorLang.json';
import { A } from '@solidjs/router';
import formatDuration from '../utils/formatDuration';
import Timer from '../components/Timer';

const formatLangTyped: {[keys: string]: string} = formatLang;
const colorLangTyped: {[keys: string]: string} = colorLang;



interface problemType {
    title: string,
    id: number,
    lotw: null | string,
    sum_votes: number,
    voters: number,
}
  


const ListProblems: Component = () => {
    const [problems, setProblems] = createSignal<problemType[]>([], {equals: false});
    const [timeRemaining, setTimeRemaining] = createSignal(0, {equals: false});
    const [filter, setFilter] = createSignal("");
    const [langFilter, setLangFilter] = createSignal("");
    const [scrolledClass, setScrolledClass] = createSignal("", {equals: false});
    let listRef: HTMLDivElement | undefined;

    // When mounted, get the problem
    onMount(() => {
        fetch("http://localhost:5000/api/v1/problems")
        .then(rep => rep.json())
        .then(rep => {setProblems(rep); updateSort(0)});

        fetch("http://localhost:5000/api/v1/last-problem")
        .then(rep => rep.json())
        .then(rep => setTimeRemaining(Math.floor((Date.parse(rep.date_end) - new Date().getTime()) / 1000)));

        updateTimer();

        listRef?.addEventListener('scroll', (e: any) => {
            if (e?.target?.scrollTop > 100) {
                setScrolledClass(" scrolled");
            } else {
                setScrolledClass("");
            }
        });
    });


    // Decrease the timer
    const updateTimer = () => {
        setTimeRemaining(t => t - 1);
        setTimeout(updateTimer, 1_000);
    }



    // Style the image when hovered
    const styleImg = (lang: string) => {
        setFilter(CssFilterConverter.hexToFilter(colorLangTyped[lang.toLowerCase().replace("#","s")]).color + "");
        setLangFilter(lang);
    }
    
    // De style the image
    const deStyleImg = () => {
        setFilter("");
    }

    const updateSort = (n: number) => {
        console.log(n)

        switch (n) {
            case 0:
                setProblems(p => p.sort((a,b) => b.id - a.id))
                break;
            case 1:
                setProblems(p => p.sort((a,b) => a.id - b.id))
                break;
            case 2:
                setProblems(p => p.sort((a,b) => (b.sum_votes / Math.max(b.voters, 1)) - (a.sum_votes / Math.max(a.voters, 1))))
                break;
            case 3:
                setProblems(p => p.sort((a,b) => (a.sum_votes / Math.max(a.voters, 1)) - (b.sum_votes /  Math.max(b.voters, 1))))
                break;
        }
    }



    return (<div class='ListProblems'>
        <div class={"timer-content" + scrolledClass()}>
            <Timer
                time={timeRemaining()}
            />
        </div>
        <main
            class={
            ((localStorage.getItem("problemsInRow") ?? '1') !== '1' ? "multiple" : '') +
            (parseInt(localStorage.getItem("problemsInRow") ?? '1') >= 4 ? " lot" : '')}
            ref={listRef}
        >
            <div>
                Order by: 
                <select onchange={(e) => updateSort(parseInt(e.currentTarget.value))}>
                    <option value="0">ID (DESCENDANT)</option>
                    <option value="1">ID (ASCENDANT)</option>
                    <option value="2">NOTES (DESCENDANT)</option>
                    <option value="3">NOTES (ASCENDANT)</option>
                </select>
            </div>
            {/* <div class="list" ref={listRef} style={{'grid-template-columns': `repeat(${localStorage.getItem("problemsInRow")}, 1fr)`}}> */}
            <div class="list" ref={listRef} style={{'grid-template-columns': `repeat(${localStorage.getItem("problemsInRow") ?? '1'}, 1fr)`}}>
                <For each={problems()} fallback={"Loading..."}>
                    {
                        (p: problemType) => <A href={`/problem?id=${p.id}`}>
                            <button>
                                <h1>{p.title}</h1>
                                <span class="id"><b>ID</b>: {p.id}</span>
                                <Show when={p.lotw !== null}>
                                    <img
                                        src={`/src/assets/icons/${p.lotw?.replace("#","s").toLowerCase()}_white.svg`}
                                        class="lang"
                                        alt={formatLangTyped[p.lotw?.toLowerCase() ?? ""]}
                                        title={"Language of the week: " + formatLangTyped[p.lotw?.toLowerCase() ?? ""]}
                                        onMouseEnter={() => styleImg(p.lotw ?? "")}
                                        onMouseLeave={deStyleImg}
                                        style={
                                            {
                                                filter: langFilter() === p.lotw ? filter() : ""
                                            }
                                        }
                                    />
                                </Show>
                                <Show when={p.id > Math.max(...problems().map((p: problemType) => p.id)) - 2}>
                                    <div class='notif'>
                                        {
                                            p.id === Math.max(...problems().map((p: problemType) => p.id)) ?
                                            "New problem of the week!" : 
                                            "Solutions available!"
                                        }
                                    </div>
                                </Show>
                                <Show when={p.voters > 0}>
                                    <div class='note'>
                                        <b>{(p.sum_votes / p.voters).toFixed(2)}</b><img src="/src/assets/icons/star_off.svg"/>/10 
                                    </div>
                                </Show>
                            </button>
                        </A>
                    }
                </For>
            </div>
        </main>
    </div>);
}



export default ListProblems;