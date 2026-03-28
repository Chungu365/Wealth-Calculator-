<div align="center">

<br/>

```
███████╗ ██████╗ ██╗
██╔════╝██╔════╝ ██║
█████╗  ██║  ███╗██║
██╔══╝  ██║   ██║██║
██║     ╚██████╔╝██║
╚═╝      ╚═════╝ ╚═╝
Fund Growth Illustrator · Individual Life
```

<br/>

**A private wealth projection platform for high-net-worth client advisory.**  
Built for precision. Designed for trust.

<br/>

[![Live Platform](https://img.shields.io/badge/Live_Platform-View_Demo-B8860B?style=for-the-badge&logo=github&logoColor=white)](https://YOUR_USERNAME.github.io/fund-illustrator/)
[![License](https://img.shields.io/badge/License-Proprietary-1a2a4a?style=for-the-badge)](./LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-B8860B?style=for-the-badge)](./CHANGELOG.md)
[![Status](https://img.shields.io/badge/Status-Production_Ready-2a6a4a?style=for-the-badge)](.)

<br/>

---

</div>

<br/>

## Overview

The **Fund Growth Illustrator** is an enterprise-grade, browser-based wealth projection platform built for financial advisors serving private and high-net-worth clients. It replaces the original Excel-based model with a fully interactive, zero-dependency web application — delivering institutional-quality outputs with the immediacy of a live dashboard.

Advisors can model premium contribution structures across three return scenarios, project fund values at key policy tenors, and produce client-ready outputs in seconds — all from within the browser, with no server, no login, and no data leaving the device.

<br/>

---

## Contents

- [Platform Preview](#platform-preview)
- [Key Features](#key-features)
- [Formula Reference](#formula-reference)
- [Return Scenarios](#return-scenarios)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Customisation](#customisation)
- [Security & Privacy](#security--privacy)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)

<br/>

---

## Platform Preview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  FGI  Fund Growth Illustrator · Private Wealth    ● Best Case Return · 15.5%   │
├──────────────────┬──────────────────────────────────────┬───────────────────────┤
│                  │  K 120,000   K 1,200   K 118,800  K 49,546  │               │
│  01 ASSUMPTIONS  ├──────────────────────────────────────┤  03 OUTPUT SCHEDULE  │
│                  │                                      │                       │
│  Premium  K2,000 │   Projected Fund Value at Maturity   │  Yr  Gross  Net  FV  │
│  Term     5 yrs  │                                      │   1  24000  ...       │
│  Scenario  Best  │         K 168,346.44                 │   2  48000  ...       │
│                  │                         ╭───╮        │ ★ 3  72000  ...       │
│  ──────────────  │   41.7% total gain      │42%│        │   4  96000  ...       │
│  Net/mo  K 1,980 │                         │ROI│        │ ★ 5  ...              │
│  Ann Net K23,760 │                         ╰───╯        │                       │
│  Months     60   │  ─────────────────────────────────   │                       │
│  Rate    15.5%   │         Fund Growth Over Time        │                       │
│                  │  ╭─────────────────────────────╮     │                       │
│  BOZ T-Bill 13.5%│  │       📈 Chart              │     │                       │
│                  │  ╰─────────────────────────────╯     │                       │
│  [Generate ➜]    │  Year 3 · Year 5 · Year 7 · Year 10  │                       │
└──────────────────┴──────────────────────────────────────┴───────────────────────┘
```

<br/>

---

## Key Features

### Advisory Tools
- **Live scenario modelling** — projections recalculate instantly as inputs change; no submit button required
- **Three return scenarios** — Worst Case, Base Case, and Best Case with a single click to toggle
- **Tenor milestone cards** — Year 3, 5, 7, and 10 snapshots displayed simultaneously for rapid client comparison
- **ROI donut indicator** — animated ring showing total return on net invested capital at a glance
- **Gain progress bar** — visual representation of total gain as a percentage of net contributions

### Output Quality
- **Annual output schedule** — full year-by-year breakdown of gross contributions, fees, net contributions, fund value, and interest earned
- **Interactive Chart.js chart** — fund value vs net invested, styled with the institutional gold/navy palette
- **BOZ T-Bill benchmark** — 364-day Treasury Bill yield displayed as a constant reference point for performance context
- **Print-ready layout** — `Ctrl+P` / `⌘+P` produces a clean, footer-disclaimed report suitable for client presentation

### Technical
- **Zero dependencies** — no frameworks, no build step, no package manager required
- **Fully client-side** — all computation happens in the browser; no data is ever transmitted
- **Static site** — deployable to GitHub Pages, Netlify, Vercel, or any file server in under 5 minutes
- **Mobile responsive** — adapts gracefully from 4K displays to tablet viewports
- **Dark mode native** — deep navy midnight palette designed for extended advisory sessions

<br/>

---

## Formula Reference

The calculation engine faithfully replicates the formulas from the original Excel model (`Scenario Page` sheet).

### Core Annuity Formula

The fund value at any given month is computed using the **future value of an ordinary annuity** with monthly compounding:

```
Net Monthly PMT  =  Gross Monthly Premium × (1 − Fee Rate)
                 =  Gross × 0.99

Monthly Rate rₘ  =  (1 + Annual Rate)^(1/12) − 1

Fund Value at Month M  =  PMT_net × [ ((1 + rₘ)^M − 1) / rₘ ]
```

### Annual Schedule Computation

Each year in the output schedule is a snapshot at `M = year × 12`:

```
Cumulative Gross     =  Gross Monthly × 12 × Year
Cumulative Fee       =  Gross Monthly × 12 × Fee Rate × Year
Cumulative Net       =  Cumulative Gross − Cumulative Fee
Fund Value at Year Y =  FV formula at M = Y × 12
Interest Earned      =  Fund Value − Cumulative Net
```

### Fee Structure

```
Policy Handling Fee  =  1.0%  (applied to gross monthly premium)
Net Monthly PMT      =  Gross × (1 − 0.01)  =  Gross × 0.99
```

<br/>

---

## Return Scenarios

| Scenario | Annual Rate | Description | Benchmark Delta |
|---|---|---|---|
| **Worst Case** | `3.0%` | Minimum Guaranteed Return | −10.5% vs BOZ |
| **Base Case** | `11.5%` | Market Base Return | −2.0% vs BOZ |
| **Best Case** | `15.5%` | Optimistic Growth Target | **+2.0% vs BOZ** |
| *BOZ T-Bill* | *`13.5%`* | *364-Day T-Bill Yield (Benchmark)* | *—* |

Key tenor milestones modelled: **Year 3 · Year 5 · Year 7 · Year 10**

<br/>

---

## Project Structure

```
fund-illustrator/
│
├── index.html          # Application shell — layout, navigation, semantic HTML
├── style.css           # Full design system — midnight navy/gold palette, glassmorphism panels,
│                       # responsive grid, animations, print stylesheet
├── calculator.js       # Calculation engine — annuity formulas, Chart.js integration,
│                       # UI state management, formatting utilities
└── README.md           # This document
```

All business logic lives in `calculator.js`. The rendering layer (`index.html` + `style.css`) is fully decoupled — swap either without touching the other.

<br/>

---

## Getting Started

### Prerequisites

- A modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git (for deployment)
- No Node.js, no npm, no build tools

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fund-illustrator.git
cd fund-illustrator

# Option 1 — open directly (works for most browsers)
open index.html

# Option 2 — serve locally (recommended for Chrome)
npx serve .

# Option 3 — Python simple server
python3 -m http.server 8080
# Then visit http://localhost:8080
```

<br/>

---

## Deployment

### GitHub Pages (Recommended)

The fastest path from local to live:

```bash
# 1. Initialise the repository
git init
git add .
git commit -m "Launch: Fund Growth Illustrator v2"
git branch -M main

# 2. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/fund-illustrator.git
git push -u origin main
```

Then in GitHub → **Settings → Pages → Source → Deploy from a branch → main / (root) → Save**

Your platform will be live at:
```
https://YOUR_USERNAME.github.io/fund-illustrator/
```

Subsequent updates deploy automatically on push:

```bash
git add .
git commit -m "Update: description of change"
git push
```

### Netlify

```bash
# Drag the project folder to netlify.com/drop
# Or via CLI:
npm install -g netlify-cli
netlify deploy --dir . --prod
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Self-hosted / Corporate Intranet

Upload all files to any directory served over HTTP/HTTPS. No server-side configuration required.

<br/>

---

## Customisation

### Changing Default Assumptions

Edit the top of `calculator.js`:

```javascript
const SCENARIOS = {
  worst: { label: 'Worst Case', rate: 0.03  },   // ← change rate here
  base:  { label: 'Base Case',  rate: 0.115 },
  best:  { label: 'Best Case',  rate: 0.155 },
};

const FEE_RATE    = 0.01;          // ← policy handling fee
const TENOR_YEARS = [3, 5, 7, 10]; // ← milestone years
```

### Changing the Benchmark Rate

In `index.html`, search for `13.5%` and update the two instances (hero band + benchmark bar).

### Branding

The colour system is defined entirely in the `:root` block at the top of `style.css`:

```css
:root {
  --gold-500:  #B8860B;   /* ← primary brand gold */
  --navy-950:  #03070F;   /* ← deepest background */
  --navy-800:  #0B1428;   /* ← panel backgrounds  */
}
```

Replace the gold ramp with your brand colour and all UI elements update automatically.

### Currency Symbol

In `calculator.js`, the `K()` and `Kshort()` formatters prepend `K ` (Kwacha). Update the prefix string to your local currency symbol:

```javascript
function K(n) {
  return 'K ' + n.toLocaleString(...);  // ← change 'K ' to '$', '£', 'R', etc.
}
```

<br/>

---

## Security & Privacy

- **No data transmission** — all calculation occurs entirely within the client's browser. No premium amounts, client names, or projection figures are sent to any server.
- **No analytics** — no tracking scripts, cookies, or third-party SDKs are loaded.
- **No authentication layer** — access control is handled at the hosting layer (private repo, VPN-gated intranet, or password-protected Netlify site).
- **Single external dependency** — Chart.js is loaded from the jsDelivr CDN. For fully air-gapped deployments, download and serve `chart.umd.min.js` locally.

> For deployments within a regulated environment, review with your compliance team. This tool is a client-facing illustration aid and does not constitute financial advice.

<br/>

---

## Roadmap

Planned enhancements for future versions:

- [ ] **PDF export** — generate a branded, client-ready PDF projection report
- [ ] **Multi-client comparison** — model up to 3 clients side-by-side
- [ ] **Inflation adjustment** — toggle real vs nominal projected values
- [ ] **Lump sum + premium hybrid** — support initial single premium + ongoing contributions
- [ ] **White-label theming** — adviser firm branding via a config file
- [ ] **Offline PWA** — installable as a Progressive Web App with service worker caching

<br/>

---

## Disclaimer

> This platform is designed for **illustrative and advisory purposes only**. Projected fund values are mathematical estimates based on assumed constant return rates and do not constitute a guarantee of future performance. Actual returns will vary based on market conditions, policy terms, regulatory changes, and other factors outside the control of the adviser or the policyholder.
>
> All figures are denominated in **Zambian Kwacha (ZMW)**. The BOZ 364-Day Treasury Bill yield is provided as a market benchmark reference only.
>
> This tool does not constitute financial advice. Advisers are responsible for ensuring that all client projections comply with applicable regulatory requirements and are presented with appropriate context and caveats.

<br/>

---

<div align="center">

**Individual Life · Fund Growth Illustrator**

*Built for advisors who hold their clients' futures in trust.*

<br/>

[↑ Back to top](#)

</div>
