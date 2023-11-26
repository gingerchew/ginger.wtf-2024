---
title: Updating my Eleventy plugin tagCloud
subtitle: Seeing other's examples of their tag clouds inspired me to make a new addition
description: null
date: '2023-11-26T12:13:24-05:00'
tags:
  - eleventy
  - javascript
id: updating-tag-cloud-with-eleventy
featured: false
published: true
---
I posted about the `tagCloud` solution I coded up a little while ago, and saw some responses that were very inspiring. The main one being [this one from Nicolas Hoizey](https://nicolas-hoizey.photo/tags/).

The idea of filtering tags by "must have at least x entries" was really a clever idea. Generating a component like that seems outside of the per-view of a plugin, in my opinion. So I want to give the ability to create one by exposing more data.

## The data

It's the same pretty much, except that the amount of posts is also included.

This means that you could make a similar component like this:

{% raw %}
```html
<div v-scope="FilterPosts([ {{ collections.posts | tagCloudIndex }} ])">
    <input type="range" @change="updateTagsShown" />
    <ul>
        <li v-for="{ tagName, tagAmount } in posts"
            data-amount="{{ tagAmount }}"
        >
            {{ tagName }}
        </li>
    </ul>
</div>
```
{% endraw %}

That is a gist written using `petite-vue`, so there is some wiring that would need to be done still

To get this working, I added another filter called `tagCloudIndex`. It is used almost exactly like the other, except an object is returned instead of a string.

{% raw %}
```html
<ul class="tags">
    {% for tag in collections.post | tagCloudIndex %}
        <li class="tag">
            {{ tag.tagName }} ({{ tag.tagAmount }})
        </li>
    {% endfor %}
</ul>
```
{% endraw %}

For the sake of brevity, here is the filter:

```js
eleventyConfig.addFilter('tagCloudIndex', (posts = []) => {
  if (!posts.length) throw new Error('[@tagCloudIndex]: Invalid collection passed, no items');
  // create a map to track the tag quantity
  const tagMap = new Map();
  // loop through the posts
  for (const post of posts) {
    const tags = post.data.tags;

    tags?.forEach(tag => tagMap.set(tag, (tagMap.get(tag) || 0) + 1));
  }
  // remove any tags to be ignored
  for (const _ignore of ignore) {
    if (tagMap.has(_ignore)) tagMap.delete(_ignore);
  }

  // map out the tags to an object array
  return [...tagMap.entries()].map(([key, value]) => {
    return {
      tagName: key,
      tagAmount: value
    }
  })
})
```

This is available now if you install the `eleventy-plugin-tag-cloud` with at least v0.7.0 and [you can see it working here](/tags/)