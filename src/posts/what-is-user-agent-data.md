---
title: What is UserAgentData?
subtitle: 'navigator.userAgent is out, UserAgentData is in'
description: >-
  What is UserAgentData and why is it better than the userAgent string we're all
  used to
date: '2023-12-31T12:45:05-05:00'
tags:
  - explainer
id: what-is-useragentdata
featured: false
published: true
---
If you've ever had a client try to explain a bug, you know the inevitable and hardest question to answer is "What browser are you using?"

## What is `navigator.userAgent`?

<details>
  <summary>Disclaimer</summary>
  <p>I am no expert on the deep and horrid history behind the current userAgent string contents. I suggest checking out [this article by webaim to learn more.](https://webaim.org/blog/user-agent-string-history/)</p>
</details>

The User-Agent is a way for browsers to differentiate themselves from other browsers. The problem is that it became very convoluted very quickly.

For example, this is your User-Agent:

<user-agent></user-agent>

Notice anything weird? A lot of that information is probably wrong or at least misleading.

If you're using Chrome, you probably see 'AppleWebKit' somewhere in there. This is because the engine that Chrome is built on, Blink, is a fork of the engine Safari is built on, WebKit.

Rather than change the AppleWebKit out for Blink, they added a new piece, Chrome/120.0.0.0 (the numbers may vary depending on the current version of your browser.)

## What is `navigator.userAgentData`?

Now we know that `userAgent` is a mess, it's clunky and full of misleading and irrelevant information.

There have been a lot of attempts at parsing the userAgent string to be something more parseable, and more relevant. This is an adhesive bandage on top of a structural issue. It is better to deprecate the old userAgent in favor of something more specific, userAgentData.

Specifically, this is part of [User-Agent Client Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity) which is a new-ish (at time of writing) way to interact between browser and server. The user is on a mobile device? We should prioritize any mobile only code, and defer the desktop code for another time. The user is using a version of a browser that is *quirky*, let's include a polyfill to fix that *quirk*.

Here's a breakdown of the information directly available from the userAgentData object:

<user-agent-data></user-agent-data>

This information is much more accurate, but there is even more information to be had if you use the `getHighEntropyValues()` method.

<user-agent-data use-high-entropy></user-agent-data>

[By passing in various hints](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/getHighEntropyValues#hints) as the first argument we are able to asynchronously get more, and more accurate, information.

For example:

```js
const platform = navigator.userAgentData.platform;

const entropic = await navigator.userAgentData.getHighEntropyValues(['architecture']);


console.log(platform === entropic.platform); // true
console.log(entropic.architecture) // 64
```

## A word about privacy

If you're worried about privacy, you've probably heard the term 'finger-printing' before. The concept that by tracking down small bits of information about a user a bigger more meaningful profile can be made.

I would argue that this could lead to a more robust profile on what devices a user has when using an app, but [Google says this is more about exposing the same information in a safer way](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints#introducing_the_new_user-agent_client_hints). Instead of revealing every single detail that comes in the User Agent string, the server asks the browser (or the web page asks the browser) for specific information and the browsers specific profile returns the information.

This is a more privacy focused pattern, I admit.

## When should we use it?

Any place that you are currently using user agent sniffing, replace it with this. [There is a polyfill (and ponyfill) by user fuweichin on GitHub](https://gist.github.com/fuweichin/18522d21d3cd947026c2819bda25e0a6) if you're worried about support for older browsers.

