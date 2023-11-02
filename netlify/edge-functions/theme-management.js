import { EleventyEdge, precompiledAppData } from './_generated/eleventy-edge-app.js';

const setCookie = (context, name, value) => {
    context.cookies.set({
        name,
        value,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
    });
}

export default async (request, context) => {
    const t = 'theme';
    const m = 'mode';

    let tCookies = context.cookies.get(t);
    let mCookies = context.cookies.get(m);
    
    if (!tCookies) {
        setCookie(context, t, 'light');
        tCookies = context.cookies.get(t);
    }

    if (!mCookies) {
        setCookie(context, m, 'default');
        mCookies = context.cookies.get(m);
    }

    try {
        /*
        const edge = new EleventyEdge('edge', {
            request,
            context,
            precompiled: precompiledAppData,
            cookies: []
        });
        */

        edge.config(eleventyConfig => {
            eleventyConfig.addGlobalData('theme', tCookies);
            eleventyConfig.addGlobalData('mode', mCookies);
        })

        return await edge.handleResponse();
    } catch(e) {
        console.log("ERROR", { e });
        return context.next(e);
    }
}