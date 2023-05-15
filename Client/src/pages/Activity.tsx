import { Component, createEffect, createSignal, onMount, Show } from 'solid-js';
import FormatActivity from '../components/FormatActivity';
import PerformanceFormat from '../components/PerformanceFormat';
import SearchData from '../components/SearchData';
import '../style/Activity.scss';

const Activity: Component = () => {
    const [activity, setActivity] = createSignal([]);
    const [page, setPage] = createSignal<number>(1);
    const [maxPage, setMaxPage] = createSignal<number>(-1, {equals: false});
    const [filter, setFilter] = createSignal({});


    const getActivity = () => {
        fetch(`http://localhost:5000/api/v1/activity?page=${page()}&filter=${encodeURIComponent(JSON.stringify(filter()))}`)
        .then(rep => rep.json())
        .then(rep => {
            console.log(rep[0].pages)
            console.log(rep.filter((l: any) => l.major === 2))
            setMaxPage(+rep[0].pages);
            setActivity(rep);
            console.log(maxPage())
        });
    }


    // When the currentFilter change, fetch the new activity
    createEffect(() => {
        // Set the filter as dependency
        console.log(filter())

        // Get the new activity
        getActivity();
    });

    // When the component is mounted, fetch the activity
    onMount(() => {
        getActivity();
    });


    return (<section class="activity">
        <Show when={maxPage() > 0}>
            <SearchData
                preview={[{
                    lang: "Python",
                    problem: (activity() as any)[0]?.problem,
                    player: (activity() as any)[0]?.username
                }]}
                title="Activity"
                data={activity()}
                Comp={FormatActivity}
                currentFilter={filter()}
                changeFilter={setFilter}
                resfreshData={getActivity}
                updatePage={setPage}
                nbPages={maxPage()}
            />
        </Show>
    </section>
    );
}



export default Activity;