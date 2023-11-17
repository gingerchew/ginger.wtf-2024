---
featured: true
title: Using 11ty to bring back tag clouds
subtitle: Bring back tag clouds, you cowards
description: Tag clouds are a good way of seeing what kind of posts are floating around in your blog, lets bring them back
tags:
    - eleventy
    - tutorials
    - build-with-me
published: true
date: 2023-11-16
---

I'm on a streak with creating things that I missed out on from the early Web 2.0 days. So buckle up, 'cause we're bringing back the tag cloud!

This post is also available as a plugin here: 

```sh
npm install eleventy-plugin-tag-cloud
```

## What is it?

A tag cloud is a page or component that shows all of the tags (or the most popular) on your site. It's a nice way of exposing all the content in your site without being a giant list of posts.

## The gist of it

After doing a fair bit of searching on the web, I couldn't find any plugin for generating a tag cloud. This had me worried, maybe this was really difficult to put together. Maybe it wasn't even worth doing.

It was super easy.

We're going to loop through the posts in our blog and return an array of tags, no duplicates!

## The actual tutorial

Here's the full function in it's entirety:

```js
function tagCloud(posts) {
    const tagSet = new Set();

    for (const post of posts) {
        const tags = post.data.tags;
        tags.forEach(tag => tagSet.add(tag));
    }

    return [...tagSet]
}
```

Since this is going to be a plugin though, we have to make some additions. This means wrapping it in the usual `module.exports` config.

```js
module.exports = (eleventyConfig) => {
    eleventyConfig.addFilter('tagCloud', tagCloud);
}
```

We have to make some options. First, and only, we want to ignore some tags.

```njk
{% raw %}
{% for tag in collections.posts | tagCloud %}
{# We don't need a tag for "posts" we're already using it as our collection #}
{% endfor %}
{% endraw %}
```

So our options look like this:

```js
const _defaults = {
    ignore: []
}
```

Now we add a loop to remove tags based on that array:

```js
function tagCloud(posts, { ignore }) {
    const tagSet = new Set();

    for (const post of posts) {
        const { tags } = post.data;
        tags.forEach(tag => tagSet.add(tag));
    }

    for (const tag of ignore) {
        if (tagSet.has(tag)) tagSet.delete(tag);
    }

    return [...tagSet]
}
```

I've changed up a couple of things to give it a more *11ty* vibe.

```js
const _defaults = {
  ignore: ['posts']
}

module.exports = (eleventyConfig, _options) => {
  const {
    ignore
  } = {
    ..._defaults,
    ..._options
  };

  eleventyConfig.addFilter('tagCloud', (posts = []) => {
    if (!posts.length) throw new Error('[@tagCloud]: Invalid collection passed, no items');

    const tagSet = new Set();

    for (const post of posts) {
      const { tags } = post.data;
      tags.forEach(tag => tagSet.add(tag));
    }
    
    for (const _ignore of ignore) {
      if (tagSet.has(_ignore)) tagSet.delete(_ignore);
    }

    const tags = [...tagSet];

    return tags;
  });
};
```

Then we just use it like this:


```html
<ul>
    {% raw %}
    {% for tag in collections.posts | tagCloud %}
    {% endraw %}
    <li><a href="{ link to tag page }">{% raw %}{{tag}}{% endraw %}</a></li>
    {% raw %}
    {% endfor %}
    {% endraw %}
</ul>
```

That's it, despite not finding it anywhere, I sat down, did it, and packaged it up. `npm install eleventy-plugin-tag-cloud` Hope this helps you make your own plugins or gives you some inspiration!