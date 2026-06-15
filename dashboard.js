const sheetURL = "https://docs.google.com/spreadsheets/d/1R75-Mb2glPowZr4MQaoH3cX45scpaijVYQ4fJffCT6w/export?format=csv&gid=0";

let pieChart, barChart;

function initCharts() {

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Organic", "Partial", "Chemical"],
      datasets: [{
        data: [0, 0, 0]
      }]
    }
  });

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Borewell", "Rainwater", "Canal", "Tank"],
      datasets: [{
        label: "Farmers",
        data: [0, 0, 0, 0]
      }]
    }
  });
}

// 🔄 UPDATE DASHBOARD
async function updateDashboard() {

  const res = await fetch(sheetURL);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1);

  let organic = 0;
  let partial = 0;
  let chemical = 0;

  let borewell = 0;
  let rainwater = 0;
  let canal = 0;
  let tank = 0;

  let total = 0;

  rows.forEach(row => {

    const cols = row.split(",").map(c => c.replace(/"/g, "").trim());

    // ✅ safety check
    if (cols.length < 10) return;

    total++;

    // 🟢 safer logic (not strict index dependency)
    const values = cols.join(" ").toLowerCase();

    // Organic logic
    if (values.includes("yes")) organic++;
    else if (values.includes("no")) chemical++;
    else partial++;

    // Water logic
    if (values.includes("borewell")) borewell++;
    else if (values.includes("rain")) rainwater++;
    else if (values.includes("canal")) canal++;
    else if (values.includes("river") || values.includes("tank")) tank++;
  });

  pieChart.data.datasets[0].data = [organic, partial, chemical];
  pieChart.update();

  barChart.data.datasets[0].data = [borewell, rainwater, canal, tank];
  barChart.update();

  const totalBox = document.getElementById("total");
  if (totalBox) {
    totalBox.innerText = "👨‍🌾 Total Farmers: " + total;
  }
}

setInterval(updateDashboard, 5000);

initCharts();
updateDashboard();
