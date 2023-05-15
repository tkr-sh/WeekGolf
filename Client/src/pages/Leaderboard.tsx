import { Component, For, createEffect, createSignal, onMount } from 'solid-js';
import "../style/Leaderboard.scss";
import LeaderboardUsers from '../components/LeaderboardUsers';
import formatLang from "../data/formatLang.json";
import capitalize from '../utils/capitalize';
import addRank from '../utils/addRankLeaderboard';


// Type formatLang
const formatLangTyped: {[key: string]: string} = formatLang;

// Different categories that doesn't depend on the language
const categories: string[] = ["global", "golf", "upgrade", "cooperation"];

// Get the image for theses category
const categoryImage: {[key: string]: string} = {
    'global': "global",
    "golf": "weekgolfwhite",
    "upgrade": "upgrade_arrow",
    "cooperation": "cooperation"
};


const Leaderboard: Component = () => {
    const [users, setUsers] = createSignal<any>({}, {equals: false})
    const [selectedCategory, setSelectedCategory] = createSignal<string>("global");
    const [currentLang, setCurrentLang] = createSignal<string[]>([]);


    const getLeaderboard = () => {
        if (!Object.keys(users()).includes(selectedCategory())) {
            const selectedCategoryTemp: string = selectedCategory();
            fetch("http://localhost:5000/api/v1/leaderboard?category=" + encodeURI(selectedCategoryTemp))
            .then(rep => rep.json())
            .then(rep => {
                const newRep: any = {}
                newRep[selectedCategoryTemp] = rep;
                setUsers(p => {
                    console.log(rep)
                    console.log( addRank(rep, 'points', false))
                    p[selectedCategoryTemp] = addRank(rep, 'points', false);
                    return p;
                });
            });
        }
    };


    // On Mount code
    onMount(() => {
        // Get the current languages
        fetch('http://localhost:5000/api/v1/languages')
        .then(rep => rep.json())
        .then(rep => {
            setCurrentLang(rep.map((l: any) => l.lang).sort());
        });

        getLeaderboard();
    });


    return (
        <div class="content-leaderboard">
            <div class={"Leaderboard" + (localStorage.getItem('splitLeaderboard') === 'true' ? ' split' : '' )}>
                <header>
                    <h1>
                        {selectedCategory() in formatLangTyped ? formatLangTyped[selectedCategory()] : capitalize(selectedCategory())}
                        {
                        " Leaderboard "
                        }
                    </h1>
                </header>
                <section>
                    <nav>
                        <ul>
                            <For each={categories}>
                            {
                                category => <li onclick={() => {setSelectedCategory(category); getLeaderboard()}}>
                                    <img src={`src/assets/icons/${categoryImage[category]}.svg`}/>
                                    <span>
                                        {capitalize(category)}
                                    </span>
                                </li>   
                            }
                            </For>
                            <For each={currentLang()}>
                            {
                                lang => <li onclick={() => {setSelectedCategory(lang.toLowerCase()); getLeaderboard()}}>
                                    <img src={`src/assets/icons/${lang.toLowerCase().replace('#',"s")}_white.svg`}/>
                                    <span>
                                        {formatLangTyped[lang.toLowerCase()]}
                                    </span>
                                </li>   
                            }
                            </For>
                        </ul>
                    </nav>
                    <main>
                        <LeaderboardUsers
                            users={selectedCategory() in users() ? users()[selectedCategory()] : []}
                            type={'points'}
                        />
                    </main>
                </section>
            </div>
        </div>
    );
}


export default Leaderboard;
