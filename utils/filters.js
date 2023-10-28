const { DateTime } = require('luxon')

const getMonthlyPosts = (posts, year) => {
    let months = [];
    for(let month = 0; month < 12; month++) {
        let count = posts.filter(function(post) {
            if(!post.data.tags) {
                return true;
            }
            if(post.data.deprecated ||post.data.tags.includes("draft")) {
                return false;
            }
            return true;
        }).filter(function(post) {
            let d = post.data.page.date;
            return d.getFullYear() === parseInt(year, 10) && d.getMonth() === month;
        }).length;

        months.push(count);
    }
    return months.join(",");
};


module.exports = {
    getMonthlyPosts, 
    dateToFormat: function (date, format) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        )
    },

    dateToISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    obfuscate: function (str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    },

    filterTagList (tags) {
        return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
    }
}
