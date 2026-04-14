/**
 * main.js
 * Apify Actor entry point for rekrute.com jobs scraper.
 */

import { Actor } from 'apify';
import { PlaywrightCrawler, log } from 'crawlee';
import { buildRouter, LABEL_LISTING, BASE_URL } from './router.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const {
    startUrls = [],
    maxListings = 100, // MVP limit
    maxConcurrency = 3,
    proxyConfiguration: proxyConfig,
} = input;

const dataset = await Actor.openDataset();

const proxyConfiguration = proxyConfig
    ? await Actor.createProxyConfiguration(proxyConfig)
    : undefined;

const router = buildRouter({ maxListings, dataset });

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    proxyConfiguration,
    maxConcurrency,
    // Provide a human-like browser environment
    launchContext: {
        launchOptions: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
    },
    requestHandlerTimeoutSecs: 60,
    maxRequestRetries: 3,
    preNavigationHooks: [
        async ({ page }) => {
            // Dismiss cookie banners/popups
            await page.addInitScript(() => {
                window.alert = () => {};
                window.confirm = () => true;
            });
        },
    ],
});

let seedRequests;

if (startUrls && startUrls.length > 0) {
    seedRequests = startUrls.map((item) => ({
        url: typeof item === 'string' ? item : item.url,
        label: LABEL_LISTING,
    }));
} else {
    // Default MVP scrape: Global job board, from first page
    seedRequests = [{ 
        url: `${BASE_URL}/offres.html?s=1&p=1&o=1`, 
        label: LABEL_LISTING 
    }];
}

log.info(`Starting Rekrute crawl with ${seedRequests.length} seed URLs, maxListings=${maxListings}`);

await crawler.run(seedRequests);

const datasetInfo = await dataset.getInfo();
log.info(`\n✅ Done! Total jobs saved: ${datasetInfo?.itemCount ?? 'unknown'}`);
log.info(`   Dataset ID: ${datasetInfo?.id}`);
log.info(`   Export CSV: https://api.apify.com/v2/datasets/${datasetInfo?.id}/items?format=csv`);

await Actor.exit();
