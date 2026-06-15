const sheetURL = "https://docs.google.com/spreadsheets/d/1R75-Mb2glPowZr4MQaoH3cX45scpaijVYQ4fJffCT6w/export?format=csv&gid=0";

let pieChart, barChart;

// 📊 INIT CHARTS
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

// 🔄 FETCH DATA
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

    // ✅ safer CSV split
    const cols = row.split(",").map(c => c.replace(/"/g, "").trim());

    if (cols.length < 12) return;

    total++;

    const organicAnswer = cols[8]; // ⚠️ check your sheet index

    if (organicAnswer === "Yes") organic++;
    else if (organicAnswer === "No") chemical++;
    else partial++;

    const water = cols[12];

    if (water === "Borewell") borewell++;
    else if (water === "Rain Water" || water === "Rainwater") rainwater++;
    else if (water === "Canal") canal++;
    else if (water === "River" || water === "Tank") tank++;
  });

  pieChart.data.datasets[0].data = [organic, partial, chemical];
  pieChart.update();

  barChart.data.datasets[0].data = [borewell, rainwater, canal, tank];
  barChart.update();

  document.getElementById("total").innerText =
    "👨‍🌾 Total Farmers: " + total;
}

setInterval(updateDashboard, 5000);

initCharts();
updateDashboard();
