---
title: Making a privacy respecting hit counter with Plausible analytics
subtitle: Sometimes a bit of old Web 2.0 flavor is needed to add spice to life
description: Adding a hit counter with Plausible is private and quick using their aggregate API
tags:
    - privacy
    - eleventy
    - build-with-me
id: making-hit-counter-plausible
date: 2023-11-03
featured: false
---

<details>
    <summary>Quick notice before you continue</summary>
    <p>As of <code>11-1-2023</code> the following code seems to only work when run on local. Will update this post when I have a solution figured out.</p>
</details>

Remember Neocities? Remember _Geocities_?? I missed out on that craze, but I love looking back on that style of website. 

Clashing fonts, way too many gifs, "Under Construction" banners that never went away. Beautiful stuff.

So here's how I'm going to bring that back, using [Plausible](https://plausible.io) and their privacy respecting API.

## What is Plausible?

Plausible is an analytics platform that respects user privacy. No IP tracking, no persistent cookie, nothing skeezy. It only shows me how many people visit your site, what site they came from, what pages they visit, which the leave from. Simple as can be.

They also offer an API.

## What do we want?

Page views. That's it. 

Going to their [API Documentation](https://plausible.io/docs/stats-api) there's a couple of endpoints like `timeseries`, `breakdown`, `visitors`. What we need is `aggregate`. 

My site is built with 11ty, so I create a new file in my `_data` directory called `stats.js`. I'm using the `.js` extension so that I can dynamically pull in the pageview numbers.

For caching it, we use the tried and true `@11ty/eleventy-fetch`. This looks something like this:

```js
const EleventyFetch = require('@11ty/eleventy-fetch');

const siteId = 'ginger.wtf';
const endpoint = 'https://plausible.io/api/v1/stats/aggregate';

module.exports = async function() {
    const requestUrl = `${endpoint}?site_id=${siteId}&period=6mo&metrics=pageviews`;

    return EleventyFetch(requestUrl, {
        type: 'json',
        duration: '1d',
    });
}
```

We `require` our dependency and add required parameters, those being `site_id`, `period`, and `metrics`.

The documentation lists the different time formats, but none of them are "all time". I need more data.

To fix this, we update the `period` parameter to `period=custom`. This means we also need to add a `date` parameter. 

I started using Plausible on November 1st, 2022. The date format used in the parameter is the same as what `new Date().toISOString()` returns.

Here's our updated snippet:

```js
const EleventyFetch = require('@11ty/eleventy-fetch');

const siteId = 'ginger.wtf';
const endpoint = 'https://plausible.io/api/v1/stats/aggregate';

const plausibleStart = '2022-11-01';

// toISOString returns something like this: 2023-11-01T21:21:26.654Z
// so we split on the `T` for the date only
const plausibleEnd = new Date().toISOString().split('T')[0]

module.exports = async function() {
    const requestUrl = `${endpoint}?site_id=${siteId}&period=custom&date=${plausibleStart},${plausibleEnd}&metrics=pageviews`;


    return EleventyFetch(requestUrl, {
        type: 'json',
        duration: '1d'
    });
}
```

## Authorization

Plausible's API uses the Bearer Token authorization method. Open up your user settings and generate an API token. Now drop that in a `.env` file. *Also remember to add `.env` to your `.gitignore` if it isn't already there!*

We want to grab that with JavaScript so that we don't expose any other data. Install `dotenv` as a dependency and include it in our script. Also add in the proper `headers` option to the `EleventyFetch`.

```js
const EleventyFetch = require('@11ty/eleventy-fetch');

require('dotenv').config();
const token = process.env.AUTHORIZATION;

const siteId = 'ginger.wtf';
const endpoint = 'https://plausible.io/api/v1/stats/aggregate';

const plausibleStart = '2022-11-01';

// toISOString returns something like this: 2023-11-01T21:21:26.654Z
// so we split on the `T` for the date only
const plausibleEnd = new Date().toISOString().split('T')[0]

module.exports = async function() {
    
    const requestUrl = `${endpoint}?site_id=${siteId}&period=custom&date=${plausibleStart},${plausibleEnd}&metrics=pageviews`;

    return EleventyFetch(requestUrl, {
        type: 'json',
        duration: '1d',
        fetchOptions: {
            headers: {
                Authorization: 'Bearer '+token,
            }
        }
    });
}
```

## Final touches on our data

The fetch works! If it didn't work for you, [double check their guide with PostMan](https://plausible.io/docs/get-started-with-postman)

The result is wrapped in an object though. This means our data looks like this:

```json
{
    "results": {
        "pageviews": {
            "value": 200
        }
    }
}
```

Not a fan.

Here's my fix:

```js
const EleventyFetch = require('@11ty/eleventy-fetch');
require('dotenv').config();


const siteId = 'ginger.wtf';
const token = process.env.AUTHORIZATION;
const endpoint = 'https://plausible.io/api/v1/stats/aggregate';

const plausibleStart = '2022-11-01';

// toISOString returns something like this: 2023-11-01T21:21:26.654Z
// so we split on the `T` for the date only
const plausibleEnd = new Date().toISOString().split('T')[0]

module.exports = async function() {
    
    const requestUrl = `${endpoint}?site_id=${siteId}&period=custom&date=${plausibleStart},${plausibleEnd}&metrics=pageviews`;

    const fetchObj = await EleventyFetch(requestUrl, {
        type: 'json',
        duration: '1d',
        fetchOptions: {
            headers: {
                Authorization: 'Bearer '+token,
            }
        }
    });

    return fetchObj.results
}
```

## Making our hit counter

This is what the code looks like:

{% raw %}
```njk
<span class="hit-counter">
    hits: {{ stats.pageviews.value }}
</span>
```
{% endraw %}

Yeah, really, it's that simple. The data cascade in 11ty is powerful.

If you are doing this yourself, you should really explore what all is available through the Plausible API. It's a great service, worth every penny. There's a sense of peace knowing you're not selling your users data or breaking the law by using your analytics.

