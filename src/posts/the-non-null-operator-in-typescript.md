---
title: The super power that lets you tell TypeScript what is actually happening
subtitle: You know when you have a variable that could be null, but you know it won't ever be. Yeah, this is for that.
description: How the non-null operator can transform your TypeScript
id: 'the-non-null-operator-in-typescript'
date: 2023-11-02
tags:
    - typescript
    - explainer
    - spicy
featured: true
---

I wrote something like this the other day:

```js
const element = document.querySelector('#aVerySpecifcElement');

element.addEventListener('click', doStuff);
```

But this wasn't enough for TypeScript. Why? Because when `querySelector` doesn't find anything, it returns `null`. That's not `Element`.

My brain immediately went to fixing it like this:

```diff-js
const element = document.querySelector('#aVerySpecificElement');

+ if (!!element) {
    element.addEventListener('click', doStuff);
+ }
```

You can also use the optional chaining operator `?.` to do something similar.

```diff-js
const element = document.querySelector('#aVerySpecificElement');

- element.addEventListener('click', doStuff);
+ element?.addEventListener('click', doStuff);
```

But this is caving. This is admitting *defeat*.

## So what gives?

In comes the `!` operator. Fun fact, did you know in a time gone by, the `!` exclamation mark was called a "bang". 

The bang `!` operator is like the optional chain, but it tells TypeScript "Actually, I know for *A FACT* that this is not going to be `null` or `undefined`."

```diff-js
const element = document.querySelector('#aVerySpecificElement');

- element.addEventListener('click', doStuff);
+ element!.addEventListener('click', doStuff);
```

No longer do we need to add unnecessary `if` statements just to appease a compiler.

## What if it actually can be undefined?

Then don't use it silly!

If you are asking that question, then don't worry about using it. Let TypeScript whisk your worries away. Then when you're pulling your hair out trying to write a type guard to account for the possibility of `null`, give it a shot.

<details>
    <summary>References</summary>
    <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator">The release notes for TypeScript 2.0</a>
</details>