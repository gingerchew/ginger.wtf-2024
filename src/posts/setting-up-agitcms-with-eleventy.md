---
title: How to setup Agit CMS with your 11ty website.
subtitle: >-
  A CMS for the developer that is tired of writing each post's front matter
  manually, but doesn't have time to integrate a new API.
description: >-
  The hackable, local, markdown based CMS for the developer that doesn't want
  content management to be a whole thing.
date: 2023-11-02T16:13:28.000Z
tags:
  - 11ty
  - how-to
id: agit-cms-eleventy-setup
featured: false
---
I'm tired of writing my own front matter for my posts. It is so boring and I'm always afraid I'm going to forget an attribute. I am always a sucker for consistency. There are plenty of Content Mangement Systems (CMS) out there, especially for the JAMStack group of websites. Contentful, NetlifyCMS, others, I've set them up before and they're all good. It feels like too much when I'm the only one making the content.

## In comes `Agit`

I know what you're thinking. 

> Like "a git"?

Possibly, I have been pronouncing it that way. On their GitHub repo they have a pronunciation key, `/eɪdʒɪt/` but I don't know how to read those.

### Why use this CMS over others?

Check out their [repo for a full answer](https://github.com/0xsuk/agitcms/tree/main#features), but what appeals to me is that I'm not uploading a whole CMS into my repo. It isn't accessible from the live site. It is a little interface for me to access from my computer while I'm coding.

## Setting it up

Follow along with me on the Agit [quick start guide](https://github.com/0xsuk/agitcms/blob/main/QuickStart.md).

### Step 1. Install `agitcms` with npm

Install it like you would any other npm package, `npm install agitcms` or `npm i agitcms` for the true nerds out there.

### Step 2. Run `agitcms`

This one tripped me up, but was probably a me issue. I ran `agitcms` and got `command not found`. So I tried `npx agitcms` and the `localhost:3131` that it generated didn't load properly.

What worked for me was adding a script to the `package.json` that ran the `npx` command.

Here's the abbreviated `package.json`:
```json
{
  "name": "ginger-wtf",
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "watch": "npx @11ty/eleventy --watch",
    "serve": "npx @11ty/eleventy --serve",
    "bench": "DEBUG=Eleventy:Benchmark* npx @11ty/eleventy",
    "build": "npx @11ty/eleventy",
    "test": "echo \"Error: no test specified\" && exit 1",
    "cms": "npx agitcms"
  }
}
```

Now we try running `npm run cms` and it works! My terminal reads out:

```sh
$ npm run cms


> ginger-wtf@1.0.0 cms
> npx agitcms

Backend process started on port: 5151
Agit CMS is live on: http://localhost:3131
```

Neat!

### Step 3. Create your site in the CMS

Visit `http://localhost:3131` in your browser of choice and you should be greeted with a very minimal view. In the top it should say "Home" and have a button labeled "New". Click the button and create your site. 

It will ask you to go through a file picker to find where your posts are kept, but you can pin other folders later on. For now, find where you store your posts normally, and select that.

### Step 4. Set up your front matter

If you're not familiar front matter is anything in between the `---` bars at the start of your markdown files.

For example, I have these as my default:

```yaml
title: This is the title of my super awesome post
subtitle: This is a flashy subtitle for people reading my site
description: This is a description of the post for search engines to focus on
date: 2023-11-1
tags:
    - here
    - are
    - some
    - tags
id: "an-entirely-unique-string"
```
Agit offers what it calls "Type Aware" front matter. This means that when you create the front matter template, you don't accidentally put a date where a string array should be. It also converts longer string values into mulitple lines.

```yaml
subtitle: >
    This is a flashy subtitle for
    people reading my site
```

Visit the site settings using the icon in the sidebar, and set up your front matter template.

Mine is very simple, so if you have a complex configuration, like some meta data, you may need to do more research.

### Step 5. Write the content

Bish bash bosh, jobs done. Hit `Create New` at the top, select file, and get to writing. 

You may notice if you're using 11ty serve, that everytime you type it tries to rebuild the site. That is normal for the way these two interact. To fix it, you will need to update your build/serve command to add the `--incremental` flag.

## Finishing up

I really like the editor. It's a step above IDE, but not some huge drag and drop, component based, API driven editor. It's like if Obsidian was for websites. No plugins. No huge list of extra dependencies. No React powered doo-dahs. It is a thin layer of content management. 

My one gripe is that it puts markdown before front matter in editor navigation. I think it would be nice to be able to reorder those. But that is sincerely my one gripe.

If you're the kind of developer who writes their own bash scripts to create a new post, try this out and see if it fits your style.