import "../style/BasicFooter.scss";
import WeekGolfLogo from '../assets/icons/weekgolfwhite.svg';
import icons from "../data/pagesFooter.json";
import { A, useNavigate } from "@solidjs/router";
import github from "../assets/icons/github.svg";
import { For } from "solid-js";

const BasicFooter = () => {

    const navigate = useNavigate();

    return <footer class="basic">
        <main>
            <section class="left">
                <section>
                    <span>
                        <span>
                            Week
                        </span>
                        <span class="green">
                            Golf
                        </span>
                    </span>
                </section>
                <section>
                    <For each={icons} fallback={<div></div>}>
                        {
                            icon => <a href={icon.link}>
                                <img
                                    src={`src/assets/icons/${icon.icon}.svg`}
                                    class="icon"
                                    alt={icon.icon === "nouser_white" ? "user" : icon.icon}
                                />
                            </a>
                        }
                    </For>
                </section>
                <section>
                    <button onclick={() => navigate('/')}>
                        MAIN
                    </button>
                    <button onClick={() => document.documentElement.scrollTop = 0}>
                        TOP
                    </button>
                </section>
            </section>
            <section class="right">
                <img src={WeekGolfLogo}/>
            </section>
        </main>
        <div class="credentials">
            WeekGolf © 2022-2023 
        </div>
    </footer>
}


export default BasicFooter;