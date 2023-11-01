import { EleventyEdge, precompiledAppData } from './_generated/eleventy-edge-app.js';

export default async (request, context) => {
    const t = 'theme';
    const m = 'mode';

    const tCookies = context.cookies.get(t);
    const mCookies = context.cookies.get(m);
    
    if (!tCookies) {
        context.cookies.set(t, 'light');
    }

    if (!mCookies) {
        context.cookies.set(m, 'default');
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