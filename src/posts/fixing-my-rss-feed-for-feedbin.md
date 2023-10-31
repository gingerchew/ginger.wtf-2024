---
title: Feedbin is rendering my RSS feed wrong, let's fix it!
subtitle: A simple, possibly brute force, solution to a problem apparently no one has had before
description: Feedbin is removing the wrong elements, so let's make up for it on our own
date: 2023-10-31
id: 'feedbin-rendering-wrong'
tags:
    - 11ty
    - rss
    - javascript
    - eleventy
    - feedbin
    - feedbin-rendering
    - rss-feed
    - rss-feedbin-render
    - feedbin-rendering-issues
    - eleventy-filter-fix
    - fix-with-filters
    - how-to-use-filters-in-11ty
    - how-to-use-filters-in-eleventy
    - fixing-feed-rendering
    - seo-tags
    - jsdom-manipulation
    - 11ty-filters
    - rss-feed-template
    - feed-content-fix
    - removing-heading-links
    - wrapping-code-blocks
    - rss-feed-seo
    - seo-goodies
    - heading-links
    - jump-links
    - edge-cases
    - rss-reader
    - 11ty-filtering
    - content-rendering
    - web-feed-optimization
    - dynamic-content-filters
    - rss-feed-customization
    - content-manipulation
    - html-parsing
    - feedbin-troubleshooting
    - seo-tagging
    - content-formatting
---

I was notified of this thanks to @pontus (if you are reading this, lemme know if you want better credit or whatever), apparently Feedbin's feed was rendering my posts incorrectly. 

In my code blocks, nothing was wrapping. All of my heading links were showing.

## What gives?

No idea, here's how I fixed it though.

First thing I had to do was make a filter, aptly named `fixForFeedbin`. It needs to do 2 things.

- 1. Remove the heading links
- 2. Make my code blocks wrap again

So I popped open my `.eleventy.js` file, and got to work.

## Filters in 11ty

I recommend you read up on the [11ty documentation for filters](https://www.11ty.dev/docs/filters/), it is going to be more in depth and valuable in the long run.

If you already know the gist with filters, lets go!

My RSS feed template looks something like this:

{% raw %}
```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>{{ meta.title }}</title>
    <subtitle>{{ meta.description }}</subtitle>
    <link href="{{ meta.url }}/feed.xml" rel="self" type="application/atom+xml" />
    <link href="{{ meta.url }}" rel="alternate" type="text/html"/>
    <author>
        <name>{{ meta.title }}</name>
    </author>
    {% if collections.posts %}
    <updated>{{ collections.posts | rssLastUpdatedDate }}</updated>
    {% endif %}
    <id>{{ meta.url }}/</id>
    {%- for post in collections.posts | reverse -%}
    {% set absolutePostUrl %}{{ post.url | url | absoluteUrl(meta.url) }}{% endset %}
        <entry>
            <title>{{ post.data.title }}</title>
            <link href="{{ absolutePostUrl }}"/>
            <updated>{{ post.date | rssDate }}</updated>
            <id>{{ absolutePostUrl }}</id>
            <content type="html"><![CDATA[
                {{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) | safe }}
            ]]></content>
        </entry>
    {%- endfor -%}
</feed>
```
{% endraw %}

It's got all the SEO goodies in there and an `<entry>` element for each of my blog posts. Neat! 

The problem is in the `<content>` tag, it is outputing the HTML properly, but Feedbin is stripping out parts of it.

To make things easier, I'm using JSDOM to parse the incoming content and manipulate it. Here's my solution:

```js
function fixForFeedbin(theContent) {
    const theDocument = new JSDOM(theContent);

    // all of my heading links have this class, so if you're copy and pasting, double check your feed.
    const directLinks = theDocument.window.document.querySelectorAll('a.direct-link')

    directLinks.forEach(el => el.remove());

    // The code blocks all have a language class, this just excludes ones that don't.
    const preCodeBlocks = theDocument.window.document.querySelectorAll('pre[class] > code[class]');

    // Using CSS we tell the code to wrap when possible
    preCodeBlocks.forEach(el => el.style.whiteSpace = 'pre-wrap');

    const theNewContent = theDocument.window.document.body.innerHTML;

    return theNewContent;
}
```

JSDOM offers a `serialize` function on the JSDOM object, but since it serializes *the whole document* it would mess with our RSS feed. Inserting only the content, it is smooth sailing ahead. 

## Any edgecases?

I'm sure there will be, I'm already wrenching one together in this post. For now though, this works just fine.

### A thought about heading links

I do wonder if it is a *good* idea to remove them entirely and not rework them somehow. I don't imagine they are meaningful inside of an RSS Reader, but if you use them, let me know!