import { Component, createEffect, createSignal, For, Setter, Show } from "solid-js";
import "../style/SearchData.scss"
import { jsonStringToString } from "../utils/jsonTypeString";
import PageSearch from "./PageSearch";


interface SearchDataProps {
    hide?: () => void;
    children?: [];
    title: string;
    data: any;
    Comp: any;
    preview: any;
    resfreshData: () => void;
    // Fitler related
    currentFilter: any,
    changeFilter: Setter<{}>;
    // Everything that is page related
    updatePage: Setter<{}>;
    nbPages: number;
}

const correspondancePerfData: jsonStringToString = {
    "lang": "Language",
    "problem": "Problem",
    "size": "Bytes",
    "rank": "Rank",
    "nb_players": "Total",
}

const correspondanceActivityData: jsonStringToString = {
    "lang": "Language",
    "problem": "Problem",
    "player": "Player",
}



/**
 * @brief The component to search data
 * 
 * @param props {SearchDataProps}
 * @returns 
 */
const SearchData = (props: SearchDataProps) => {

    const [nbPages, setNbPages] = createSignal(1, {equals: false});

    /**
     * Updates the current filter by changing the value of a given filter type.
     *
     * @param {Event} e - The event that triggered the filter update.
     * @param {string} type - The type of filter to update (e.g. 'name', 'category', etc.).
     */
    const updateFilter = (e: Event, type: string) => {
        // Get the input value from the event target
        const inputValue = (e?.target as HTMLInputElement)?.value;

        // Create a copy of the current filter
        let tempFilter = props.currentFilter;


        // Update the filter based on the input value
        if (inputValue.length === 0) {

            // If the input value is empty, delete the filter property
            delete tempFilter[type];
        } else {

            // Otherwise, update the filter property with the input value
            tempFilter[type] = inputValue;
        }

        // Call the changeFilter callback with the updated filter
        props.changeFilter(tempFilter);

        // Refresh the data
        props.resfreshData();
    }


    createEffect(() => {
        console.log("<========== Start ===========>")
        console.log(props.nbPages);
        setNbPages(typeof props.nbPages === 'string' ? parseInt(props.nbPages) : props.nbPages);
        console.log(nbPages())
        console.log("<============ END ============>")
    })



    const correctDic = (): {[key: string]: string} | undefined => {
        switch (props.title.toLowerCase()) {
            case "all performances":
                return correspondancePerfData;
            case "activity":
                return correspondanceActivityData;
            default:
                return undefined;
        }
    }

    return <>
        <Show when={props.hide !== null && props.hide !== undefined}>
            <div
                class="background-shadow"
                onClick={props.hide}
            />
        </Show>

        <section class="SearchData">
            <Show when={props.title !== "All comments"}>
                <aside>
                    <h1>Filter</h1>
                    <For
                        each={Object.keys(correctDic() ?? {})}
                        fallback={<div>Loading...</div>}
                    >
                    {
                        d => d !== 'problem_id' && d !== "id"  && <div class="filter-content">
                            <h2>
                            {(correctDic() ?? {})[d]}
                            </h2>
                            <div class="line"/>
                            <input
                                placeholder={((props.preview[0] ?? {}) [d] ?? "") + "..."}
                                onkeyup={(e) => updateFilter(e, d)}
                            />
                        </div>
                    }
                    </For>
                </aside>
            </Show>
            <main>
                <h1>{props.title}</h1>
                <div style={{height: "70px"}}></div>
                <section class="content-data">
                    <For each={props.data} fallback={<div>No results.</div>}>
                    {
                        d => <props.Comp {...d}/>
                    }
                    </For>
                </section>
                <footer>
                    <PageSearch
                        indexPage={1}
                        // nbPage={props.nbPages}
                        nbPage={nbPages}
                        updateParentPage={(p: any) => {props.updatePage(p); props.resfreshData()}}
                    />
                </footer>
            </main>
        </section>
    </>

}

export default SearchData;