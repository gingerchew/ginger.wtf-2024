---
title: Create a Theme Switcher
subtitle: "I want to add color to my site, and give control to the reader"
tags: 
    - tutorial
    - how to
    - build with me
id: 'theme-switcher-build-along'
---

## Plan

Here's what I want from my theme switcher:

- Minimal Javascript
- Easy to update CSS
- Custom Properties
- Local Storage

## How to achieve this?

I have made a unilateral decision, it's going to be a web component. Why? Because they're useful, built in components, and I just like them gosh darn it.

Web components can get wordy though, looking at you `attributeChangedCallback`. Contemplating adding something like lit to make the process more streamlined, but I am not interested in adding more Javascript in a universal component like that.

That is where [HTMLElementPlus](https://github.com/AdaRoseCannon/html-element-plus/tree/master) by Ada Rosecannon comes in. It gives a smidge of the niceties of frameworks like lit, but without adding a bunch of extra Javascript. After some further planning, even that was too much.

TL;DR; Here's the whole component

<theme-select>
    <select ref="select" style="padding: 0.5ch 1ch;margin-block: 2.5ch;">
        <option value="default" ref="default">Default</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
    </select>
</theme-select>

```js
const root = document.documentElement;

const updateTheme = ({ value }) => {
    localStorage.theme = value;
    root.dataset.theme = value;
}

class ThemeSelect extends HTMLElement {
    constructor() { 
        super();
        /* derived from HTMLElementPlus */
        this.refs = new Proxy({}, {
            get: (target, refName) => this.querySelector(`[ref="${refName}"]`),
        });

        const previousTheme = localStorage.theme;

        if (previousTheme) {
            root.dataset.theme = previousTheme;
            this.select.value = previousTheme;
        }
    }
    connectedCallback() {
        const select = this.refs.select;

        if (root.dataset.theme !== '') {
            const defaultValue = this.refs.default.value;
            root.dataset.theme = defaultValue; // just use the default value if none has been set
            select.value = defaultValue;
        }
        // Add a listener to update the theme on change.
        select.addEventListener('change', ({ target }) => updateTheme(target))
    }
}

customElements.define('theme-select', ThemeSelect);
```

## Why use a custom element when it is so simple?

My favorite reason is it removes the need for things like this:

```js
const element = document.querySelector('.theme-select');

class ThemeSelect {
    constructor(el) {
        this.el = el;
    }
}

const themeSelect = new ThemeSelect(element);
```

It just *is* the element.

## Let's talk about markup

This is even easier [we could extend built in elements](https://webreflection.medium.com/extending-built-in-elements-9dce404b75b4), but the support isn't complete yet.

So for now the markup looks like this:

```html
<theme-select>
    <select ref="select">
        <option value="default" ref="default">Default</option>
        ... <!-- the rest of the options -->
    </select>
</theme-select>
```

And that should be it. When we update the option we select, the attribute `data-theme` should update, and the localStorage should also have a new value for the `theme` key.

Best thing is, it works perfectly!

## Reloading the page

If the theme is going to revert to default when you go to a different page, then what is the point.

There's really two eays to fix it. First is to put the code to check for the localStorage key in the `<theme-select>` code, or put some code in the `<head>` and update it asap.

## If it was in `<theme-select>`

```js
constructor() { 
    super();

    /* derived from HTMLElementPlus */
    this.refs = new Proxy({}, {
        get: (target, refName) => this.querySelector(`[ref="${refName}"]`),
    });
    
    const previousTheme = localStorage.theme;
    if (previousTheme) {
        updateTheme({ value: previousTheme });
        this.refs.select.value = previousTheme;
    }
}
```

## If it was in the `<head>`

```js
const previousTheme = localStorage.theme;
if (previousTheme) {
    document.documentElement.dataset.theme = previousTheme;
    document.querySelector('theme-select select').value = previousTheme;
}
```

One potential issue with putting it in the head is that it is trying to access the document before the whole page is loaded. 

Most browsers don't find this as an issue, but FireFox can complain that it doesn't exist yet.

This means it is going in `<theme-select>`.

## Won't there be a flash where the theme isn't applied?

There might be. Considering how fast the site loads, I haven't seen it happen yet.

Here is the final element:

```js

const root = document.documentElement, 
    updateTheme = ({ value }) => {
        localStorage.theme = value;
        root.dataset.theme = value;
    }

class ThemeSelect extends HTMLElement {
    constructor() { 
        super();

        /* derived from HTMLElementPlus */
        this.refs = new Proxy({}, {
            get: (target, refName) => this.querySelector(`[ref="${refName}"]`),
        });

        const previousTheme = localStorage.theme;
        if (previousTheme) {
            updateTheme({ value: previousTheme });
            this.refs.select.value = previousTheme;
        }
    }
    connectedCallback() {
        const select = this.refs.select;

        if (root.dataset.theme === '') {
            const defaultValue = this.refs.default.value;
            root.dataset.theme = defaultValue; // just use the default value if none has been set
            select.value = defaultValue;
        }
        // Add a listener to update the theme on change.
        select.addEventListener('change', ({ target }) => updateTheme(target))
    }
}

customElements.define('theme-select', ThemeSelect);
```

## Is this where you advertise part 2?

_**Part 2 coming soon!!**_