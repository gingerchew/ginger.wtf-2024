const EleventyPluginTagCloud = require('eleventy-plugin-tag-cloud');
const EleventyPoison = require('eleventy-plugin-poison');

// const schema = require("@quasibit/eleventy-plugin-schema");
require('dotenv').config();

const EleventyPluginPlausible = require('eleventy-plugin-plausible');

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const EleventyWebMentions = require('eleventy-plugin-webmentions');

const EleventyRocksReadTime = require('@11tyrocks/eleventy-plugin-emoji-readtime')
const EleventyInclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language')
const { EleventyEdgePlugin } = require('@11ty/eleventy')
const EleventyPluginNavigation = require('@11ty/eleventy-navigation')
const EleventyPluginRss = require('@11ty/eleventy-plugin-rss')
const EleventyPluginSyntaxhighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')

const rollupPluginCritical = require('rollup-plugin-critical').default

const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')

const { resolve } = require('path')

module.exports = function (eleventyConfig) {
	eleventyConfig.setServerPassthroughCopyBehavior('copy');
	eleventyConfig.addPassthroughCopy("public");

	// Plugins

	eleventyConfig.addPlugin(EleventyPluginTagCloud);

	eleventyConfig.addPlugin(EleventyWebMentions, {
		domain: 'ginger.wtf',
		token: process.env.INDIE_WEB_TOKEN
	});
	eleventyConfig.addPlugin(EleventyRocksReadTime);
	
	eleventyConfig.addPlugin(EleventyPluginPlausible, {
		domain: 'ginger.wtf',
		proxyPath: '/js/script',
		exclude: [ '/style/', '/test' ],
	});

	eleventyConfig.addPlugin(EleventyPoison);
	

	eleventyConfig.addPlugin(EleventyPluginNavigation)
	eleventyConfig.addPlugin(EleventyPluginRss)
	eleventyConfig.addPlugin(EleventyInclusiveLanguage)
	eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight)
	eleventyConfig.addPlugin(EleventyEdgePlugin)
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			publicDir: 'public',
			clearScreen: false,
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			appType: 'custom',
			assetsInclude: ['**/*.xml', '**/*.txt'],
			build: {
				mode: 'production',
				sourcemap: 'true',
				manifest: false,
				modulePreload: false,
				// This puts CSS and JS in subfolders – remove if you want all of it to be in /assets instead
				rollupOptions: {
					output: {
						assetFileNames: 'assets/css/main.[hash].css',
						chunkFileNames: 'assets/js/[name].[hash].js',
						entryFileNames: 'assets/js/[name].[hash].js'
					},
					plugins: [rollupPluginCritical({
							criticalUrl: './_site/',
							criticalBase: './_site/',
							criticalPages: [
								{ uri: 'index.html', template: 'index' },
								{ uri: 'posts/index.html', template: 'posts/index' },
								{ uri: '404.html', template: '404' },
							],
							criticalConfig: {
								inline: true,
								dimensions: [
									{
										height: 900,
										width: 375,
									},
									{
										height: 720,
										width: 1280,
									},
									{
										height: 1080,
										width: 1920,
									}
								],
								penthouse: {
									forceInclude: [
										'.fonts-loaded-1 body', 
										'.fonts-loaded-2 body',
									],
								}
							}
						})
					]
				}
			}
		}
	})

	// Filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName])
	})
	
	// Transforms
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName])
	})

	// Shortcodes
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
	})
	
	eleventyConfig.addShortcode('serifName', () => `<span class="serif serif-name"><span class="rotate">G</span>inger</span>`)
	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

	// Customize Markdown library and settings:
	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.linkInsideHeader({
			placement: 'before',
			class: 'direct-link',
			symbol: `<span aria-hidden="true">#</span>
					<span class="visually-hidden">Jump to heading</span>`,
			level: [1, 2, 3]
		}),
		slugify: eleventyConfig.getFilter('slug')
	})
	eleventyConfig.setLibrary('md', markdownLibrary)

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.njk')
	eleventyConfig.addLayoutAlias('post', 'post.njk')

	// Copy/pass-through files
	eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')
	
	return {
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		htmlTemplateEngine: 'njk',
		passthroughFileCopy: true,
		dir: {
			input: 'src',
			// better not use "public" as the name of the output folder (see above...)
			output: '_site',
			includes: '_includes',
			layouts: 'layouts',
			data: '_data'
		}
	}
}
