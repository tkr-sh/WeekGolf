import { createEffect, createSignal, For, onCleanup, onMount } from "solid-js";
import "../style/BasicHeader.scss";
import menu from "../data/pagesHeader.json";
import defaultPfp from "../assets/imgs/nouser_white.jpg";
import { A } from "@solidjs/router";
import createAuth from "../hooks/createAuthFetch";



const BasicHeader = (prop: any) => {

    // Hooks
    const [compressed, setCompressed] = createSignal(prop.compressed);
    const [headerStyle, setHeaderStyle] = createSignal('default');
    const [pfp, setPfp] = createSignal(localStorage.getItem("pfp") ?? defaultPfp);
    const {token, authFetch} = createAuth();

    // On Mount
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener("resize", handleResize);

        if (token() !== null) {
            authFetch(`http://localhost:5000/api/v1/pfp`)
            .then(rep => {
                if (!rep.error) {
                    setPfp(rep.data.pfp ?? defaultPfp);
                    localStorage.setItem("pfp", rep.data.pfp);
                }
            });
        }
    });

    // onCleanUp
    onCleanup(() => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener("resize", handleResize);
    });
  
    // Handle the scroll for the header
    const handleScroll = () => {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition > 0) {
            setHeaderStyle('scrolled');
        } else {
            setHeaderStyle('default');
        }
    };

    const handleResize = () => {
        if (+window.innerWidth < 800) {
            setCompressed(true);
        } else if (!prop.compressed) {
            setCompressed(false);
        }
    }



    return (
        <>
            <header class={"basic " + headerStyle()}>
                <div>
                    {
                        compressed() ?
                        <div class="drop-down">
                            <img src="src/assets/icons/list.svg"/>
                            <nav>
                            <For each={menu} fallback={<div>Loading...</div>}>
                                {
                                    (c) => <A href={c.link} class="">
                                        <img src={`src/assets/icons/${c.icon}.svg`} class="icon"/>
                                        {c.title}
                                    </A>
                                }
                            </For>
                            </nav>
                        </div>
                        :
                        <div class="content-icon">
                        <For each={menu} fallback={<div>Loading...</div>}>
                            {
                                (c) => <A href={c.link} class="">
                                    <img src={`src/assets/icons/${c.icon}.svg`} class="icon"/>
                                </A>
                            }
                        </For>
                        </div>
                    }
                </div>
                <div class="title-page">
                    <span>
                        Week
                    </span>
                    <span class="green">
                        Golf
                    </span>
                </div>
                <div class="content-pfp">
                    <div>
                        <A href="/profile">
                            <img src={pfp() ?? defaultPfp}/>
                        </A>
                    </div>
                </div>
            </header>
            <div style={{height: headerStyle() === "default" ? "100px": "60px"}}/>
        </>
    );
}


export default BasicHeader;