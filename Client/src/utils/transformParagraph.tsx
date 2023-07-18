// Transform a paragraph
const transformParagraph = (str: string | undefined) => {
    return str
    ?.replaceAll(/<[\w\/][^>]*>/g, '')
    ?.split('\n')
    ?.map(
        e => <p>{e}</p>
    );
}

export default transformParagraph;
