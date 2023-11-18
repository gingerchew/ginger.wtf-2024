const Image = require('@11ty/eleventy-img');

module.exports = {
    image: async (src, alt, classNames) => {
        const meta = await Image(src, {
            widths: [300, 600],
            formats: ['webp','avif'],
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