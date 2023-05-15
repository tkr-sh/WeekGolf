import { Component, For, Index } from 'solid-js';
import translation from "../data/translation.json";
import "../style/Translation.scss";



type Dictionary<T> = {
    [key: string]: T;
};
  
type DictionaryOfDictionaries<T> = {
    [key: string]: Dictionary<T>;
};


const translationTyped: DictionaryOfDictionaries<string | boolean> = translation;
const keys: string[] = Object.keys(translationTyped.Header);
const languages: string[] = Object.keys(translationTyped).slice(1);


const Translation = () => {


    return (<>
        <table class="translation">
            {/* Header */}
            <thead>
                <tr>
                    <th>Header</th>
                    <For each={keys}>
                    {
                        k => <th>{k}</th>
                    }
                    </For>
                </tr>
            </thead>

            {/* Body */}
            <tbody>
                {/* For each language */}
                <For each={languages}>
                {
                    language => <tr>
                        <td>{language}</td>
                        <For each={keys}>
                        {
                            k => <td style={{
                                'background-color': translationTyped[language][k] === true ? '#3A3' : translationTyped[language][k] === false ? '#A33' : ''
                            }}>
                                {translationTyped[language][k]}
                            </td>
                        }
                        </For>
                    </tr>
                }
                </For>
            </tbody>
        </table>
    </>);
}



export default Translation;