---
title: Should Dark Mode toggles default to the OS setting?
subtitle: ''
description: null
date: '2023-11-16T20:34:30-05:00'
tags: []
id: null
featured: false
published: false
---
Whoever came up with the idea of toggling a website to a different color scheme deserves a medal. Adding that at the operating system level is :chefkiss:

## I kind of don't think they should...

Here's my thinking. It is a control. It is something that *I*, the user, should have control over. I don't want every site to be darkmode by default.

## Bootstrap's current site

Recently [Bootstrap](https://getbootstrap.com/) released a new version of their site that included a system for sanely toggling components between light and dark versions. 

```html
<nav class="navbar" data-bs-theme="dark">
```

Again, :chefkiss:. I think that they implemented it perfectly. It is implemented perfectly on their site, it saves it to local storage so next time the page loads it is already set to the last mode you were on.

But it defaults to the OS setting. 

## Colors matter

Bootstrap is great for it's insanely reasonable theme, even if websites can have a certain *smell* because of it.

With the `data-bs-theme` setting though, [this means that the colors change depending on the theme] (https://getbootstrap.com/docs/5.3/customize/color/) and that's a foot gun.

## This is a gripe

That's all it is. 

