import hljs from "highlight.js/lib/core";
import "highlight.js/styles/monokai-sublime.css";
const langs = ["bash", "c", "clojure", "elixir", "go", "haskell", "java", "javascript", "kotlin", "lua", "ocaml", "php", "prolog", "perl", "python", "ruby", "rust"];
// langs.forEach(l => console.log(`import ${l} from "highlight.js/lib/languages/${l}";`)); langs.forEach(l => console.log(`hljs.registerLanguage("${l}", ${l})`))
import { Show, createEffect } from "solid-js";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import clojure from "highlight.js/lib/languages/clojure";
import elixir from "highlight.js/lib/languages/elixir";
import go from "highlight.js/lib/languages/go";
import haskell from "highlight.js/lib/languages/haskell";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import kotlin from "highlight.js/lib/languages/kotlin";
import lua from "highlight.js/lib/languages/lua";
import ocaml from "highlight.js/lib/languages/ocaml";
import php from "highlight.js/lib/languages/php";
import prolog from "highlight.js/lib/languages/prolog";
import perl from "highlight.js/lib/languages/perl";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";



hljs.registerLanguage("bash", bash)
hljs.registerLanguage("c", c)
hljs.registerLanguage("clojure", clojure)
hljs.registerLanguage("elixir", elixir)
hljs.registerLanguage("go", go)
hljs.registerLanguage("haskell", haskell)
hljs.registerLanguage("java", java)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("kotlin", kotlin)
hljs.registerLanguage("lua", lua)
hljs.registerLanguage("ocaml", ocaml)
hljs.registerLanguage("php", php)
hljs.registerLanguage("prolog", prolog)
hljs.registerLanguage("perl", perl)
hljs.registerLanguage("python", python)
hljs.registerLanguage("ruby", ruby)
hljs.registerLanguage("rust", rust)



const CodeBlock = ({ code, language, bytes, info }: any) => {
    let ref: HTMLElement | undefined;
  
    createEffect(() => {
        if (ref)
            hljs.highlightBlock(ref);
    }, [code, language]);
  
    return (
        <pre>
            <code ref={ref} class={`language-${language in langs ? language : 'php'}`}>
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
