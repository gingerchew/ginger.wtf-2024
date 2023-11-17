---
title: Using the unicode-range property to our advantage
subtitle: >-
  When using fonts online, only use what you need. No need to download
  characters you'll never use.
description: >-
  Using the unicode-range property in CSS, we're able to reduce the size of our
  web fonts.
date: '2023-11-08T12:05:00-05:00'
tags:
  - css
  - performance
  - how-to
id: using-the-unicode-range
featured: false
published: false
---
<details>
<summary>Resources</summary>
  <p><a href="https://fontdrop.info/#/?darkmode=true">Font Drop for parsing font files</a></p>
  <p><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range">MDN Documentation for unicode-range</a></p>
  <p><a href="https://github.com/fonttools/fonttools">Python fonttools</a></p>
</details>

A property of the `@font-face` declaration that I don't see used often enough is `unicode-range`.

## What is it?

Unicode is how characters are identified. Each character you see online has a matching "unicode". For example, in this post you'll see `U+000` which equals to be the first character in the font-files unicode range.

To see this you'll need to either parse the file with tools like Python's [fonttools](https://github.com/fonttools/fonttools). We will be using the site [FontDrop](https://fontdrop.info/) to get a peek at what is going on in our font files.

## How to use the unicode-range property

Keep in mind that the upper limit I am using in examples is `0FF`, your font file may be different. Here's some examples:

```css
@font-face {
    /* Use all the characters from the 000 to 0FF */
    unicode-range: U+000-0FF;
    /* Only use the third character */
    unicode-range: U+002;
    /* Use the first 10 characters, and the last */
    unicode-range: U+000-009, U+0FF;
}
```
*[Check out the documentation, if you need a deeper look.](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range)*
