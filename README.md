# 🚀 Rekrute Jobs Scraper | The Ultimate MENA Job Market Extractor

[![Apify Store](https://img.shields.io/badge/Available%20on-Apify%20Store-success?style=for-the-badge&logo=apify)](https://apify.com/muliaichi/rekrute-jobs-scraper)
[![GitHub Repository](https://img.shields.io/badge/Open%20Source-GitHub-black?style=for-the-badge&logo=github)](https://github.com/MuLIAICHI/rekrute-jobs-scraper)

Welcome to the **Rekrute Jobs Scraper**, the most advanced, reliable, and comprehensive data extraction tool for [Rekrute.com](https://www.rekrute.com/) — Morocco’s premier professional job board. 

If you are looking to truly dominate the digital landscape of the MENA (Middle East and North Africa) region, actionable and structured data is the undisputed king. This Actor isn't just a scraper; it's a **business intelligence pipeline** specifically designed to unlock the Moroccan job market at scale.

---

## 🌍 The "Moroccan Data Dominance" Suite

This Actor is a proud part of our extensive **Moroccan Data Dominance Suite** on Apify. 
Domination means having a 360-degree view of an economy. To complement your insights into the Moroccan talent pool and corporate hiring budgets, you need to understand the physical and real estate footprint of the country. 

> 💎 **Pro Tip:** Pair this Rekrute Jobs Scraper with our **[Mubawab Housing Scraper](https://apify.com/)**. By tracking both *who is hiring* and *where real estate is booming*, you can build a complete predictive model of Moroccan economic hotspots. It’s the ultimate data-driven advantage.

---

## 🔥 Why Extract Data from Rekrute? (The Use Cases)

Rekrute is the absolute gold standard for corporate hiring in Morocco and Francophone Africa. By scraping Rekrute, you gain direct access to the neural network of the region's economy.

### 1. 💼 B2B Lead Generation & Sales Signaling
*Stop cold-calling blindly.* A company posting 15 open positions for Software Engineers and Sales Executives is a company with a high budget, currently in an expansion phase. 
* **Action:** Hook this scraper up to your CRM. Whenever a company in your target industry posts a new job, trigger an automated outreach campaign offering your enterprise SaaS, IT services, or consulting.

### 2. 🤖 AI Market Research & LLM Training
Creating hyper-localized AI requires hyper-localized data. 
* **Action:** Train your Machine Learning models or fine-tune LLMs on tens of thousands of authentic, professional Moroccan job descriptions (written in French, Arabic, and English). Perfect for building localized HR bots, CV-matching algorithms, or labor market trend predictors.

### 3. 📈 HR Tech & Competitive Salary Analysis
Building a recruitment platform, a salary benchmarking tool, or an aggregator?
* **Action:** Programmatically monitor your competitors. See exactly what contract types (CDI, CDD, Freelance) are trending, what the average required experience level is per sector, and map out the entire talent demand across cities like Casablanca, Rabat, and Tanger.

---

## ⚡ What Makes This Scraper the Best?

We didn't just build a scraper; we engineered an enterprise-grade extraction engine.

* **🛡️ Bulletproof Anti-Blocking Architecture:** Built on highly mature `Crawlee` and `Playwright` foundations. We utilize dynamic browser fingerprinting, human-like navigation delays, and seamless integration with Apify Residential Proxies to ensure you *never* get blocked.
* **🧠 Pagination Intelligence:** Native, automatic pagination handling. It recursively tracks down the "next page" buttons, even when the DOM dynamically shifts, ensuring you never miss a hidden listing.
* **🧹 Incredible Data Cleanliness:** Raw HTML is messy. Our parser meticulously strips out tracking noise, normalizes messy text formatting, handles missing fields gracefully, and standardizes dates and locations so the data is ready for your database on minute one.
* **⏱️ Unmatched Speed & Memory Efficiency:** Optimized instance sizing prevents memory leaks, keeping your Apify compute costs lower than the competition while delivering higher bandwidth scraping.

---

## 🚀 Getting Started

To use this scraper locally or contribute to its development, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/MuLIAICHI/rekrute-jobs-scraper.git
cd rekrute-jobs-scraper
```

### 2. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) (version 20 or higher) installed.
```bash
npm install
```

### 3. Run Locally
You can run the scraper directly using Node.js or the [Apify CLI](https://docs.apify.com/cli).

**Using Apify CLI (Recommended for development):**
```bash
apify run
```

**Using Node.js:**
```bash
npm start
```
*Note: Local runs will store results in the `storage` directory.*

### 4. Deploy to Apify
To host this on your own Apify account:
```bash
apify push
```

---

## 🛠️ Input Configuration

Our Actor is highly customizable via a beautiful Apify UI, or programmatically via API JSON.

| Field | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `startUrls` | Array | (Optional) Input specific Rekrute category links (e.g., just "IT Jobs" or "Casablanca Jobs") to narrow your scrape. If left blank, it defaults to the global all-jobs feed. | `[]` (Global Feed) |
| `maxListings` | Integer | The limit of job details to scrape per run. Ideal for testing. **Set to `0` to scrape every single job available.** | `100` |
| `proxyConfiguration` | Object | Proxy routing. **We highly recommend using Apify Residential Proxies** to prevent Rekrute from serving captchas. | `Apify Proxy (Residential)` |

---

## 📊 Comprehensive Data Output

The output is perfectly formatted JSON, easily exportable to CSV, Excel, XML, or direct database ingestion. Every single job listing yields a rich tapestry of metadata:

```json
{
  "job_title": "Ingénieur en Informatique et Réseaux Senior H/F",
  "company_name": "Tech Corp Maroc S.A.",
  "location": "Casablanca",
  "date_posted": "22/05/2026",
  "contract_type": "CDI",
  "experience_level": "De 5 à 10 ans",
  "education_level": "Bac +5 et plus",
  "sector_industry": "Informatique / Electronique / Télécoms",
  "description": "Nous recherchons un ingénieur talentueux au sein de notre équipe basée à Sidi Maârouf. Vous serez en charge du déploiement de l'architecture cloud...\n\nCompétences exigées:\n- AWS, Azure\n- Docker, Kubernetes\n- Français courant.",
  "job_url": "https://www.rekrute.com/offre-emploi-ingenieur-informatique-casablanca-123456.html",
  "scraped_at": "2026-05-22T10:30:00.123Z"
}
```

---

## ♾️ Automation Blueprints (Make.com, n8n, Zapier)

You don't need to be a developer to extract massive value from this Actor. 

### **The "Automated Sales Signal" Blueprint:**
1. **Trigger:** Schedule this Apify Actor to run every Monday Morning.
2. **Action 1 (Make.com / n8n):** Fetch the dataset via the Apify API node module.
3. **Action 2 (Filter):** Filter the JSON where `sector_industry` equals `Informatique`.
4. **Action 3 (OpenAI):** Pass the `company_name` and `job_title` to ChatGPT to draft a highly personalized cold-call script or email.
5. **Action 4 (HubSpot / Salesforce):** Create a new Lead/Task for your underlying sales team to attack.

---

## 🤝 Support & Feature Requests
We actively maintain this scraper to ensure it adapts to any UI/UX changes deployed by Rekrute.com. 

If you encounter an issue, need a highly customized crawling requirement, or want to explore enterprise datasets for the wider MENA region, please open an issue in the Apify Actor Issues tab. We typically respond and patch within 24 hours.

---

## ⚖️ Legal & Ethical Usage Declaration
*This scraper is engineered for ethical, public-data extraction, competitive intelligence, and aggregate market analysis. By utilizing this Actor, you agree to respect local data protection regulations (such as the Moroccan CNDP and international GDPR frameworks) and recognize that you are solely responsible for how you utilize and store the extracted data in accordance with the target website's Terms of Service.*
