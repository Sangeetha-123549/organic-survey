const scriptURL = "https://script.google.com/macros/s/AKfycbxPkkLkJ5C04iUkAPdbfIc9SeVe021tBeYvBYXzjgUWA2N8vFYtA_vpyb6g4D0ePao/exec";

// ⏰ LIVE TIME DISPLAY
setInterval(() => {
  const timeBox = document.getElementById("time");
  if (timeBox) {
    timeBox.innerText = "Time: " + new Date().toLocaleString();
  }
}, 1000);

// 📍 GPS LOCATION
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
        resolve({
          latitude: "Denied",
          longitude: "Denied"
        });
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

    // ✅ CLEAN PAYLOAD (IMPORTANT)
    const payload = {
      name: formData.farmerName || "",
      age: formData.q1 || "",
      years: formData.q4 || "",
      crops: formData.q5 || "",
      chemical: formData.q7 || "",
      organic: formData.q6 || "",
      pesticide: formData.q9 || "",
      awareness: formData.q10 || "",
      training: formData.q11 || "",
      water: formData.q12 || "",
      acres: formData.q3 || "",
      location: formData.location || "",
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
