import { Outlet } from "@solidjs/router";
import { Component, createSignal, Match, onMount, Switch } from "solid-js";
import BasicFooter from "./BasicFooter";
import BasicHeader from "./BasicHeader";
import '../style/MainLayout.scss';
import NavHeader from "./NavHeader";
import BasicNav from "./BasicNav";
import SmallNav from "./SmallNav";
import changeTheme from "../utils/ChangeTheme";


const MainLayout: Component = (props?: any) => {
    // Hooks
    const [windowWidth, setWindowWidth] = createSignal(window.innerWidth)
    const [layoutFormat, setLayoutFormat] = createSignal(localStorage.getItem('layout') ?? '0');

    // Handle the Resize
    const handleResize = () => {
        console.log(windowWidth())
        setWindowWidth(+window.innerWidth);

        if (localStorage.getItem('layout') === '0' && windowWidth() < 800) {
            setLayoutFormat("1");
        } else {
            setLayoutFormat(localStorage.getItem('layout') ?? '0');
        }
    }
    
     // When the window changes
    window.addEventListener("resize", handleResize);


    // When the localStorage change
    window.addEventListener('storage', () => {
        setLayoutFormat(localStorage.getItem("layout") ?? '0');
    });



    onMount(() => {
        changeTheme(localStorage.getItem("color-theme") ?? "120");
    });





    return <Switch>
        <Match when={layoutFormat() === '0'}>
            <BasicHeader compressed={windowWidth() < 800}/>
                <main class="layout">
                    <Outlet />
                    {props?.children ?? ''}
                </main>
            <BasicFooter />
        </Match>
        <Match when={layoutFormat() === '1'}>
            <BasicHeader compressed={true}/>
                 <main class="layout">
                     <Outlet />
                    {props?.children ?? ''}
                 </main>
            <BasicFooter />
        </Match>
        <Match when={layoutFormat() === '2'}>
            <NavHeader />
                <main class="layout">
                    <Outlet />
                    {props?.children ?? ''}

                </main>
            <BasicFooter />
        </Match>
        <Match when={layoutFormat() === '3'}>
            <BasicNav />
                <main class="layout-nav">
                    <Outlet />
                    {props?.children ?? ''}
                </main>
        </Match>
        <Match when={layoutFormat() === '4'}>
            <SmallNav />
            <main class="layout-nav-small">
                <Outlet />
                {props?.children ?? ''}
            </main>
        </Match>
    </Switch>
}


export default MainLayout;