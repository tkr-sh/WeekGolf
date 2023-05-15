// import * as monaco from "../lib/Monaco/monaco-editor/esm/vs/editor/editor.api";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/min/vs/editor/editor.main.css";
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import hslToRgb from "../utils/hslToRGB";
import defaultCode from "../utils/defaultCode";
import createAuth from "../hooks/createAuthFetch";



// Format
const hslStringToRGB = (hsl: string) => {
    let temp = hsl
    .split("(")[1]
    .split(')')[0]
    .split(`,`)
    .map(x => x.includes("%") ? parseInt([...x].slice(0, -1).join('')) / 100 : parseInt(x));

    return  hslToRgb(temp[0], temp[1], temp[2]);
}


// The properties
interface PropsType {
    style?: any,
    code?: string,
    lang?: string,
    fontSize?: number,
    readonly?: boolean,
    bgColor?: string,
    showByte?: boolean,
    lineHighlight?: boolean,
    tabulation?: boolean,
    showInvisible?: boolean,
    wordWrap?: boolean,
    cursorPosition?: boolean,
    autoBrackets?: boolean,
    autoIndent?: boolean,
    updateCode?: (arg0: string) => void,
    deleteCode?: () => boolean,
    previousCode?: () => boolean,
    requestCode?: (arg0: any) => void,
    setValueIde?: boolean,
}


// Correspondance of languages
const langFile: {[key: string]: string} = {
    'sass': 'scss',
    'bash': 'shell',
    'c++': 'cpp',
    'c': "c",
    'haskell': "python",
    'cs': 'csharp',
    "fs": "fsharp",
}



const MonacoEditor = (props: PropsType) => {
    // Hooks
    //// Signals
    const [bytes, setBytes] = createSignal<number>(props.code?.length ?? 0, {equals: false});
    const [position, setPosition] = createSignal({ lineNumber: 1, column: 1 }, {equals: false});
    //// References
    let editorRef: any;
    let editor: monaco.editor.IStandaloneCodeEditor | undefined;



    // Load the syntax of the language and define it as the 
    const loadLanguage = (lang: string) => {
        // If it's txt
        if (lang === "txt") {
            return;
        }


        // Else update the lang with the filter
        lang = lang in langFile ? langFile[lang] : lang;


        // If the lang is already loaded
        // if (monaco.languages.getLanguages().map(l => l.id).includes(lang)) {
        //     return;
        // }

        import(`../data/monaco-syntax/${lang}/${lang}.js`)
        .then((language) => {
            
            // Verify again if the lang is already loaded
            // if (monaco.languages.getLanguages().map(l => l.id).includes(lang)) {
            //     return;
            // }
            
            console.info(`New language: ${lang}`);
            console.log(language)
            monaco.languages.register({ id: lang });
            monaco.languages.setMonarchTokensProvider(lang, language.language);
            monaco.languages.setLanguageConfiguration(lang, language.conf);
        })
        .catch(err => console.error(err));
        // .catch(err => console.error(`There is no syntax highlight for ${lang}.`));
    } 


    // On Mount
    onMount(() => {
        // Create the editor
        editor = monaco.editor.create(editorRef, {
            value: props.code ?? "",
            language: (props.lang ?? "python") in langFile ? langFile[props.lang ?? "python"] : props.lang ?? "python",
            theme: 'vs-dark',
            fontSize: props.fontSize ?? 16,
            readOnly: props.readonly ?? false,
            renderLineHighlight: props.lineHighlight ? "line" : "none",
            renderWhitespace: props.showInvisible ? "selection" : "all",
            wordWrap: props.wordWrap ? "on" : "off",
            autoClosingBrackets: props.autoBrackets ? "always" : "never",
            autoIndent: props.autoIndent ? 'full' : "none",
            scrollbar: {
                alwaysConsumeMouseWheel: false
            },
            // autoIndent: 'full',
        });



        // Import the theme
        import('../data/Monokai.json')
        .then((data: any) => {
            // Add the main color to keywords
            data.rules.push({
                token: 'keyword',
                foreground: hslStringToRGB(getComputedStyle(document.body).getPropertyValue('--ide-color'))
            });


            console.log(  props.bgColor === undefined || props.bgColor.slice(0,2) === '--' ?
            hslStringToRGB(
                getComputedStyle(document.body)
                .getPropertyValue(props.bgColor ?? '--bg-color')
            ) :
            props.bgColor,)

            // Define the theme
            monaco.editor.defineTheme('monokai-custom', {
                    ...data,
                    colors: {
                        "editor.background":
                            props.bgColor === undefined || props.bgColor.slice(0,2) === '--' ?
                                hslStringToRGB(
                                    getComputedStyle(document.body)
                                    .getPropertyValue(props.bgColor ?? '--bg-color')
                                ) :
                                props.bgColor,
                        "editor.lineHighlightBackground": "#ffffff08",
                    },
                }
            );


            console.log({
                ...data,
                colors: {
                    "editor.background":
                        props.bgColor === undefined || props.bgColor.slice(0,2) === '--' ?
                            hslStringToRGB(
                                getComputedStyle(document.body)
                                .getPropertyValue(props.bgColor ?? '--bg-color')
                            ) :
                            props.bgColor,
                    "editor.lineHighlightBackground": "#ffffff08",
                },
            })

            // Set it at the theme
            monaco.editor.setTheme('monokai-custom');
        })

        // Load the language
        loadLanguage(props.lang ?? "python");



        // Get the editor's text model
        const model = editor.getModel();

        // Listen to the onDidChangeModelContent event <=> when the user type something
        model?.onDidChangeContent(() => {
            if (props.updateCode !== null && props.updateCode !== undefined) {
                props.updateCode(model.getValue());
            }

            setBytes(model.getValue().length);
        });

        // Update column and row
        editor.onDidChangeCursorPosition(() => {
            setPosition(editor?.getPosition() as any);
        });

        window.addEventListener('resize', () => {
            editor?.layout();
            console.log(editor?.layout())
        });
    });


     // Change language
    ///////////////////
    createEffect(() => {
        loadLanguage(props.lang ?? 'python')
        if (!editor) {
            return;
        }
        const model = editor.getModel();
        if (!model) return;
        monaco.editor.setModelLanguage(model, (props.lang ?? "python") in langFile ? langFile[props.lang ?? "python" ] : props.lang ?? "python" )
    })

     // Change tabulation
    ///////////////////
    createEffect(() => {
        
        // if (tabulation) {
            
        // }

    })

    // Update renderWhitespace
    createEffect(() => editor?.updateOptions({renderWhitespace: !props.showInvisible ? "selection" : "all"}));
    
    // Update insertSpaces
    createEffect(() => editor?.updateOptions({insertSpaces: !props.tabulation}));
    
    // Update wordwrap
    createEffect(() => editor?.updateOptions({wordWrap: props.wordWrap ? "on" : "off"}));
    
    // // Update insertSpaces
    createEffect(() => editor?.updateOptions({autoClosingBrackets: props.autoBrackets ? "always" : "never",}));

    // Update auto indentation
    createEffect(() => editor?.updateOptions({autoIndent: props.autoIndent ? 'full' : "none"}));

    // Create an effect so that when the parent value changes,
    // The child is updated with the new value
    //// For the delete Code
    createEffect(() => {
        if (props.deleteCode) {
            console.log(props.deleteCode());
            const currLang = props.lang;

            if (currLang !== undefined && currLang in defaultCode) 
                editor?.setValue((defaultCode as {[key: string]: string})[currLang])
            else
                editor?.setValue("")
        }
    });

    //// And for the previous code
    createEffect(() => {
        if (props.previousCode && props.requestCode) {
            console.log(props.previousCode());

            props.requestCode(editor);
        }
    })


    // Update the code of the ide
    createEffect(() => {
        if (props.setValueIde && props.code !== undefined) {
            editor?.setValue(props.code);
        }
    });



    // Dispose the editor
    onCleanup(() => {
        editor?.dispose();
    })

    return <div
        ref={editorRef}
        style={{ height: '500px', 'position': "relative", "text-align": "left", ...props.style}}
    >
        
        <Show when={props.showByte === true} fallback={""}>
            <span class="ide-bytes">
                <Show when={props.cursorPosition === true} fallback={""}>
                    Column: <b>{position().column}</b><br/>
                    Row: <b>{position().lineNumber}</b><br/>
                </Show>
                <b>{bytes()}</b>byte{bytes() !== 1 ? 's' : ''}
            </span>
        </Show>
    </div>;
}

export default MonacoEditor;