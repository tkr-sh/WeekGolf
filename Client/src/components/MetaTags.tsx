import { createEffect, onCleanup, onMount } from "solid-js";




function createMetaTag(name: string, content: string): HTMLMetaElement {
    const tag = document.createElement("meta");
    tag.name = name;
    tag.content = content;
    return tag;
}



interface MetaTagsProps {
    title: string;
    description: string;
    author?: string;
    keywords?: string[];
    contentType?: string;
    charset?: string;
    robots?: string;
    themeColor?: string;
    icon?: string;
    lang?: string;
    lastModified?: string;
    type?: string,
    name?: string,
    seeAlso?: string,
    ogTitle?: string;
    ogDescription?: string;
    ogType?: string;
    ogUrl?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterCard?: string;
    twitterSite?: string;
    twitterCreator?: string;
}
  


/**
 * The meta tags
 */
const MetaTags =
    ({
        title="WeekGolf",
        description="WeekGolf is a website about code golf",
        author="TKirishima",
        keywords=["code golf", "programming",],
        contentType="text/html; charset=utf-8",
        charset="utf-8",
        robots="",
        themeColor="#33CC33",
        lang="en",
        lastModified="",
        type="",
        name="WeekGolf",
        seeAlso="",
    }: MetaTagsProps) => {

    const metaTags: HTMLMetaElement[] = [];

    createEffect(() => {
        // Title
        if (title) {
            const titleTag = createMetaTag("title", title);
            const ogTitleTag = createMetaTag("og:title", title);
            const twitterTitleTag = createMetaTag("twitter:title", title);
            metaTags.push(titleTag);
            metaTags.push(ogTitleTag);
            metaTags.push(twitterTitleTag);
        }

        // Description    
        if (description) {
            const descriptionTag = createMetaTag("description", description);
            const ogDescriptionTag = createMetaTag("og:description", description);
            const twitterDescriptionTag = createMetaTag("twitter:description", description);
            metaTags.push(descriptionTag);
            metaTags.push(ogDescriptionTag);
            metaTags.push(twitterDescriptionTag);
        }

        // Author
        if (author) {
            const authorTag = createMetaTag("author", author);
            metaTags.push(authorTag);
        }

        // Keywords
        if (keywords && keywords.length > 0) {
            const keywordsTag = createMetaTag(
                "keywords",
                keywords.join(", ")
            );
            metaTags.push(keywordsTag);
        }

        // Content-Type
        if (contentType) {
            const contentTypeTag = createMetaTag(
                "content-type",
                contentType
            );
            metaTags.push(contentTypeTag);
        }

        // Charset
        if (charset) {
            const charsetTag = createMetaTag("charset", charset);
            metaTags.push(charsetTag);
        }

        // Robots
        if (robots) {
            const robotsTag = createMetaTag("robots", robots);
            metaTags.push(robotsTag);
        }

        // Theme-Color
        if (themeColor) {
            const themeColorTag = createMetaTag(
                "theme-color",
                themeColor
            );
            metaTags.push(themeColorTag);
        }

        // Lang
        if (lang) {
            metaTags.push(createMetaTag("language", lang));
            metaTags.push(createMetaTag("og:locale", lang));
        }

        // Last modified
        if (lastModified) {
            const lastModifiedTag = createMetaTag(
                "last-modified",
                lastModified
            );
            metaTags.push(lastModifiedTag);
        }

        // Type
        if (type) {
            const typeTag = createMetaTag("og:type", type);
            metaTags.push(typeTag);
        }

        // Name of the website
        if (name)
            metaTags.push(createMetaTag("og:site_name", name));

        // See also
        if (seeAlso)
            metaTags.push(createMetaTag('og:see_also', seeAlso));
        

        // Add meta-tags
        metaTags.forEach((tag) => document.head.appendChild(tag));
    });

    onCleanup(() => {
        metaTags.forEach((tag) => document.head.removeChild(tag));
    })
  
    return <></>;
};
  


export default MetaTags;