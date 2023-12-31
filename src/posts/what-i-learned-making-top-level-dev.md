---
title: What I learned making top-level.dev
description: A single purpose site that gives you all of the top level domains in one handy list.
tags:
    - retrospectives
    - javascript
    - eleventy
id: 'what-i-learned-topleveldev'
date: 2023-10-18
published: true
---

My name is Ginger, and I have problem. Anytime someone says "Do you think there is a website {x}.com?" I have to look it up. What's worse is the number I end up registering. Instead of dealing with that issue, I've decided to enable all my fellow domain addicts.

## So what is it?

It is a list of all the active top level domains, like `.com`, `.net`, `.lol`. It comes with filtering and search. No more do I have to google "list of top level domains" to see if `.crochet` exists. It doesn't unfortunately.

## Things I learned

First off, I built this in 11ty. If you only need HTML and a smidge of JavaScript, use 11ty. To get things done quickly, I used a template. The `eleventy-plus-vite` template by Matthias Ott was the perfect balance of "tools I want to use" and 11ty.

Keeping the development feedback loop as tight as possible is important to me. Waiting seconds for a page to reload, or a new build, can ruin anyone's flow.

With the template set up, it was time fetch the official list of top level domains from IANA. This means I create a file inside of my `_data` folder, and then fetch from the file. It hit me that it would be a bad idea to over fetch the list. No need to anger the domain gods.

The solution was to use `@11ty/eleventy-plugin-cache` to cache the list. When the site is built, check if `x` amount of time has passed, if it has, fetch again. Perfect! Again, exactly what I needed.

Now how do I get the domains from the cache to the webpage. Use the `_data` cascade and loop through it.

```html
<ul class="domains">
    {% raw %}{% for domain in domains %}
    <li>.{{ domain }}</li>
    {% endfor %}{% endraw %}
</ul>
```

Now that my domains are rendered on the page, I had to build up the features I needed. Search? Yes. Filtering by first letter? Yes.

Again, these are not difficult problems to solve. First, I wanted to see what my Lighthouse score was. After all, there is no JavaScript on the page yet, should be an one and done 100.

*Family Feud Buzzer* Wrong, it wasn't.

Apparently, loading a website with a large amount of elements on the page is *"bad for performance"*. The solution ended up being... JavaScript... I know, I hate saying it, but it is.

So I wrap the first pass with nunjucks into a `<noscript>` tag, and look at my options. First thing's first, how do I get the data without making a request. Here is a trick that I think more people should use to transport medium amounts of JSON. Zero requests, and the browser sees it as a string, not an object/array.

```html
{%- raw %}
<script id="$data" type="application/json">
    [
        {{ data }}
    ]
</script>
<script type="module">
    const data = JSON.parse($data.textContent.trim());
</script>
{% endraw %}
```

`JSON.parse()` is also surprisingly performant.

Not wanting to weight down my site with a library or framework or doodad, I used petite-vue. If you haven't heard of petite-vue, you should look into it. It is a "progressive enhancement first" style version of Vue. Think Alpine, but Vue.

This is roughly what the markup looks like.

```html
<ul v-scope="DomainList()"></ul>
```

Yeah, that is in fact it. Let's see the JavaScript though.

```js
{%- raw %}
import { createApp } from 'petite-vue';

const domains = JSON.parse($domains.textContent.trim());
function Domains() {
    return {
        $template: `<li v-for="domain of domains">.{{ domain }}</li>`
    }
}
createApp({
    Domains,
    domains
}).mount();
{% endraw %}
```

Granted the naming conventions could use some work, but the list was generating. Still getting flagged for too many DOM elements. Next is filter/pagination, I want to show only 1 letter at a time, each letter of the alphabet gets a button. Looks like this:

```js
{%- raw %}
function Pagination() {
    const _alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');

    return {
        $template: `<li v-for="alpha of _alpha">
            <button type="button" @click="navigate">{{ alpha }}</button>
        </li>`,
        _alpha,
        navigate({ target }) {
            const alpha = target.textContent;

            this._activeDomains = alpha;
        }
    }
}
{% endraw %}
```

Now need to update how domains are gotten, since we are adding filtering.

```js
createApp({
    _domains: JSON.parse($data.innerHTML.trim()),
    get domains() {
        return this._domains.filter(d => d[0] === this._activeDomains);
    },
    _activeDomains: 'a',
    Pagination
}).mount();
```

Filter: Complete!

Now comes the search functionality. For the sake of brevity, here's the code:

```js
createApp({
    // previous code
    _search: '',
    search({ target }) {
        this._search = target.value.toLowerCase();
    },
    // update the domains getter once again
    get domains() {
        if (this._search === '') {
            return this._domains.filter(d => d[0] === this._activeDomains);
        }
        return this._domains.filter(d => d.toLowerCase().indexOf(this._search) > -1);
    }
})
```

Now let's see it all together, first the markup:

```html
{%- raw %}
<div v-scope>
    <script id=$data" type="application/json">
        [
            {{ domains }}
        ]
    </script>
    <search>
        <label for="search">Search</label>
        <input type="search" @input="search" id="search">
    </search>
    <details>
        <!-- Hide our filter buttons for aesthetics -->
        <summary>Filter</summary>
        <ul class="pagination" v-scope="Pagination()"></ul>
    </details>
    <ul role="list" v-scope="Domains()">
        <noscript>
            {{ nunjucks templates }}
        </noscript>
    </ul>
    <script type="module" src="./path/to/module.js"></script>
</div>
{% endraw %}
```

And the JavaScript:

```js
{%- raw %}
import { createApp } from 'petite-vue';

function Pagination() {
    const _alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return {
        $template: `<li v-for="alpha of _alpha">
            <button type="button" @click="navigate">{{ alpha }}</button>
        </li>`,
        _alpha,
        navigate({ target }) {
            const alpha = target.textContent;

            this._activeDomains = alpha;
        }
    }
}

function Domains() {
    return {
        $template: `<li v-for="domain of domains">.{{ domain }}</li>`,
    }
}
createApp({
    _activeDomains: 'a',
    _domains: JSON.parse($data.innerHTML.trim()),
    /**
     * @param {string} val
     */
    _search: '',
    get domains() {
        if (this._search === '') {
            return this._domains.filter(d => d[0] === this._activeDomains);
        }
        return this._domains.filter(d => d.toLowerCase().indexOf(this._search) > -1);
    },
    search({ target }) {
        this._search = target.value.toLowerCase();
    },
    Domains,
    Pagination,
}).mount();
{% endraw %}
```

And voila! My dream, addiction enabling, domain hunting website is complete. Lighthouse score? 100's across the board.

I have some possible improvements in mind. 

## Wait what was the lesson?

Always choose the simple solution. Less Javascript is better. HTML is your friend. 

Let me know what you think!