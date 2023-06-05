/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:"https://ten.xoltanmarketplace.com",
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: true,
  robotsTxtOptions: {
          transformRobotsTxt: async () => 
          "# *\nUser-agent: *\nAllow: /\n\n# Host\nHost: https://ten.xoltanmarketplace.com/\n\n# Sitemaps\nSitemap: https://ten.xoltanmarketplace.com/sitemap.xml\n"
      }
};