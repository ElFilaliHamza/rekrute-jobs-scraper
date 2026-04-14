/**
 * listingPage.js
 * Extracts individual job URLs and the next pagination URL from rekrute.com search.
 */

export async function parseListingPage(page, baseUrl = 'https://www.rekrute.com') {
    const result = await page.evaluate((base) => {
        const urls = new Set();

        // Rekrute job titles are usually inside <h2> or <h3> with a link
        const jobLinks = document.querySelectorAll(
            '.post-id h2 a, ' + 
            '.job h2 a, ' +
            '.titreJob a, ' +
            '#post-data h2 a, ' +
            '.section h2 a'
        );

        jobLinks.forEach((a) => {
            const href = a.getAttribute('href');
            if (!href) return;
            
            // Typical Rekrute job url: /offre-emploi-{title}-{id}.html
            if (href.includes('offre-emploi') || href.includes('offres-emploi')) {
                const full = href.startsWith('http') ? href : `${base}${href.startsWith('/') ? '' : '/'}${href}`;
                urls.add(full);
            }
        });

        // Parse Next Page
        let nextUrl = null;
        
        // Rekrute typically uses a class like .next or relies on aria-label
        let nextLink = document.querySelector('a.next, .pagination .next a, a[title="Suivant"]');
        
        // Manual fallback for :contains
        if (!nextLink) {
            const links = Array.from(document.querySelectorAll('a'));
            nextLink = links.find(a => a.textContent.trim().toLowerCase() === 'suivant');
        }
        
        if (nextLink) {
            const href = nextLink.getAttribute('href');
            if (href && href !== '#' && href !== 'javascript:void(0);') {
                nextUrl = href.startsWith('http') ? href : `${base}${href.startsWith('/') ? '' : '/'}${href}`;
            }
        } else {
            // Fallback: look for the active pagination page and grab the one after it
            const activePage = document.querySelector('.pagination .active');
            if (activePage && activePage.nextElementSibling) {
                const link = activePage.nextElementSibling.querySelector('a');
                if (link) {
                    const href = link.getAttribute('href');
                    if (href) {
                        nextUrl = href.startsWith('http') ? href : `${base}${href.startsWith('/') ? '' : '/'}${href}`;
                    }
                }
            }
        }

        return { listingUrls: [...urls], nextPageUrl: nextUrl };
    }, baseUrl);

    return result;
}
