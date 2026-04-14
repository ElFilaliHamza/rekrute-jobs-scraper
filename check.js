import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.rekrute.com/offres-emploi-maroc.html');
    
    // Dump HTML
    const html = await page.content();
    fs.writeFileSync('rekrute.html', html);
    
    // Quick test
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
            .filter(a => a.href && a.href.includes('offres-emploi-'))
            .map(a => a.href);
    });
    
    console.log(`Found ${links.length} matching job links`);
    if (links.length > 0) {
        console.log(links.slice(0, 3));
    }
    
    await browser.close();
}

run();
