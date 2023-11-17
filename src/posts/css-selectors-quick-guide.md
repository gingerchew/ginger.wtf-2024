---
title: CSS Selectors have gotten more advanced
subtitle: >-
  Now that we have more advanced selectors like <code>:has()</code> and
  <code>:where()</code> it is time for a review
description: >-
  Selector functions like :has() and :where() make CSS more powerful, but they
  may change specificity in ways you don't expect
date: 2023-11-13T10:38:33-05:00
tags:
  - css
  - explainer
id: advanced-css-selectors
featured: false
published: true
---
The introduction of `:has()` and `:where()` has given CSS all of the "maybe some day" feature requests from the last 10 years (give or take).

`:has()` is the proverbial "parent selector" and pseudo-functions like `:where()` and `:is()` make building complex selectors more concise.

Use these carelessly though, and you may find yourself in a specificity pickle.

## What is specificity?

Specificity is a concept in CSS for determining which rules should be applied while cascading.

```css
a {
    color: blue;
}

.link {
    color: green;
}

#menu .link {
    color: red;
}
```

Given the markup below, we know that the link will be red:

```html
<nav id="menu">
   <ul>
     <li><a class="link">This is a red link</a></li>
  </ul>
</nav>
```

## How do you calculate specificity?

A common way to calculate it is to give each part of a selector a value and then add them together.

For example, an element selector `a, p, main, nav` would be equal to `1`, a class selector `.my-selector` would be equal to `10`, and an id `#mySpecificElement` would be equal to `100`. It is really common to see the selectors based on 3 numbers, so a selector with two class selectors and an element selector would be written with a leading 0, `021`.

If you use `!important` the specificity is "nuked" but I give it a value of `1,000,000,000` plus whatever the value of the selector is.

Since you really shouldn't be using `!important` we'll ignore it for the rest of this post. What about other selectors like `[attribute]` or `::after`?

Attribute selectors, like the one in brackets, are the same as class selectors, or `10`. Pseudo elements, like `::after`, are elements and have a value of `1`.

## How does `:has()` effect specificity?

Since these pseudo-functions can take multiple selectors, they will calculate specificity different.

```css
.parent:has(#elementId > a, .special-link a) .special-element {
  /* What is the specificity of this rule? */
}
.parent:where(#elementId, nav, ul) .special-element {
  /* What about this one */
}
```

The first rule has 3 class selectors, 2 element selectors, and 1 id selector. Using the specificity math mentioned in the last section, that equals `132`.

To prevent these selectors from growing their specificity rapidly, the `:has()` selector becomes equal to the *most specific* selector inside of it. Given our original `:has()` selector, the contents of the `:has()` selector is equal to `101`. The total specificity becomes `121`.

## How does `:where()` effect specificity?

`:where()` nukes the specificity of the selectors passed in.

This is not like when using `!important`, it's actually the opposite. So nuke is probably the wrong word, maybe "black hole" is better?

```css
.parent:where(#elementId > a, .special-link a) .special-element {
  /** None of the selectors in :where() will be calculated */
}
```

If we follow the same rules as `:has()` the specificity value is `132`. If we use `:where()`, it is `020`.

I find this useful for situations like this:

```css
.special-element .special-child #specialGrandChild a span {
    /* That's a lot of specificity */
}
:where(.special-element .special-child #specialGrandChild) a span {
  /* Much less specificity */
}
```

By using `:where()` we are reducing the specificty from `122` down to `002`. Incredible stuff.

## Keep it going

Using this pseudo functions is going to "level up" your CSS, as corny as it sounds. Being able to black-hole selectors that are too specific for their own good is a great addition.

There are other facets of `:has()`, `:where()`, and `:is()` that make them special, like how they forgive invalid selectors *(`:has()` does not forgive them)*, so checking out the references below is very worthwhile.

<details>
    <summary>References</summary>
    <ul role="list" class>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:has"><code>:has()</code> documentation in MDN</a></li>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:where"><code>:where()</code> documentation in MDN</a></li>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:is"><code>:is()</code> documentation in MDN</a></li>
      <li><a href="https://webkit.org/blog/13096/css-has-pseudo-class/">Webkit guide to using <code>:has()</code></a></li>
    </ul>
</details>