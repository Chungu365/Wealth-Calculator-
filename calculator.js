/* ================================================================
   FUND GROWTH ILLUSTRATOR  ·  Calculator Engine v2
   Replicates the Excel formulas from the original .xlsx tool
   ================================================================ */

const SCENARIOS = {
  worst: { label: 'Worst Case',  sublabel: 'Minimum Guaranteed', rate: 0.03,  dotColor: '#E07070', lineColor: '#C24040' },
  base:  { label: 'Base Case',   sublabel: 'Market Base Return',  rate: 0.115, dotColor: '#9BAFCC', lineColor: '#5A80B0' },
  best:  { label: 'Best Case',   sublabel: 'Optimistic Target',   rate: 0.155, dotColor: '#D4AA50', lineColor: '#B8860B' },
};

const FEE_RATE    = 0.01;
const TENOR_YEARS = [3, 5, 7, 10];
const CIRCUMFERENCE = 2 * Math.PI * 46; // donut r=46

function monthlyRate(r) { return Math.pow(1 + r, 1 / 12) - 1; }

function fundValue(netMonthly, r, months) {
  const rm = monthlyRate(r);
  return netMonthly * ((Math.pow(1 + rm, months) - 1) / rm);
}

function calcAll(grossMonthly, r, termYears) {
  const netMonthly   = grossMonthly * (1 - FEE_RATE);
  const annualGross  = grossMonthly * 12;
  const annualNet    = netMonthly * 12;
  const totalMonths  = termYears * 12;
  const totalGross   = annualGross * termYears;
  const totalFees    = annualGross * FEE_RATE * termYears;
  const totalNet     = totalGross - totalFees;
  const projFund     = fundValue(netMonthly, r, totalMonths);
  const totalInterest = projFund - totalNet;

  const schedule = [];
  for (let yr = 1; yr <= termYears; yr++) {
    const cGross = annualGross * yr;
    const cFee   = annualGross * FEE_RATE * yr;
    const cNet   = annualNet * yr;
    const fv     = fundValue(netMonthly, r, yr * 12);
    schedule.push({ year: yr, gross: cGross, fee: cFee, net: cNet, fundVal: fv, interest: fv - cNet });
  }

  const tenors = {};
  for (const t of TENOR_YEARS) {
    const fv   = fundValue(netMonthly, r, t * 12);
    const cNet = annualNet * t;
    tenors[t]  = { fund: fv, interest: fv - cNet };
  }

  return { netMonthly, annualNet, totalMonths, totalGross, totalFees, totalNet, projFund, totalInterest, schedule, tenors };
}

/* ── Formatting ── */
function K(n) {
  if (n === null || isNaN(n)) return '—';
  return 'K ' + n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function Kshort(n) {
  if (n === null || isNaN(n)) return '—';
  if (n >= 1_000_000) return 'K ' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return 'K ' + (n / 1_000).toFixed(2) + 'k';
  return 'K ' + n.toFixed(2);
}
function fmt2(n) {
  return n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Chart ── */
let chart = null;
function buildChart(schedule, scenario) {
  const s = SCENARIOS[scenario];
  const labels   = schedule.map(r => `Yr ${r.year}`);
  const fundData = schedule.map(r => +r.fundVal.toFixed(2));
  const netData  = schedule.map(r => +r.net.toFixed(2));

  const ctx = document.getElementById('growthChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Fund Value',
          data: fundData,
          borderColor: s.lineColor,
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
            gradient.addColorStop(0, s.lineColor + '44');
            gradient.addColorStop(1, s.lineColor + '00');
            return gradient;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: s.lineColor,
          pointBorderColor: 'rgba(3,7,15,0.8)',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
        },
        {
          label: 'Net Invested',
          data: netData,
          borderColor: 'rgba(255,255,255,0.18)',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [5, 5],
          tension: 0.3,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(7,13,26,0.95)',
          borderColor: 'rgba(180,150,60,0.3)',
          borderWidth: 1,
          titleColor: '#D4AA50',
          bodyColor: '#CFC4A8',
          titleFont: { family: "'Playfair Display', serif", size: 14, weight: '500' },
          bodyFont: { family: "'Inter', sans-serif", size: 11 },
          padding: 12,
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: ${fmt2(ctx.raw)}`,
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9A8E72',
            font: { family: "'Inter', sans-serif", size: 10 }
          },
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }
        },
        y: {
          ticks: {
            color: '#9A8E72',
            font: { family: "'Inter', sans-serif", size: 10 },
            callback: v => {
              if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
              if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'k';
              return v;
            }
          },
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }
        }
      }
    }
  });
}

/* ── Donut ring ── */
function setDonut(pct) {
  const fg   = document.getElementById('donutFg');
  const pctEl = document.getElementById('donutPct');
  const clamped = Math.min(pct, 300); // cap visually at 300%
  const fill = (clamped / 300) * CIRCUMFERENCE;
  fg.setAttribute('stroke-dasharray', `${fill.toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`);
  pctEl.textContent = pct.toFixed(0) + '%';
}

/* ── UI update ── */
function update() {
  const gross    = parseFloat(document.getElementById('monthlyPremium').value) || 0;
  const term     = parseInt(document.getElementById('investmentTerm').value)   || 1;
  const scenario = document.querySelector('input[name="scenario"]:checked').value;
  const s        = SCENARIOS[scenario];
  const r        = calcAll(gross, s.rate, term);

  /* Nav pill */
  document.getElementById('scenarioPillText').textContent = `${s.label} · ${(s.rate * 100).toFixed(1)}%`;
  document.getElementById('pillDot').style.background = s.dotColor;
  document.getElementById('pillDot').style.boxShadow  = `0 0 6px ${s.dotColor}`;

  /* Derived */
  document.getElementById('netMonthly').textContent = fmt2(r.netMonthly);
  document.getElementById('annualNet').textContent   = fmt2(r.annualNet);
  document.getElementById('totalMonths').textContent = r.totalMonths;
  document.getElementById('annualRate').textContent  = (s.rate * 100).toFixed(1) + '%';

  /* KPIs */
  document.getElementById('totalGross').textContent    = Kshort(r.totalGross);
  document.getElementById('totalFees').textContent     = Kshort(r.totalFees);
  document.getElementById('totalNet').textContent      = Kshort(r.totalNet);
  document.getElementById('interestEarned').textContent = Kshort(r.totalInterest);

  /* Fund hero */
  document.getElementById('fundValue').textContent = K(r.projFund);
  document.getElementById('fhMeta').textContent    =
    `Based on ${s.label.toLowerCase()} scenario · ${term} year${term !== 1 ? 's' : ''}`;

  const gainPct = r.totalNet > 0 ? (r.totalInterest / r.totalNet) * 100 : 0;
  const barW    = Math.min(gainPct / 2, 100); // bar maxes at 200% gain
  document.getElementById('gainFill').style.width  = barW.toFixed(1) + '%';
  document.getElementById('gainLabel').textContent = gainPct.toFixed(1) + '% total gain';

  /* Donut */
  const roi = r.totalNet > 0 ? (r.projFund / r.totalNet - 1) * 100 : 0;
  setDonut(roi);

  /* Chart subtitle */
  document.getElementById('chartSubtitle').textContent =
    `Annual compounding · ${s.label} (${(s.rate * 100).toFixed(1)}%)`;

  /* Tenor cards */
  const tenorGrid = document.getElementById('tenorGrid');
  tenorGrid.innerHTML = '';
  for (const t of TENOR_YEARS) {
    const isActive = t === term;
    const card = document.createElement('div');
    card.className = 'tenor-card' + (isActive ? ' is-active' : '');
    card.innerHTML = `
      <span class="tenor-yr">Year ${t}</span>
      <div class="tenor-val">${Kshort(r.tenors[t].interest)}</div>
      <span class="tenor-fund">Fund: ${Kshort(r.tenors[t].fund)}</span>
    `;
    tenorGrid.appendChild(card);
  }

  /* Schedule */
  const tbody     = document.getElementById('scheduleBody');
  const tenorSet  = new Set(TENOR_YEARS);
  tbody.innerHTML = '';
  for (const row of r.schedule) {
    const tr = document.createElement('tr');
    if (tenorSet.has(row.year)) tr.classList.add('tenor-row');
    tr.innerHTML = `
      <td>${row.year}</td>
      <td>${fmt2(row.gross)}</td>
      <td class="td-fee">${fmt2(row.fee)}</td>
      <td>${fmt2(row.net)}</td>
      <td class="td-fund">${fmt2(row.fundVal)}</td>
      <td class="td-interest">${fmt2(row.interest)}</td>
    `;
    tbody.appendChild(tr);
  }

  /* Chart */
  buildChart(r.schedule, scenario);
}

/* ── Term stepper ── */
function setTerm(val) {
  val = Math.max(1, Math.min(30, val));
  document.getElementById('investmentTerm').value = val;
  document.getElementById('termDisplay').textContent = val;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', +c.dataset.years === val);
  });
  debouncedUpdate();
}

document.getElementById('termMinus').addEventListener('click', () => {
  setTerm(+document.getElementById('investmentTerm').value - 1);
});
document.getElementById('termPlus').addEventListener('click', () => {
  setTerm(+document.getElementById('investmentTerm').value + 1);
});
document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => setTerm(+btn.dataset.years));
});

/* ── Scenario selection ── */
document.querySelectorAll('input[name="scenario"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.scen-item').forEach(el => el.classList.remove('scen-item--selected'));
    radio.closest('.scen-item').classList.add('scen-item--selected');
    debouncedUpdate();
  });
});

/* ── Debounce ── */
let debounceTimer = null;
function debouncedUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(update, 280);
}

document.getElementById('monthlyPremium').addEventListener('input', debouncedUpdate);
document.getElementById('btnCalculate').addEventListener('click', update);

/* ── Init ── */
setTerm(5);
update();
