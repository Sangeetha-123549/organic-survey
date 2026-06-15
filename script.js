const scriptURL = "https://script.google.com/macros/s/AKfycby4IZQjAZ41DJ1akR6YUndjuYCH88fwCDA8ZwffcAWtDBXpeOWcjhMwYkROHhZvOWw/exec";

// ⏰ LIVE TIME DISPLAY
setInterval(() => {
  const timeBox = document.getElementById("time");
  if (timeBox) {
    timeBox.innerText = "Time: " + new Date().toLocaleString();
  }
}, 1000);

// 📍 SAFE GPS FUNCTION
function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: "Not supported", longitude: "Not supported" });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => {
        resolve({ latitude: "Denied", longitude: "Denied" });
      }
    );
  });
}

// 💾 FORM SUBMIT
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("surveyForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(form));

    const location = await getLocation();

    // ✅ FINAL FLAT PAYLOAD (IMPORTANT FIX)
    const payload = {
      time: new Date().toLocaleString(),
      latitude: location.latitude,
      longitude: location.longitude,
      ...formData
    };

    try {
      await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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
