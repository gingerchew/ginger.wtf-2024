import { EleventyEdge, precompiledAppData } from './_generated/eleventy-edge-app.js';

export default async (request, context) => {
    const t = 'theme';
    const m = 'mode';

    let tCookies = context.cookies.get(t);
    let mCookies = context.cookies.get(m);
    
    if (!tCookies) {
        context.cookies.set({ name: t, value: 'light' });
        tCookies = context.cookies.get(t);
    }

    if (!mCookies) {
        context.cookies.set({ name: m, value: 'default' });
        mCookies = context.cookies.get(m);
    }

    console.log(tCookies, mCookies);
    try {
        const edge = new EleventyEdge('edge', {
            request,
            context,
            precompiled: precompiledAppData,
            cookies: []
        });

        edge.config(eleventyConfig => {
            console.log('Inside of config');
            eleventyConfig.addGlobalData('theme', tCookies);
            eleventyConfig.addGlobalData('mode', mCookies);
        })

        return await edge.handleResponse();
    } catch(e) {
        console.log("ERROR", { e });
        return context.next(e);
    }
}