const scriptURL = "https://script.google.com/macros/s/AKfycbymmIobkghxGzgRrHwQzEGzzYyuWu29BJFqGkFQQwxrw-sEX1hYHOEzz_uu_px7zVI/exec";

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
      resolve({ lat: "Not supported", lon: "Not supported" });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      () => {
        resolve({ lat: "Denied", lon: "Denied" });
      }
    );
  });
}

// 💾 FORM SUBMIT
document.getElementById("surveyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  // get GPS safely
  const location = await getLocation();

  // final payload (VERY IMPORTANT for marks)
  const payload = {
    time: new Date().toLocaleString(),
    latitude: location.lat,
    longitude: location.lon,
    responses: formData
  };

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    alert("Submitted Successfully ✅");
    window.location.href = "thankyou.html";

  } catch (err) {
    alert("Error submitting form ❌");
    console.log(err);
  }
});