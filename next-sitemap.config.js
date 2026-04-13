/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://shamalandscapes.co.ke',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',

  exclude: ['/admin', '/dashboard'],

  transform: async (config, url) => {
    return {
      loc: url,
      changefreq: 'weekly',
      priority: url === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};