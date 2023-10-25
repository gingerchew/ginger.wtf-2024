---
title: Create a custom element
date: 2023-10-25
tags:
  - explainer
id: 'array-from-vs-spread'
---

I had a conversation with a coworker about the merits of using spread `...` vs `Array.from`. While they look the same on the outside, they work differently.

## Iterable vs. Length

If you want to spread something into an array, it *needs* to have a `Symbol.iterator` property.

This means that the following Javascript will fail:

```js
const spreadObject = [...{ user: 'jane' }];
```

Even though this would work:

```js
const user1 = {
    user: 'eloise'
};

const updatedUserInfo = {
    lastLogin: 'today'
};

const user1New = {
    ...user1,
    ...updatedUserInfo
};
```

The solution would be to add a `[Symbol.iterator]` generator function to the object, which is honestly not worth it.

`Array.from` creates an array if the object has either an iterator or  `.length` property.

## Built in mapping function

Have you ever seen a snippet like this:

```js
const mappedArray = [...arr].map(item => {
    // do stuff to item
})
```

Did you know that that creates 2 arrays? `Array.from` has a built in mapping function though.

```js
const mappedArray = Array.from(arrLike, item => {
    // do stuff to item
})
```

I find this helps keep things more explicit, especially when you are not using an inline function.

```js
const approveUser = (user) => ({
    ...user,
    approved: user.age > 21
});

const allApprovedSpreadUsers = [...users].map(approveUser).every(user => user.approved);

const allApprovedMappedUsers = Array.from(users, approveUser).every(user => user.approved);
```

*Do you need to care about making that extra array? Probably not, but it is a neat thing to remember.*

## Which do you use?

I usually reach for `Array.from`. The spread operator is very useful when getting `n` arguments from a funciton, and spreading objects into another is priceless.

```js
const mergeUserInfo {
    ...userFromSource1,
    ...userFromSource2
};

function approveMergedUsers(user1, ...otherUsers) {
    // do user stuff
}
```

Either way, I think `Array.from` is worth keeping in your tool belt.