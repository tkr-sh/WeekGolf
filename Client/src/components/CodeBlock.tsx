import hljs from "highlight.js/lib/core";
import "highlight.js/styles/monokai-sublime.css";
import javascript from "highlight.js/lib/languages/javascript";
import { Show, createEffect } from "solid-js";

hljs.registerLanguage("javascript", javascript);




const CodeBlock = ({ code, language, bytes, info }: any) => {
    let ref: HTMLElement | undefined;
  
    createEffect(() => {
        if (ref)
            hljs.highlightBlock(ref);
    }, [code, language]);
  
    return (
        <pre>
            <code ref={ref} class={`language-${language}`}>
                {code}

            </code>
            <Show when={bytes !== undefined}>
                <span class="bytes">
                    <b>{code?.length}</b>bytes        
                </span>
            </Show>
            <Show when={info !== undefined}>
                <strong class="info">
                    {info}
                </strong>
            </Show>
        </pre>
    );
};
  


export default CodeBlock