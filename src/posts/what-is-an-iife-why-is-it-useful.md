---
title: What is an IIFE?
date: 2021-11-05T16:55:39.349Z
tags:
  - javascript
  - vanilla
  - old-school
id: 'what-is-iife'
---
## A What Now?

> **TL;DR;** An Immediately Invoked Functional Expression, or *IIFE*, is a function that is run and returns a value as soon as it is “*processed*”.
>
> An IIFE can be treated similarly as a module, like when using Universal Module Definition.
>
> But now the ESM is standardised, you should probably just use that.

Let’s say we need to get tomorrow’s date to use as a constant. Since we only need to calculate the date once, we’d rather not run a function to get tomorrow’s date each time. This is where an IIFE is most useful.

```js
const tomorrow = (function() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
})();
```

## What is happening?

There are some nuanced (possibly outdated) benefits and understandings around how browser memory works in regards to IIFE’s, so this is to be taken with a grain of salt.

The browser reads the `const` declaration, and preparses the function to be stored as a variable. After it reads the parenthesis wrapping the `function`, it sees that it is followed by `()`. The parser then runs the function inside of the wrapping parenthesis. The result is stored inside of the variable.

## This is for performance benefits?

Yeah, well it used to be. Or it could still be? Javascript engines are weird, especially when comparing them between browsers. There are (probably outdated) posts about how you should wrap everything in an IIFE because it is more memory efficient, it doesn't delay the parser, how it stores the function inside warm memory instead of cold memory, things along those lines.

If you have gotten so far down the performance rabbit hole that you are contemplating turning everything into an IIFE, your issue lies somewhere else. I promise you... your problem is not that.

## Okay, but I don't see the point yet.

We can treat this little IIFE similar to a module. If you've ever heard of Async  or Universal Module Definition, AMD and UMD respectively, they are examples of an IIFE as a module.

Since our IIFE wraps everything inside of a block `{ }`, we can take advantage of the niceities they offer. Like using the same variable name without affecting the name outside of scope, `tomorrow` is used inside and outside the IIFE.

*For clarity, in the following examples I won't be using the same `tomorrow` name. Instead, I'll use `nextDay` to create more separation between the variable names.*

We are calling these functions immediately, so we can pass in arguments in the last pair of parenthesis. Now we can make our `tomorrow` IIFE a little bit more succinct.

```js
const tomorrow = (today => {
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);

    return nextDay;
})(new Date());
```

## So modules + succinct + ???

Yeah! You can extract the entire inside and make it into an ES Module like this:

```js
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export {
    tomorrow;
}
```

Or you can even export the IIFE from an ES Module:

```js
export default ((today) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
})(new Date());
```

Since ES Modules can also import non-ESM files, you can also not worry about converting the IIFE's to ESM style exports:

```js
import { esModuleName } from './esModule.js';
import './nonEsModule.js';

console.log(tomorrow) // tomorrows date
```

There was a point in time where IIFE usage was pretty popular, to the point where none of them were not commented.

Nowadays I think they are safe to convert to ES modules and call it a day.