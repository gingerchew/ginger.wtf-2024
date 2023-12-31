
const _cookie = ctx => {
    return {
        get(name) {
            return ctx.cookies.get(name)
        },
        set(name, value) {
            ctx.cookies.set({
                name,
                value,
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'Lax'
            });
        }
    }
}

const _next = (ctx) => () => ctx.next();

export default async (request, context) => {
    const url = new URL(request.url);
    const next = _next(context);
    const cookie = _cookie(context)

    if (url.pathname !== '/style/') return next();

    const body = await request.text();

    const postData = Object.fromEntries(new URLSearchParams(body));

    postData.theme && cookie.set("theme", postData.theme);
    postData.mode && cookie.set("mode", postData.mode);

    return new Response('success', {
        status: 200,

    });
}