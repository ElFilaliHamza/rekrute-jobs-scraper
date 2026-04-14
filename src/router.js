/**
 * router.js
 * Crawlee playwright router for rekrute.com
 */

import { createPlaywrightRouter, sleep } from 'crawlee';
import { parseListingPage } from './parsers/listingPage.js';
import { parseDetailPage } from './parsers/detailPage.js';

export const BASE_URL = 'https://www.rekrute.com';

export const LABEL_LISTING = 'LISTING_PAGE';
export const LABEL_DETAIL = 'DETAIL_PAGE';

export function buildRouter({ maxListings, dataset }) {
    const router = createPlaywrightRouter();
    let detailPageCount = 0;

    router.addHandler(LABEL_LISTING, async ({ page, request, crawler, log }) => {
        log.info(`[LISTING] Parsing: ${request.url}`);

        // Wait for actual job listings to load. 
        // Rekrute uses various wrappers, 'div.post-id' or '#post-data'
        await page.waitForSelector('.post-id, .job, #post-data, .section', {
            timeout: 20_000,
        }).catch(() => log.warning('Listing selector timed out, continuing anyway'));

        const { listingUrls, nextPageUrl } = await parseListingPage(page, BASE_URL);

        log.info(`  Found ${listingUrls.length} listing URLs | next page: ${nextPageUrl ?? 'none'}`);
        
        if (listingUrls.length === 0) {
            log.warning('No job listings found here. DOM might have changed.');
        }

        for (const url of listingUrls) {
            if (maxListings > 0 && detailPageCount >= maxListings) {
                log.info(`Reached maxListings cap (${maxListings}). Stopping enqueueing.`);
                return;
            }
            await crawler.addRequests([{
                url,
                label: LABEL_DETAIL,
                userData: { sourceListingPage: request.url },
            }]);
            detailPageCount++;
        }

        if (nextPageUrl && (maxListings === 0 || detailPageCount < maxListings)) {
            await crawler.addRequests([
                { url: nextPageUrl, label: LABEL_LISTING },
            ]);
        }

        await sleep(1000);
    });

    router.addHandler(LABEL_DETAIL, async ({ page, request, log }) => {
        log.info(`[DETAIL] Scraping: ${request.url}`);

        await page.waitForSelector('h1, .job-title, .titreJob, .section', { timeout: 15_000 })
            .catch(() => log.warning('Title selector timed out on detail page'));

        try {
            const record = await parseDetailPage(page, request.url);

            if (!record.job_title) {
                log.warning(`  Skipping ${request.url} — no job title extracted`);
                return;
            }

            await dataset.pushData(record);
            log.info(`  ✓ Saved job: ${record.job_title} at ${record.company_name}`);
        } catch (err) {
            log.error(`  ✗ Failed to parse ${request.url}: ${err.message}`);
        }

        await sleep(800);
    });

    router.addDefaultHandler(async ({ request, log }) => {
        log.warning(`[DEFAULT] No handler for: ${request.url}`);
    });

    return router;
}
