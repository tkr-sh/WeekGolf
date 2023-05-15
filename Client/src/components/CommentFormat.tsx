import capitalize from "../utils/capitalize";
import rankToClass from "../utils/rankToClass";
import { createSignal, JSX, Show } from 'solid-js';
import MonacoEditor from "./IDE";

interface CommentFormatProps {
    vote: number,
    content: string,
    solution_id: number,
}


const CommentFormat = (props: CommentFormatProps) => {
    const [code, setCode] = createSignal('', {equals: false});
    let articleRef: undefined | HTMLElement;


    // Style article when hover
    const styleArticle = (e: any) => {
        const {left, top, width, height} = e.target.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (articleRef !== undefined) {
            articleRef?.style.setProperty("--mouse-x", x+"px");
            articleRef?.style.setProperty("--mouse-y", y+"px");
            articleRef?.style.setProperty("--opacity-before", "1");
        }
    }

    // De-style article when not hover
    const deStyleArticle = (e: any) => {
        articleRef?.style.setProperty("--opacity-before", "0");
    }
    

    return <>
        <article
            class="CommentFormat"
            ref={articleRef}
            onMouseLeave={(e) => deStyleArticle(e)}
            onMouseMove={(e) => styleArticle(e)}
        >
            <div class="upvote-content">
                <div class="arrow" />
                {props.vote}
            </div>
            <p>
                {props.content}
            </p>
        </article>
    </>
}

export default CommentFormat;