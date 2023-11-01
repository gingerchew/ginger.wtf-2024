---
title: Using Arc Browser's exposed custom properties to theme my website
description: Bringing back some of the old web style site, I'm building a theme with the help of Arc.
tags: 
    - retrospectives
    - success
    - css
id: 'arc-browser-theme'
date: 2023-10-25
---

I'm in the process of making a theme switcher for my site, this means messing with CSS custom properties. Checking and double checking contrast ratios, thinking up worth-while themes.

As I was flipping through different themes though, I noticed at the very end of the inspector stylesheet a series of custom properties.

```css
:root {
    --arc-background-gradient-color0: #D2F3E5FF;
    --arc-palette-foregroundTertiary: #51D19BFF;
    --arc-palette-cutoutColor: #1A6545FF;
    --arc-palette-minContrastColor: #1A6545FF;
    --arc-palette-focus: #3E8269CE;
    --arc-palette-background: #001E15FF;
    --arc-palette-subtitle: #6B7A74FF;
    --arc-palette-maxContrastColor: #D6F4E8FF;
    --arc-background-gradient-overlay-color0: #00000000;
    --arc-palette-hover: #4B8E777A;
    --arc-palette-foregroundSecondary: #51D19BFF;
    --arc-palette-foregroundPrimary: #D6F4E8FF;
    --arc-palette-backgroundExtra: #000F0AFF;
    --arc-palette-title: #D7E8E3FF;
    --arc-background-gradient-color1: #D2EBF3FF;
    --arc-background-gradient-overlay-color1: #D5F3D2FF;
}
```

## What to do, what to do

Okay, now before I go messing with these custom properties, I have to remember some things.

- 1 Color contrast is a very serious issue across the web
- 2 **_YOU_** suffer from low contrast woes across the web
- 3 You can't guarantee these custom properties will be here forever. Arc may decide to remove these down the rode, then you have a theme that does nothing.

That in mind, lets fiddle. 

## Finding the background color

The code that is pasted above is for a color scheme that is a complementary triad in the green spectrum.

You would think that `--arc-palette-background` would be my go to choice, but its not going to work with my light theme.

If you can't read hex, the `--arc-palette-background` is essentially a very pretty black. No good.

I have my eyes on `--arc-palette-maxContrastColor`.

This is a very light, almost white, green. It actually looks green! I'm all in on that being the background color. Now we need to check out contrasts.

## Planning out your theme

My theming properties are pretty simple:

```css
:root {
    --textColor: #070901;
    --primaryColor: #765df4;
    --focusColor: #765df4;
    --backgroundColor: #fff;
    --complementColor: #e7c1fb;
    --complementColorRGB: 231,193,251;
    --accentColor: #7a10e5;
}
```

We gotta throw out `--complementColorRGB` since I don't have a way of deriving that from whatever property I do end up using for `--complementColor`. For now, I'm going to set it as `0, 0, 0`, or black.

Next up is `--textColor`, and looking at the colors Arc provides in the copied CSS, none of them seem all that special compared to the color I am already using `#070901`. 

For `--primaryColor` I want to use something from the gradient picker. `--arc-background-gradient-color1` looks very nice, a bright purple. Only downside is that that property doesn't exist if the theme only has 1 color.

As a fallback, I'm going to set `--primaryColor` to be `--arc-palette-cutoutColor`.

`--arc-palette-cutoutColor` and `--arc-palette-minContrastColor` are the same for my particular theme set up. So this may change with some testing.

I'm going to use `--arc-palette-background` for my `--complementColor` as it works out to be a darker version of the `--primaryColor`.

Arc provides a focus color variant so `--arc-palette-focus` will be my `--focusColor`.

`--accentColor` is used on links primarily, to be safe, I am going to set that to `--arc-palette-cutoutColor`.

This is what I would call "safe".

## Using `gradient-color-1` and friends

I do like the idea of adding these gradient colors in as accents and what not.

So let's work it in. Right now my variable usage looks like this:

```css
:root[data-theme=arc] {
    --backgroundColor: var(--arc-palette-maxContrastColor);
    --primaryColor: var(--arc-palette-cutoutColor);
    --complementColor: var(--arc-palette-background);
    --focusColor: var(--arc-palette-focus);
    --accentColor: var(--arc-palette-minContrastColor);
    --complementColorRGB: 0,0,0;
}
```

I want the accent to really pop, so lets add in the `--arc-background-gradient-color1` as the `--accentColor`

```css
:root[data-theme=arc] {
    --accentColor: var(--arc-background-gradient-color1, var(--arc-palette-minContrastColor));
}
```

If you speak hex, you know that `#D2EBF3FF` is essentially white. Not going to work in a light theme. In fact all of the colors in the theme are so close to white that they don't stand a chance of passing AAA or AA.

I still want that pop though. Using the 3 complementary colors won't achieve that unfortunately.

If I assume the gradient has 1 primary with 2 secondary across from it, it works out better. But fiddling with it more, there isn't a way to _guarantee_ that `--arc-background-gradient-color1` will contrast with the background.

Maybe when `color-contrast()` is better supported, I can revisit that idea.

## Dark theme

This was actually really simple to implement. All the light colors become dark, and the dark become light.

```css
:root[data-theme=arc][data-mode=dark] {
    --primaryColor: var(--arc-palette-cutoutColor);
    --complementColor: var(--arc-palette-subtitle);
    --focusColor: var(--arc-palette-focus);
    --complementColorRGB: 0,0,0;
    --backgroundColor: var(--arc-palette-background);
    --textColor: var(--arc-palette-title);
    --accentColor: var(--arc-palette-maxContrastColor);
}
```

For `--focusColor` and `--primaryColor`, I was comfortable not changing those. They still contrasted well enough with the new background, `--arc-palette-background`.

Swapping `--arc-palette-minContrastColor` for `--arc-palette-maxContrastColor` for the `--accentColor` keeps that nice contrasting pop that it should have.

`--arc-palette-title` was a light green, which could not contrast against the white background, now contrasts very nicely against `--arc-palette-background`. This becomes the new `--textColor`

`--complementColor` needed to change from its previous "slightly darker green" designation to a "slightly lighter green". I chose to use `--arc-palette-subtitle`. Essentially what `--complementColor` is used for anyways.

## The downsides

I know, but there has to be one. The downside is the custom properties are added later in the page loading process. This means there is a flash of the default theme before the proper Arc colors show.

## How do you make sure it always passes contrast requirements?

Well, 👉👈 I can't. It is a "use at your own risk" theme for now. I tested it with a handful of themes and they passed, so I don't think it will be an issue. It is cool to see them expose these colors for developers to use, and I would love to see them expand the palette as well.
