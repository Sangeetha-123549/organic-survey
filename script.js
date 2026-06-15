const scriptURL = "https://script.google.com/macros/s/AKfycby4IZQjAZ41DJ1akR6YUndjuYCH88fwCDA8ZwffcAWtDBXpeOWcjhMwYkROHhZvOWw/exec";

// ⏰ LIVE TIME
setInterval(() => {
  const timeBox = document.getElementById("time");
  if (timeBox) {
    timeBox.innerText = "Time: " + new Date().toLocaleString();
  }
}, 1000);

// 📍 GPS
function getLocation() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => {
        resolve({
          latitude: "Denied",
          longitude: "Denied"
        });
      }
    );
  });
}

// 💾 SUBMIT
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("surveyForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(form));
    const location = await getLocation();

    // ✅ IMPORTANT: clean mapping (not spread)
    const payload = {
      name: formData.farmerName,
      age: formData.q1,
      crops: formData.q5,
      organic: formData.q6,
      water: formData.q12,
      latitude: location.latitude,
      longitude: location.longitude,
      time: new Date().toLocaleString()
    };

    try {
      await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      alert("Submitted Successfully ✅");
      window.location.href = "thankyou.html";

    } catch (err) {
      alert("Submission Failed ❌");
      console.log(err);
    }
  });
});
