import { Component, For } from 'solid-js';
import "../style/FAQ.scss";
import version from "../data/version.json";
import formatLang from "../data/formatLang.json";
import colorLang from "../data/colorLang.json";
import { darkenColor } from '../utils/darkenRGB';
import { A } from '@solidjs/router';


const correspondanceFAQ: {[key: string] : string} = {
    "F": "requently",
    "A": "sked",
    "Q": "uestions",
}


const colorLangTyped: {[key: string] : string} = colorLang;



const FAQ: Component = () => {
    let refQuestions: {[key: string]: HTMLElement} | undefined = {};


    // Question JSON
    const questions = [
        {
            question: "Is there a public git repo ?",
            answer: <span>WeekGolf source code is available since October 27, 2022 on GitHub! There are a lot of different things on this repo.<br/>
            Whether it's the bot discord, the back-end, the front-end, the point system or the dockers.<br/>
            You can see this information by clicking on <a href="https://github.com/aderepas/WeekGolf">this</a> link.</span>
        },
        {
            question: "What is the version of <language-name> ?",
            answer: <div class="version">
                <For each={Object.keys(version)}>
                    {
                        (c: string) =>
                        <div
                            class="lang"
                        >
                            <div class="lang-name">
                                <img src={`src/assets/icons/${c.toLowerCase()}_white.svg`}/>
                                <span>
                                    {(formatLang as {[key: string]: string})[c]}
                                </span>
                                <div
                                    class="bg-color"
                                    style={{"background-color": colorLangTyped[c.toLowerCase()]}}
                                />
                            </div>
                            <footer>
                                <span>
                                    {
                                        (() => {
                                            let ver = (version as {[key: string]: string})[c];

                                            if (ver.includes('github')) {
                                                return ver.split(" ").slice(-1)[0]
                                            } else {
                                                console.log((/[\d+]+\.[\d+]+\.[\d+]+/gi).exec(ver))
                                                return ((/[\d+]+\.[\d+]+\.[\d+]+/gi).exec(ver) ?? "")[0];
                                            }
                                        })()
                                    }
                                </span>


                                <div class="bg-color"
                                    style={{"background-color": darkenColor(colorLangTyped[c.toLowerCase()], 0.2)}}
                                />
                            </footer>
                        </div>
                    }
                </For>
            </div>
        },
        {
            question: "Why do I only have 3 points?",
            answer: <span> When you start playing weekgolf you start with 3 points.
            1 golf point, 1 upgrade point and 1 cooperation point.
            <ul>
                <li>You can win golf points by solving the challenge of the week</li>
                <li>You can win upgrade points when you upgrade the best answer</li>
                <li>You can win cooperation points when your comment is being upvoted</li>
            </ul>
            Golf points are added to your account when you the week of competition is over.</span>
        },
        {
            question: "What are the different types of points?",
            answer:
            <ol>
                <li><b>Golf points</b>: you can win golf points by solving the challenge of the week</li>
                <li><b>Upgrade points</b>: you can win upgrade points when you upgrade the best answer</li>
                <li><b>Cooperation points</b>: you can win cooperation points when your comment is being upvoted</li>
            </ol>
        },
        {
            question: "When a new language will be added to Weekgolf?",
            answer: <span>
                Each month a new language will be added to weekgolf.<br/>
                You can vote for the language that you want to be in WeekGolf <A href="/vote">here</A>
            </span>
        },
        {
            question: "How can I interact with people?",
            answer: <span>
                You can't directly send a message to someone on WeekGolf.<br/>
                However, you can write a comment under someone's post to congratulate them on their response or ask them for a part of their code that you may not have understood.<br/>
                You can also join the <a href="https://github.com/aderepas/WeekGolf">WeekGolf discord server</a> to interact with the members there and much more!<br/>
            </span>
        },
        {
            question: "How can I get user input in JavaScript?",
            answer: <span>
                You can do it using <code>prompt()</code><br/>
                And even if it is marked "JavaScript" so that a maximum of people understand it, it's rather Node.JS.<br/>
                Because it is not really possible to take STDIN in pure JavaScript.<br/>
            </span>
        },
        {
            question: "How do I add a logo for the language?",
            answer: <span>
                You can't.<br/>
                But if you think that one logo is missing, don't hesitate to less us know by contacting an admin by discord or at <a href="mailto:admin@week.golf">admin@week.golf</a><br/>
            </span>
        },
        {
            question: "More info about versions ?",
            answer:
                <ul>
                    <li>The version of BQN, is from the repository of CBQN.</li>
                    <li>The version of C, is the version of the GCC compiler. Its running C17</li>
                    <li>The version of C++, is the version of the clang compiler. Its running C++20</li>
                    <li>The version of C#, is the version of the .NET framework. Its running C#10</li>
                    <li>The version of K, is the git commit. Its from the repository ngn/k</li>
                    <li>The version of JavaScript, is the version of NodeJS LTS</li>
                    <li>The version of Prolog, is the version of SWI-Prolog</li>
                </ul>
        },
        {
            question: "Is this language working ?",
            answer: <span>
                Sometimes, language can be slow or have a problem and don't work..<br/>
                You can see the state of every language here: <A href="/status">here</A>
            </span>
        },
    ];



      ////////////
     // Return //
    ////////////
    return (
    <main class="FAQ">
        {/* Letters FAQ */}
        <h1>
            <For each={[..."FAQ"]}>
                {
                    c =>
                    <span class="content">
                        <span class="letter">
                        {c}
                        </span>
                        <span class="hide" style={{'margin-left': (- correspondanceFAQ[c].length * 50 - 20) + "px"}}>
                        {   
                            correspondanceFAQ[c]
                        }
                        </span>
                        .
                    </span>
                }
            </For>
        </h1>
        <div class="line big"/>

        {/* Section that summarize the page */}
        <h2 style={{margin: 0}}>Summary</h2>
        <div class="line"/>
        <p>
            This page is here to help you if you have some questions.<br/>
            If this page doesn't help you with the question that you have, you can come on <a href="https://discord.gg/CqrbqSkdX3">Discord</a> and we will help you with your question
        </p>

        {/* Section to navigate throught the page */}
        <h2>Navigation</h2>
        <div class="line"/>
        <nav>
            <For each={questions}>
                {
                // q => <button onClick={() => refQuestions !== undefined && refQuestions[q.question].scrollIntoView({ behavior: 'smooth' })}>
                q => <button
                        onClick={() => {
                            console.log(refQuestions)
                            if (refQuestions !== undefined) {
                                refQuestions[q.question].scrollIntoView({ behavior: 'smooth' });
                            }
                        }}>
                    {q.question}
                </button>
                }
            </For>
        </nav>

        {/* For all questinos */}
        <For each={questions}>
            {
            q => <>
                <h2 ref={el => {if (refQuestions !== undefined) refQuestions[q.question] = el}}>
                    {q.question}
                </h2>
                <div class="line"/>
                <p>
                    {q.answer}
                </p>
            </>
            }
        </For>
      </main>
    )
}



export default FAQ;
