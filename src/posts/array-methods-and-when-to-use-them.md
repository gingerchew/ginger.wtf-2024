---
title: Using forEach, map, and reduce
description: A quick learner on how each method is done and when to use them
subtitle: Looping through arrays is easy when you know how
date: 2023-10-30
tags:
    - explainer
    - tutorial
    - javascript
id: 'using-foreach-map-and-reduce'
---

First thing to get out of the way is that each of these methods returns something different. 

`.forEach` only loops through the array it is called on. This means that it returns `undefined`.

For `.map`, it returns a new array where each item is the result of the given callback.

The much more complex method, `.reduce`, can return anything. The return type is determined by the second argument passed and the callback.

Here are some examples:
```js
const iceCreamTypes = [
    'vanilla',
    'chocolate',
    'strawberry',
    'mint'
];

const forEachResult = iceCreamTypes.forEach((type, index) => {
    // Capitalize the icecream names
    iceCreamTypes[index] = type[0].toUpperCase() + type.slice(1);
})

console.log(forEachResult) // undefined

// Add organic types
const newIceCreamTypes = donutPrices.map((type, index) => {
    return type + ' Organic';
});


// Merge the two arrays together in blissful frozen harmony
const finalIceCreamTypes = iceCreamTypes.reduce((allIceCreamTypes, currentIceCreamType, index) => {
    allIceCreamTypes.push(currentIceCreamType);
    allIceCreamTypes.push(newIceCreamTypes[index]);

    return allIceCreamTypes;
}, []);
```

## Why use `.forEach` instead of `for in` or `for of`

Personally, it depends on preference. Call me old fashioned, but I like using for loops. If I need to do some stuff to every item in an array, I'll usually reach for `for` loops. If I am writing that same `for` loop everywhere, then it is time to put it in a callback `.forEach`.

## Why use `.map` instead of `for in` or `for of`

Let's say you need to run a callback on each item in an array, but need a new array with the results of each callback. With `for of` then you would likely end up with something like this:

```js
const itemArr = [...];
const updatedItemArr = [];

for (const item of itemArr) {
    // run some code to alter the item
    updatedItemArr.push(item);
}
```

But with `.map`, that example looks more like this:

```js
const itemArr = [...];
const updatedItemArr = itemArr.map((item) => /*run some code to alter the item */);
```

It is more explicit to me to do it the second way instead of the first.

## Why use `.reduce` instead of `.forEach`, `.map`, `for in`, `for of`

The `.reduce` method is a powerhouse if you know what it can do. For example, I need to make a menu string based on an object that is returned from a database.

```js
const returnedMenuData = [
    {
        name: 'pasta',
        price: 16,
    },
    {
        name: 'burger',
        price: 12,
    },
    {
        name: 'pizza',
        price: 14,
    }
];

const formattedMenuTemplate = returnedMenuData.reduce((templateString, { name, price }) => {
    const newName = name[0].toUpperCase() + name.slice(1);
    const formattedPrice = currencyFormatter.format(price); // Assume this is an Intl.NumberFormat object

    const template = `
        <div class="menu-row">
            <p>${newName}</p>
            <hr />
            <p><small>${formattedPrice}</small></p>
        </div>`

    return templateString + template;
}, '');


MenuElement.insertAdjacentHTML('beforeend', formattedMenuTemplate);
```

You can see we were able to update each value, convert it into a template, and return the result as a string to be used as a template for our menu.

When you reduce an array, it is easier to perform multiple array methods at once.

```js
const returnedMenuData = [
    {
        name: 'pasta',
        price: 16,
        onSale: false,
    },
    {
        name: 'burger',
        price: 12,
        onSale: true,
    },
    {
        name: 'pizza',
        price: 14,
        onSale: true,
    }
];

const onlyItemsOnSale = returnedMenuData.reduce((templateString, { name, price, onSale }) => {
    if (!onSale) return templateString;

    const newName = name[0].toUpperCase() + name.slice(1);
    const formattedPrice = currencyFormatter.format(price); // Assume this is an Intl.NumberFormat object

    const template = `<div class="menu-row">
        <p>${newName} <b>ON SALE NOW!!</b></p>
        <hr />
        <p>${formattedPrice}</p>
    </div>`
}, '');

OnlyTheSpecialsMenu.insertAdjacentHTML('beforeend', onlyItemsOnSale);
```

In this example, we've done `.filter` and `.map` in a single callback. 

That in mind, `.reduce` should not be the first tool in your tool belt.

## In summary...

Each method has their own purpose, but knowing when is tough. 

Do you have a simple array that you need to loop through? You can use `.forEach`.

Do you need to get a new array from the results of your callback? You should use `.map`.

Do you have a complex series of tasks, such as filtering, flattening, and mapping, and doing it all in one function would make life easier? Then it's time you learn `.reduce`.