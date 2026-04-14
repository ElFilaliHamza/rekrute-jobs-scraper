/**
 * detailPage.js
 * Scrapes metadata from a single job listing on rekrute.com.
 */

export async function parseDetailPage(page, jobUrl) {
    const data = await page.evaluate(() => {
        // Helper
        const getText = (selector, context = document) => {
            const el = context.querySelector(selector);
            return el ? el.innerText.trim().replace(/\s+/g, ' ') : null;
        };

        const record = {};

        // Title and Company
        record.job_title = getText('h1') || getText('.titreJob');
        
        // Company name extraction
        const oppLink = document.querySelector('a[title*="Ne manquez aucune opportunité"]');
        if (oppLink) {
            const match = oppLink.getAttribute('title').match(/opportunité (.*?), recevez/);
            if (match) record.company_name = match[1].trim();
        }
        
        if (!record.company_name) {
            const logoLink = document.querySelector('a[href*="-emploi-recrutement-"]');
            if (logoLink) {
                let nameStr = logoLink.getAttribute('href').split('-emploi-recrutement')[0].replace('/', '').replace(/-/g, ' ');
                record.company_name = nameStr.replace(/\b\w/g, l => l.toUpperCase());
            }
        }

        if (!record.company_name) {
            const logoImg = document.querySelector('.logo-entreprise img, .logo-company img, #s_logo');
            if (logoImg && logoImg.getAttribute('alt')) {
                record.company_name = logoImg.getAttribute('alt').replace('Logo ', '').trim();
            } else {
                record.company_name = getText('.nom-entreprise, .company-name') || null;
            }
        }

        // Properties natively stored in title attributes of list items
        const liProperties = {};
        document.querySelectorAll('li[title]').forEach(li => {
            liProperties[li.getAttribute('title').trim().toLowerCase()] = li.innerText.trim();
        });

        if (liProperties['expérience requise']) record.experience_level = liProperties['expérience requise'];
        
        if (liProperties['niveau d\'étude et formation']) {
            record.education_level = liProperties['niveau d\'étude et formation'];
        } else if (liProperties['niveau d\'étude']) {
            record.education_level = liProperties['niveau d\'étude'];
        }

        if (liProperties['type de contrat']) record.contract_type = liProperties['type de contrat'];

        if (liProperties['région']) record.location = liProperties['région'];
        if (liProperties['region']) record.location = liProperties['region'];

        // Job sector is often a normal floating li without title
        document.querySelectorAll('li').forEach(li => {
            const txt = li.innerText.trim();
            if ((txt.toLowerCase().includes('secteur') || txt.toLowerCase().includes('sector')) && !record.sector_industry) {
                record.sector_industry = txt.replace(/^- /, '').replace(/sec.*?teur( d'activité)?\s*[:\-]?/i, '').trim();
            }
        });

        // Date Posted
        // Often near "Publié le"
        const dateEl = document.querySelector('.date, .publish-date');
        if (dateEl) {
            record.date_posted = dateEl.innerText.replace(/publi.*?le\s*[:\-]?/i, '').trim();
        } else {
            // Check body text for 'publié le'
            const allTextElements = document.querySelectorAll('span, p, div');
            for(let el of allTextElements) {
                if (el.innerText && el.innerText.toLowerCase().includes('publié le') && el.innerText.length < 50) {
                    record.date_posted = el.innerText.replace(/publi.*?le\s*[:\-]?/i, '').trim();
                    break;
                }
            }
        }

        // Location fallback from job title (e.g. "Assistante de Direction - Fès")
        if (record.job_title && record.job_title.includes(' - ')) {
            const parts = record.job_title.split(' - ');
            const cityPart = parts[parts.length - 1].trim();
            // Rekrute Region often just says "1 poste - Maroc", override with explicit city if found in title
            if (!record.location || record.location.toLowerCase().includes('maroc')) {
                record.location = cityPart;
            }
        }

        // Description
        // Usually inside a prominent block
        const descEl = document.querySelector('.description, .job-description, .content-job, #description-job, .section');
        if (descEl) {
            record.description = descEl.innerText.trim().replace(/\n{3,}/g, '\n\n');
        }

        return record;
    });

    data.job_url = jobUrl;
    data.scraped_at = new Date().toISOString();

    return data;
}
