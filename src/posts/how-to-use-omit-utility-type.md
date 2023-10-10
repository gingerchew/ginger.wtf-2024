---
title: How to use the Omit utility type to enhance existing DOM Interfaces
date: '2021-10-31'
tags:
  - typescript
  - validity-state
  - utility-types
---

## Checking the `<input />`s that matter

I needed to check whether an input was valid. I could check just the old faithful `input.validity.valid === true`. Problem is I needed to check this input alongside inputs I'd really rather ignore. For example, `[type="hidden"]`, `[type="password"]`, `[type="search"]`. I'd rather just ignore these entirely.

If I was using just Vanilla&reg; JavaScript&copy;, I would just add a property to the `input` element;

```js
input.__ignore = ['hidden','search','password'].includes(input.type);
```

Then in my validation loop, just look for `input.__ignore` to be true, and `continue`.

Since I was using TypeScript, I couldn't do that so easily. I'd rather build on top of an existing interface than try and keep track of my own.

### Have you heard of ValidityState?

ValidityState is a built-in interface that comes with `<input>`, you can check it out when you log `input.validity`. The interface looks like this:

```ts
interface ValidityState {
	valid: boolean;
	badInput: boolean;
	customError: boolean;
	patternMismatch: boolean;
	rangeOverflow: boolean;
	rangeUnderflow: boolean;
	stepMismatch: boolean;
	typeMismatch: boolean;
	valueMissing: boolean;
}
```

This is exactly what I need *(and some of what I don't)*. I still have my problem of "I need to set some inputs as "ignore" as well as valid/invalid.

Looking through the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), I found what I was looking for with the utility type [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys).

### Using Omit

Say you have interfaces like this:

```ts
interface UserProperties {
    name: string;
    age: number;
    birthday: number;
}

interface UserNumberProperties {
    age: number;
    birthday: number;
}
```

Because we've been **inundated** with articles about not repeating ourselves, your eye is probably twitching. Fear not, we have a solution: `Omit`.

```ts
interface UserProperties {
    name: string;
    age: number;
    birthday: number;
}

interface UserNumberProperties extends Omit<UserProperties, 'name'>;
```

Now our interface `UserNumberProperties` only contains `age` and `birthday`. Now how did I apply this to `ValidityState`?

```ts
interface Validity extends Omit<ValidityState, 'valid'>;
```

> Wait that doesn't solve the problem though? Now your interface doesn't even expect anything to be valid or not.

### Building on top of Omit

The second feature of `Omit` is that you can just append an object with properties to build onto it.

```ts
interface Validity extends Omit<ValidityState, 'valid'>{
    valid: boolean | 'ignore';
}
```

This doesn't just apply to properties that already existed on the original interface either. The initial `ValidityState` interface doesn't let you get values using `ValidityState['key']`. We can fix this though!

```ts
interface Validity extends Omit<ValidityState, 'valid'>{
    valid: boolean | 'ignore';
    mySuperSpecialCustomValidation: () => void;
    [index: string]: boolean | string | () => void;
}
```

*Note: If we weren't adding the `'ignore'` value as an option for `Validity.valid` or the callback function, then our index would just be `[index:string]: boolean;`*

I had my dream `ValidityState` interface in 4 lines of code. With the added benefit that I was building **on top of** the existing JavaScript interfaces that exist.