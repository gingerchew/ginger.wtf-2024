const { DateTime } = require('luxon')
const { JSDOM } = require('jsdom')
const { uid } = require('uid');

function siblingNav(posts, currentPage) {
    const set = new Set();

    posts = posts.sort((a, z) => {
        set.add(+Date.parse(a.date));
        return +Date.parse(a.date) > +Date.parse(z.date)
    });

    const indexOfCurrPost = posts.findIndex(post => post.url === currentPage.url);

    let prevPost = null;
    let nextPost = null;

    posts.forEach((post, i) => {
        if (i < indexOfCurrPost) prevPost = post;
    })


    posts.forEach((post, i) => {
        if (i > indexOfCurrPost && nextPost === null) nextPost = post;
    });

    return {
        prev: prevPost,
        next: nextPost
    };
}


module.exports = {
    siblingNav,
    makeTagUrl(tag) {
        return `/tags/${tag}/`
    },
    dateToFormat: function (date, format) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        )
    },

    dateToISO: function (date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    getCacheBust(date) {
        const seed = date + Math.random();

        return uid(seed.length);
    },

    obfuscate: function (str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    },

    filterTagList(tags) {
        return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
    },
    /**
     * This is a work around for FeedBin
     * 
     * Apparently some styles and elements are not brought over from the content returned by 11ty
     * these being the direct anchor links, or heading links, or jump links
     * any <br/> elements
     * and the new lines after spans in pre>code type components
     * @param {TheContent} content 
     * @returns TheContent
     */
    fixForFeedbin(content) {
        const doc = new JSDOM(content);

        doc.window.document.querySelectorAll('a.direct-link').forEach(el => el.remove());
        doc.window.document.querySelectorAll('br').forEach(el => {
            el.insertAdjacentHTML('beforebegin', '\n');
            el.remove();
        });
        doc.window.document.querySelectorAll('pre[class] > code[class]').forEach(el => {
            el.style.whiteSpace = 'pre-wrap';
        })
        const newContent = doc.window.document.body.innerHTML;

        return newContent;
    }
}
