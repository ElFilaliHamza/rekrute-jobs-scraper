import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.rekrute.com/offre-emploi-assistante-de-direction-recrutement-societe-de-developpement-des-services-publics-de-distribution-fes-181766.html', { waitUntil: 'load' });

    const record = await page.evaluate(() => {
        const record = {};
        record.job_title = document.querySelector('h1')?.innerText.trim() || '';

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

        document.querySelectorAll('li').forEach(li => {
            const txt = li.innerText.trim();
            if (txt.toLowerCase().includes('secteur') && !record.sector_industry) {
                const sect = txt.substring(txt.toLowerCase().indexOf('secteur')).trim();
                record.sector_industry = sect;
            }
        });

        if (record.job_title && record.job_title.includes(' - ')) {
            const parts = record.job_title.split(' - ');
            const cityPart = parts[parts.length - 1].trim();
            if (!record.location || record.location.toLowerCase().includes('maroc')) {
                record.location = cityPart;
            }
        }

        return record;
    });

    console.log('Final metadata extracted:', record);

    await browser.close();
})();
