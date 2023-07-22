import "../style/SmallNav.scss"
import menu from "../data/pagesHeader.json";
import { createMemo, createSignal, For, onMount } from "solid-js";
import icons from "../data/pagesFooter.json";
import { A, useLocation } from "@solidjs/router";
import createAuth from "../hooks/createAuthFetch";



const SmallNav = () => {
    const location = useLocation();
    const lastPath = (pathname: String) => pathname.split("/").slice(-1)[0].split("?")[0];
    const [pfp, setPfp] = createSignal(localStorage.getItem("pfp") ?? "");
    const {token, authFetch} = createAuth();

    // On Mount
    onMount(() => {
        if (token() !== null) {
            authFetch(`http://localhost:5000/api/v1/pfp`)
            .then(rep => {
                if (!rep.error) {
                    setPfp(rep.data.pfp ?? "");
                    localStorage.setItem("pfp", rep.data.pfp);
                }
            });
        }
    });

    

    return <nav class="small">
        <A href="/">
            <button
                class={"weekgolf" + (menu.map(m => m.title.toLowerCase()).includes(lastPath(location.pathname)) ? "" : " selected")}
            >

                <img src={"src/assets/icons/weekgolfwhite.svg"}/>
            </button>
        </A>
        <div class="sep"></div>
        <For each={menu} fallback={<button>...</button>}>
            {
                
                c => <A href={c.link}>
                        <button
                            class={
                                lastPath(location.pathname).split('-')[0] === c.title.toLowerCase() ?
                                "selected" :
                                ""
                            }
                        >
                        <img src={`src/assets/icons/${c.icon}.svg`} class="icon"/>
                    </button>
                </A>
            }
        </For>
        <div class="sep"></div>
        <For each={icons} fallback={<button>...</button>}>
            {
                c => c.icon !== "nouser_white" ? <a href={c.link}>
                    <button class={c.icon}>
                        <img src={`src/assets/icons/${c.icon}.svg`} class="icon special"/>
                    </button>
                </a> : 
                <A href={token() === null ? "/sign-up" : c.link}>
                    <button class={c.icon}>
                        <img
                            src={pfp() !== '' ? pfp() : `src/assets/icons/${c.icon}.svg`}
                            class={"icon special" + (pfp() !== '' ? ' pfp' : '')}
                        />
                    </button>
                </A> 
            }
        </For>
        <div style={{"min-height": "10px", display: "block", width: "10px"}}/>
    </nav>
}


export default SmallNav;
