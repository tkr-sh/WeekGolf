import "../style/BasicNav.scss"
import menu from "../data/pagesHeader.json";
import { For, Show } from "solid-js";
import icons from "../data/pagesFooter.json";
import { A } from "@solidjs/router";



const BasicNav = () => {


    return <nav class="basic">
        <div class="title-page">
            <span class="W">
                W
            </span>
            <span class="hover-hide">
                eek
            </span>
            <span class="green">
                <span class="G">
                    G
                </span>
                <span class="hover-hide">
                    olf
                </span>
            </span>
        </div>

        <div class="line"/>

        <ul>
            <For each={menu} fallback={<li>Loading...</li>}>
                {
                    c => <li>
                        <A href={c.link}>
                            {c.title}
                            <img src={`src/assets/icons/${c.icon}.svg`} class="icon"/>
                        </A>
                    </li>
                }
            </For>
            <li>
                <Show when={localStorage.getItem("token") !== null}>
                    <A href="/profile">
                        Profile
                        {/* <img src={`src/assets/icons/${c.icon}.svg`} class="icon"/> */}
                    </A>
                </Show>
                <Show when={localStorage.getItem("token") === null}>
                    <A href="/sign-up">
                        Sign-up
                    </A>
                </Show>
            </li>
        </ul>


        <footer>
            <section>
                <For each={icons} fallback={<div></div>}>
                    {
                        icon => <a href={icon.link}>
                            <img
                                src={`src/assets/icons/${icon.icon}.svg`}
                                class="icon"
                                alt={icon.icon}
                            />
                        </a>
                    }
                </For>
            </section>

            <section>
                <button>
                    MAIN
                </button>
                <button onClick={() => document.documentElement.scrollTop = 0}>
                    TOP
                </button>
            </section>

            <div class="credentials">
                WeekGolf © 2022-2023 
            </div>
        </footer>
    </nav>
}


export default BasicNav;
