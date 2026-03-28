const scenarios = {
  worst: { rate: 0.03, label: "Worst Case Return · 3.0%", color: "#ef4444" },
  base: { rate: 0.115, label: "Base Case Return · 11.5%", color: "#64748b" },
  best: { rate: 0.155, label: "Best Case Return · 15.5%", color: "#B8860B" }
};

let chart;

// Format currency
function formatCurrency(val) {
  return "K" + val.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// Animate numbers
function animateValue(el, start, end, duration = 800) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = start + (end - start) * progress;
    el.textContent = formatCurrency(Math.round(value));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Core calculation
function calculate() {
  const premium = +document.getElementById("monthlyPremium").value;
  const years = +document.getElementById("investmentTerm").value;
  const scenarioKey = document.querySelector("input[name='scenario']:checked").value;
  const scenario = scenarios[scenarioKey];

  const feeRate = 0.01;
  const monthlyRate = scenario.rate / 12;
  const months = years * 12;

  let balance = 0;
  let totalGross = 0;
  let totalFees = 0;
  let totalNet = 0;

  let chartLabels = [];
  let fundValues = [];
  let netValues = [];

  for (let m = 1; m <= months; m++) {
    let fee = premium * feeRate;
    let net = premium - fee;

    totalGross += premium;
    totalFees += fee;
    totalNet += net;

    balance = (balance + net) * (1 + monthlyRate);

    if (m % 12 === 0) {
      chartLabels.push("Year " + m / 12);
      fundValues.push(balance);
      netValues.push(totalNet);
    }
  }

  const interest = balance - totalNet;
  const roi = (interest / totalNet) * 100;

  // Animate KPIs
  animateValue(document.getElementById("fundValue"), 0, balance);
  animateValue(document.getElementById("totalGross"), 0, totalGross);
  animateValue(document.getElementById("totalFees"), 0, totalFees);
  animateValue(document.getElementById("totalNet"), 0, totalNet);
  animateValue(document.getElementById("interestEarned"), 0, interest);

  // Gain bar
  const gainPct = Math.min(roi, 100);
  document.getElementById("gainFill").style.width = gainPct + "%";
  document.getElementById("gainLabel").textContent = `${roi.toFixed(1)}% total gain`;

  // Donut
  const circumference = 2 * Math.PI * 46;
  const offset = circumference * (1 - roi / 100);
  const donut = document.getElementById("donutFg");

  donut.style.strokeDasharray = circumference;
  donut.style.strokeDashoffset = offset;

  document.getElementById("donutPct").textContent = roi.toFixed(0) + "%";

  // Scenario pill update
  document.getElementById("scenarioPillText").textContent = scenario.label;
  document.getElementById("pillDot").style.background = scenario.color;

  // Chart
  renderChart(chartLabels, fundValues, netValues, scenario.color);

  // Narrative
  document.getElementById("fhMeta").textContent =
    `Based on ${scenario.label.toLowerCase()} · ${years} years`;
}

// Chart rendering
function renderChart(labels, fund, net, color) {
  const ctx = document.getElementById("growthChart").getContext("2d");

  if (chart) chart.destroy();

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color + "AA");
  gradient.addColorStop(1, color + "05");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Fund Value",
          data: fund,
          borderColor: color,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35
        },
        {
          label: "Net Invested",
          data: net,
          borderColor: "#94a3b8",
          borderDash: [6, 6],
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: {
            callback: val => "K" + val.toLocaleString()
          }
        }
      }
    }
  });
}

// Event listeners (LIVE interaction)
document.querySelectorAll("input").forEach(el => {
  el.addEventListener("input", calculate);
});

// Term buttons
document.getElementById("termPlus").onclick = () => {
  let el = document.getElementById("investmentTerm");
  el.value = +el.value + 1;
  document.getElementById("termDisplay").textContent = el.value;
  calculate();
};

document.getElementById("termMinus").onclick = () => {
  let el = document.getElementById("investmentTerm");
  if (el.value > 1) {
    el.value = +el.value - 1;
    document.getElementById("termDisplay").textContent = el.value;
    calculate();
  }
};

// Init
calculate();
