/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:process.env.NEXT_PUBLIC_BASE_URL || "https://ten.xoltanmarketplace.com",
  generateRobotsTxt: true, // (optional)
  
  generateIndexSitemap: false,
  // ...other options
}; 