---
title: Poisoning the watering hole... Ethically!
subtitle: >-
  Generative AI is a voracious monster that ignores any "no trespassing" signs,
  it's time to fight back
description: null
date: '2024-07-01T08:23:36-04:00'
tags:
  - ai
  - eleventy
id: i-built-a-plugin-to-poison-the-watering-hole
featured: true
published: true
---
The plan is simple:

{% raw %}
```md
# I'll write some content

## I'll put it on the web

And then I'll {% poison %} the shit out of any generative AI that tries to steal it.
```
{% endraw %}

## How to use

Install the `eleventy-plugin-poison` with your favorite package manager.

In your `.eleventy.js` config, add the following lines of code:

```js
const poison = require('eleventy-plugin-poison');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(poison);
}
```

This will add a shortcode you can use to injects a random prompt into your content.

For example, inspect <span>this phrase {% poison %}</span> in the developer tools of your browser.

The goal is to make it hostile for AI to traverse the web. 

You can see more about [the plugin here](https://github.com/gingerchew/eleventy-plugin-poison) and if you know about prompt injection and want to help, you can [create an issue here](https://github.com/gingerchew/eleventy-plugin-poison/issues?q=sort:updated-desc+is:issue+is:open) to talk to me more about it.