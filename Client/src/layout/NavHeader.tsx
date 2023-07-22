import { createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import "../style/NavHeader.scss";
import menu from "../data/pagesHeader.json";
import { A } from "@solidjs/router";



const NavHeader = (prop: any) => {
    
    // Hooks
    const [compressed, setCompressed] = createSignal(prop.compressed);
    const [widthScroll, setWidthScroll] = createSignal("100%");
    const [headerStyle, setHeaderStyle] = createSignal('default');
    let pagesRef: HTMLDivElement | undefined;
    let shadowLeftRef: HTMLDivElement | undefined;
    let shadowRightRef: HTMLDivElement | undefined;
    let titleRef: HTMLDivElement | undefined;
    let contentPageRef: HTMLDivElement | undefined;
    let lastPageRef: HTMLButtonElement | undefined;

    // On Mount
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener("resize", handleResize);
        pagesRef?.addEventListener('scroll', shadowDisplay);
        handleScroll();
        shadowDisplay();
    });

    // onCleanUp
    onCleanup(() => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener("resize", handleResize);
        pagesRef?.removeEventListener('scroll', shadowDisplay);

    });
  
    // Handle the scroll for the header
    const handleScroll = () => {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition > 0) {
            setHeaderStyle('scrolled');
            // Remove shadow at the right when de-scroll the page
            setTimeout(() => shadowDisplay(), 300);
        } else {
            setHeaderStyle('default');
            // Responsize the scroll when scrolled at top
            setTimeout(() => responsiveWidthScroll(), 300);
        }

        responsiveWidthScroll();
    };

    const responsiveWidthScroll = () => {
        if (titleRef !== undefined) {
            setWidthScroll(+window.innerWidth - titleRef?.offsetWidth - 30 + "px");
        }
    };


    const handleResize = () => {
        if (+window.innerWidth < 800) {
            setCompressed(true);
        } else if (!prop.compressed) {
            setCompressed(false);
        }
        responsiveWidthScroll()
    };


    const shadowDisplay = () => {
        if (shadowLeftRef !== undefined) {
            shadowLeftRef.style.display = pagesRef?.scrollLeft ?? 0 > 50 ? "block": "none";
        }



        if (shadowRightRef !== undefined && lastPageRef !== undefined && contentPageRef !== undefined) {
            console.log(contentPageRef.getBoundingClientRect().right);
            console.log(lastPageRef?.getBoundingClientRect().right);
            shadowRightRef.style.display = contentPageRef.getBoundingClientRect().right < lastPageRef?.getBoundingClientRect().right ? "block": "none";
        }
    }


    return (
        <>
            <header class={"nav " + headerStyle()}>
                <div class="title-page" ref={titleRef}>
                    <span>
                        Week
                    </span>
                    <span class="green">
                        Golf
                    </span>
                </div>
                <div class="content-pages" ref={contentPageRef}>
                    <div class="shadow-left" ref={shadowLeftRef}></div>
                    <div
                        class="scroll-nav"
                        style={{width: widthScroll()}}
                        ref={pagesRef}
                    >
                        <For each={menu} fallback={<div>Loading...</div>}>
                            {
                                (c) => {
                                    // if (menu.slice(-1)[0].title === c.title) {
                                    //     return <a href={c.link}>
                                    //         <button ref={lastPageRef}>{c.title}</button>
                                    //     </a>
                                    // } else {
                                        return <A href={c.link}>
                                            <button>{c.title}</button>
                                        </A>
                                    // }
                                }
                            }
                        </For>
                        <Show when={localStorage.getItem("token") !== null}>
                            <a href={"/profile"}>
                                <button ref={lastPageRef}>Profile</button>
                            </a>
                        </Show>
                        <Show when={localStorage.getItem("token") === null}>
                            <A href={"/sign-up"}>
                                <button ref={lastPageRef}>SignUp</button>
                            </A>
                        </Show>
                    </div>
                    <div class="shadow-right" ref={shadowRightRef}></div>
                </div>
            </header>
            <div style={{height: headerStyle() === "default" ? "100px": "60px"}}/>
        </>
    );
}


export default NavHeader;
