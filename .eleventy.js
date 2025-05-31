module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("sw.js");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("send_mail.php"); // <--- ДОДАНО ЦЕЙ РЯДОК

  // Якщо ваш routes.json лежить в корені проєкту, а не в assets:
  // eleventyConfig.addPassthroughCopy("routes.json"); 
  // Якщо він в my-ssg-site/assets/routes.json, то addPassthroughCopy("assets") його вже обробить.

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};