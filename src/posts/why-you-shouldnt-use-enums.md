---
title: Why you shouldn't use TypeScript's Enums
description: While Enums have benefits, especially in large codebases, they can honestly be a drag.
subtitle: Enums have plenty of benefits, but they can honestly be a drag.
tags:
    - spicy
    - opinion
    - typescript
    - typescript-enum
    - vanilla-js
    - vanilla
    - vanilla-javascript
    - vanilla-enum
    - enum-vanilla
    - enum-constants
    - enum-usage
    - constant-collection
    - locking-constants
    - implied-values
    - typescript-javascript
    - typescript-enum-compilation
    - typescript-enum-vs-object
    - smaller-packages
    - mutable-enum
    - proxy-object
    - es6-features
    - intellisense-benefits
    - typescript-team
    - battle-tested-code
    - production-ready-code
    - es6-arrow-function
    - code-generation
    - javascript-enums
id: 'why-you-shouldnt-use-typescript-enums'
date: 2023-10-31
---

If you're not familiar with what an `enum` looks like, here you go:

```ts
enum Direction {
  Up = 1,
  Down, // 2
  Left, // 3
  Right, // 4
}
```

<details>
    <summary>References</summary>
    <p>
        <a href="https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings">Enums - TypeScript Handbook</a>
    </p>
</details>

They act as a collection of constants. This can be useful, especially if you are trying to have incredibly unique keys:

```ts
enum DirectiveKeys {
    Skip = '__c_skip_me_',
    Remove = '__c_remove_me_',
    Add = '__c_add_me_'
}

const objectThatShouldBeSkipped = {
    action: DirectiveKeys.Skip
}
```

## Reasons to use them

When using an `enum`, it locks down the constants while keeping them in a manageable object format:

```js
const DirectiveKeys = {
    Skip: '__c_skip_me_',
    Remove: '__c_remove_me_',
    Add: '__c_add_me_'
}

DirectiveKeys.Skip = 'Whoops, this is still mutable';

const objectThatShouldBeSkipped = {
    action: DirectiveKeys.Skip // will never be skipped
}
```

When using `enum`, you are also able to have implied values:

```ts
enum ExplicitValues {
    Up = 0,
    Down = 1,
    Right = 2,
    Left = 3
}
```

Is the same as:

```ts
enum ImplicitValues {
    Up,
    Down,
    Right,
    Left
}
```

## Reasons to *not* use them

They aren't abstracted away. That's right, TypeScript enums are compiled into your code. You can easily say "Well, whatever. It's TypeScript, they know what they're doing." But what they are doing is converting this:

```ts
enum Const {
    Up,
    Down,
    Right,
    Left
}
```

Into this:

```js
var Const;
(function (Const) {
    Const[Const["Up"] = 0] = "Up";
    Const[Const["Down"] = 1] = "Down";
    Const[Const["Right"] = 2] = "Right";
    Const[Const["Left"] = 3] = "Left";
})(Const || (Const = {}));
```

As someone who is a fan of smaller packages, this was a very frustrating bit of code to find. Converting the `enum` into an object/`const` saved hundreds of bytes. Why?

> For each `enum`, there was a snippet of JavaScript like the one above to match.

The generated JavaScript only prevents mutation if TypeScript is present. Otherwise it can be easily overwritten, a main selling point of the `enum` type.

Here is a vanilla way to generate an `enum` using a Proxy:

```js
const Enum = (enums) => {
    Object.entries(enums).forEach((enums, [ key, value ]) => {
        enums[value] = key;
        return enums;
    })
    return new Proxy(enums, {
        get(target, key) {
            return target[key];
        },
        removeProperty: () => false,
        set: () => false,
    })
}
```

This disables the ability to add or remove properties, as well as generating the alternating key value that the TypeScript `enum` generates. 

Another benefit? It's reusable, and doesn't create multiple copies of the same code!

```js
const Directions = Enum({
    Up: 1,
    Down: 2,
    Right: 3,
    Left: 4
});

const Compass = Enum([
    "North",
    "East",
    "South",
    "West"
]);
```

## Wow, production ready code for anyone to use, sweet!

> Now hang on.

The difference between my snippet and the code generated by TypeScript is that mine takes advantage of ES6+ features like `Proxy`. If your target audience doesn't include that, my condolences.

My snippet also doesn't come with the backing of Microsoft and the TypeScript team, meaning that it isn't as battle tested. 

The final and most important reason to just use the TypeScript `enum`? They have all the Intellisense benefits. Maybe one day I will work on a type that gives my little function all the same Intellisense goodies.

Until then, just do what you want. 


### Post Script

I think that the code that is generated could probably be updated a little. Like, using an arrow function should be fine.

```js
var Const;
((Const) => {
    Const[Const["Up"] = 0] = "Up";
    Const[Const["Down"] = 1] = "Down";
    Const[Const["Right"] = 2] = "Right";
    Const[Const["Left"] = 3] = "Left";
})(Const || (Const = {}));
```