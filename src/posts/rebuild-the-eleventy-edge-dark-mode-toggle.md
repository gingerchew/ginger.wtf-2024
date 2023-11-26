---
title: Let's update the 11ty Edge Dark Mode Toggle
subtitle: The 11ty Edge example is peak no JS solution for something every webpage needs, so let's update it a bit
description: Using navigator.sendBeacon to toggle dark mode with 11ty Edge functions and Netlify
date: 2023-11-30T22:40:41.000Z
tags:
  - eleventy
  - tutorial
  - javascript
id: rebuild-the-eleventy-edge-dark-mode
featured: true
published: true
---
Everyone loves a good dark mode toggle, especially those of us who prefer working in the dark.

When I wanted to implement this on my site, I was excited to see how simple it was to do with Edge functions. The example from the 11ty documentation had just one bummer.

## How do they work?

Honestly? Not an expert, so take this with a grain of salt. It's like if a server only did one function when visited instead of running an entire server. 

## What was the issue?

There is really only two components to the example, the edge function and the rendered mark up.

Edge function is small enough, [link to the source here](https://github.com/11ty/demo-eleventy-edge/blob/main/netlify/edge-functions/dark-mode.js), and the mark up you can see below.

```html
<form-autosubmit>
  <form action="{{ page.url }}">
    <fieldset>
      <legend>Appearance</legend>
      {% edge %}
      {% assign appearance = eleventy.edge.cookies.appearance | default: "auto" | escape %}
      <label><input type="radio" name="appearance" value=""{% if appearance == "auto" %} checked{% endif %}>Auto (System Default)</label>
      <label><input type="radio" name="appearance" value="dark"{% if appearance == "dark" %} checked{% endif %}>Dark</label>
      <label><input type="radio" name="appearance" value="light"{% if appearance == "light" %} checked{% endif %}>Light</label>
      {% endedge %}
    </fieldset>
    <button type="submit">Save</button>
  </form>
</form-autosubmit>
```

First thing I saw was the `<form-autosubmit>` tag. This means that there is a custom element at play. This also means that the information is sent to an end point using the form within.

I didn't like that flow personally. It would be better for me if there was a way to do it that didn't cause the page to reload. Something a bit more flexible.

## Send you beacons

There is a method inside of `navigator` called `sendBeacon`. Think of it as a fetch that only does `POST` and has a limit on how much data it can send. Idea is to use it for analytics instead of an XMLHttpRequest. 

It has the added benefit that if the user leaves the site before the request is done, the request will still finish. 

Here is the markup for my toggle:

```html
{% edge "njk", page.url %}
<toggle-mode data-mode="{{ eleventy.edge.cookies.mode | default('light') | escape | safe }}">
    {#- Inlined the size to prevent some CLS issues I spotted -#}
    <button class="toggle-dark-mode" id="$toggleDarkMode" style="height: 48px;width: 48px;">
        <span class="visually-hidden">Toggle dark mode</span>
        <span class="show-dark"><span class="gg-moon"></span></span>
        <span class="show-light"><span class="gg-sun"></span></span>
    </button>
</toggle-mode>
{% endedge %}
```

And here is the script for the `<toggle-mode>` custom element:

```js
sendBeacon = (data) => {
  try {
    navigator.sendBeacon('/style/', new URLSearchParams(data))
  } finally {}
}
    
// def is just window.customElements.define aliased
def('toggle-mode', class extends HTMLElement {
    constructor() {
        super()
        this.btn = this.querySelector('button');
    }

    set mode(v) {
        this.dataset.mode = v;
        setCookie('mode='+v);
    }
    get mode() {
        return this.dataset.mode;
    }
    connectedCallback() {
        this.btn.addEventListener('click', () => {
            this.mode = this.mode === 'light' ? 'dark' : 'light';
            sendBeacon({ mode: this.mode });
        });
    }
});
```

When element is connected to the dom, add the event listener to the button handles the active mode.

In the CSS I have a couple `:has()` rules that swapping out the custom properties easier:

```css
:root:has([data-mode="light"]) {
  /* ... */
}

:root:has([data-mode="dark]) {
  /* ... */
}
```

The flow of the interaction goes like this:

- Is there a cookie that says what mode should be used?
  - If yes, use that inside of `data-mode` attribute
  - If not, default to light
- When clicking on the button
  - Change the attribute `data-mode` to the next mode type
  - Send a beacon to the `/style/` endpoint with the new mode as a url parameter
  - Update the cookie client side

## The benefits

Now when you change the mode, the page doesn't need to reload. This setup can be extended to other components, like the theme selector in the footer, to make accessing the edge easier.


### Addendum

I think there are still some improvements that could be made though. For example, this doesn't work if JavaScript is disabled :grimace: If I was to do it myself, I would wrap it in a form element like the 11ty example has it. Once the page is loaded and JavaScript is enabled, add the attribute `type="button"` to the button element. This removes the `type="submit"` default attribute that `type`-less buttons have.