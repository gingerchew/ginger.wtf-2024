---
title: 'I wanted analytics for my fan fiction, and so can you!'
subtitle: Using only HTML and some free-tier services
description: ''
date: '2024-02-27T09:39:30-05:00'
tags:
  - explainer
  - javascript
  - deno
id: fan-fiction-analytics
featured: true
published: true
---
For the longest time I wanted to be a writer. I loved reading as a kid, and I wanted to give that gift back to "*the next generation*" or whatever. 

To satisfy this dream, I started writing fan fiction (I won't link to it, but if you find it, congratulations), and it has been a joy. The site I have been posting to offers some analytics, but it is nothing deeper than a hit counter.

## The plan

Using Deno Deploy and JSONBin.io, I'm going to hand roll an analytics system that can be added to the content by using an `<img>` tag.

```html
<img src="https://deno-deploy-subdomain.deno.com/?param1=a&param2=b" alt="" aria-hidden="true" height="1" width="1" />
```

First thing to do is open up a Deno Deploy playground and get some requests received. The code will look like this:

```ts
Deno.serve((req: Request) => {
    const params = new URL(req.url).searchParams;

    const workName = params.get('work');
    const chapter = params.get('chapter');

    // update the records

    return new Response("");
});
```

Each work will have a name, and they will have chapters. Each work will look roughly like this inside of JSONBin.

```js
{
    "workname": [
        {
            "chapter": 1, 
            "views": [{ ts: Date.now(), formatted: /* formatted version using Intl.DateTimeFormat */ }],
            "viewCount": 1
        }
    ]
}
```

Next let's get JSONBin.io set up and add those requests.

```ts
Deno.serve(async (req: Request) => {
    // ...
    const bin = await fetch('https://api.jsonbin.io/v3/b/$BIN_ID/latest', {
        headers: new Headers({ 'X-Master-Key': Deno.env.get('key') })
    });

    let { record } = await bin.json();

    if (workName in record === false) {
        /* Create a record inside for the viewed work */
    }

    for (const chapterRecord of record[workName]) {
        chapterRecord.views.push({ ts, formatted });
        chapterRecord.viewCount += 1;
    }
});
```

Finally, I send up the updated record to JSONBin, which we can do by just doing a fetch using the PUT method:

```ts
Deno.serve(async (req: Request) => {
    // ...

    await fetch('https://api.jsonbin.io/v3/b/$BIN_ID', {
        headers: new Headers({
            'Content-Type': 'application/json',
            'X-Master-Key': Deno.env.get('key')
        }),
        body: JSON.stringify(record),
        method: 'PUT'
    })
});
```

At the bottom of every work I publish now I add a `<img>` tag with the required params:

```html
<img src="https://deno-deploy-subdomain.deno.com/?work=MY_WORK_NAME&chapter=1"
    alt=""
    aria-hidden="true"
    width="1"
    height="1"
/>
```

All images need an `alt=""` attribute, but since this image is not technically an image, I want to make sure screen readers don't see it either. This is why I've added the `aria-hidden="true"`.

## And with that, it is done!
Now the analytics are set up. Viewing a work gives a ping to the JSONBin api, adding a view with a timestamp and incrementing the overall count. This isn't a kitchen sink solution and it is in dire need of a frontend for better data visualization. 