import { Show, createEffect, createSignal } from "solid-js";
import "../style/PageSearch.scss";

// Icons
import start from "../assets/icons/backward-solid.svg"
import prev from "../assets/icons/caret-left-solid.svg"
import next from "../assets/icons/caret-right-solid.svg"
import end from "../assets/icons/forward-solid.svg"



interface PageSearchProps {
    indexPage: number,
    nbPage: () => number,
    updateParentPage: any
}

const PageSearch = ({indexPage, nbPage, updateParentPage}: PageSearchProps) => {

    const [page, setPage] = createSignal<number>(indexPage, {equals: false});
    const [maxPage, setMaxPage] = createSignal<number>(nbPage(), {equals: false});


    // Create an effect to update the number of max page when the props changes
    createEffect(() => {
        setMaxPage(nbPage());
    });

    // Function to update the page
    const updatePage = (funcUpdate: (prevState: number) => number) => {
        updateParentPage(funcUpdate);
        setPage(funcUpdate);
    }

    return (
    <Show when={maxPage() > 0}>
    <div class="page-search">
        <img
            src={start}
            style={{opacity: +(page() !== 1)}}
            onClick={() => updatePage(() => 1)}
        />
        <img
            src={prev}
            style={{opacity: +(page()!==1)}}
            onClick={() => updatePage(page => Math.max(page - 1, 1))}
        />
       {[...Array(7).keys()].map(i => {
                const n = i - 3;

                if (n + page() < 1 || n + page() > maxPage()) {
                    return;
                }

                if (i === 0) {
                    return <><button onClick={() => updatePage(() => 1)}>1</button> ...</>
                } else if (i === 3) {
                    return <button class="selected">{page()}</button>
                } else if (i === 6) {
                    return <button onClick={() => updatePage(() => maxPage())}>{maxPage()}</button>
                } else {
                    return <><button onClick={() => updatePage(() => page() + n)}>
                        {page() + n}
                    </button></>
                }
                
            })
        }
        <img
            src={next}
            style={{opacity: +(page()!==maxPage() && maxPage()>1)}}
            onClick={() => updatePage(page => Math.min(page + 1, maxPage()))}
        />
        <img
            src={end}
            style={{opacity: +(page()!==maxPage() && maxPage()>1)}}
            onClick={() => updatePage(() => maxPage())}
        />
    </div>
    </Show>
    );
} 

export default PageSearch;