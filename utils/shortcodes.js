const Image = require('@11ty/eleventy-img');

module.exports = {
    profilePic: async (src, alt) => {
        const meta = await Image(src, {
            width: 300,
            formats: ['avif'],
            urlPath: '/images/',
            outputDir: './_site/public/images/'
        });

        const { avif } = meta;
        const data = avif[avif.length - 1];

        return `<img src="${data.url}" width="${data.width}" height="${data.height}" alt="${alt}" decoding="async" loading="lazy" class="u-photo h-card" />`
    },
    image: async (src, alt, classNames) => {
        const meta = await Image(src, {
            widths: [300, 600],
            formats: ['avif'],
            urlPath: '/images/',
            outputDir: './_site/public/images/'
        });

        let imageAttributes = {
            alt,
            class: classNames,
            loading: 'lazy',
            decoding: 'async'
        }

        return Image.generateHTML(meta, imageAttributes);
    }
}