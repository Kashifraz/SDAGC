const lazyImagesPlugin = require("eleventy-plugin-lazyimages");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const eleventyPluginFeathericons = require('eleventy-plugin-feathericons');
const { execSync } = require('child_process')

module.exports = function (eleventyConfig) {
	// change this rootURL with your domain (without / at the end, see my example) !important
	eleventyConfig.addGlobalData("rootURL", "https://eleventy-card.netlify.app");
	eleventyConfig.on('eleventy.after', () => {
		execSync(`npx -y pagefind --site _site --output-subdir _pagefind`, { encoding: 'utf-8' })
	  })
	eleventyConfig.addPlugin(lazyImagesPlugin);
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
	eleventyConfig.addPlugin(eleventyPluginFeathericons);
	eleventyConfig.addPassthroughCopy("asset");
	eleventyConfig.addPassthroughCopy("robots.txt");
	// Collection post blog
	eleventyConfig.addCollection("posts", function (collectionApi) {
		return collectionApi.getFilteredByGlob("blog/**/*.md");
	});

	// Collection post photos
	eleventyConfig.addCollection("photos", function (collectionApi) {
		return collectionApi.getFilteredByGlob("photos/**/*.md");
	});

	// Collection tags thanks chatgpt
	eleventyConfig.addCollection("blogTags", getTags("blog"));
	eleventyConfig.addCollection("photosTags", getTags("photos"));
};

/**
 * @param {'blog'|'photos'} type
 */
function getTags(type) {
	return (collection) => {
		let tagsSet = new Set();
		collection.getAll().forEach((item) => {
			if (item.filePathStem.includes(`/${type}/`) && item.data.tags) {
				item.data.tags.forEach((tag) => {
					tagsSet.add(tag);
				});
			}
		});
		return Array.from(tagsSet);
	};
}
