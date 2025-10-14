/***********************
* MODE TOGGLE BEHAVIOR *
***********************/

const toggleModeBtn = document.getElementById("toggle-mode-btn");
const body = document.body;

function applyMode(mode) {
	body.classList.remove("light-mode", "dark-mode");
	body.classList.add(mode);

	if (mode === "dark-mode") {
		toggleModeBtn.style.color = "rgb(245, 245, 245)";
		toggleModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
	} else {
		toggleModeBtn.style.color = "rgb(2, 4, 8)";
		toggleModeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
	}
}

let savedMode = localStorage.getItem("mode");

if (savedMode === null) {
	savedMode = "light-mode";
}
applyMode(savedMode);

toggleModeBtn.addEventListener("click", function () {
	let newMode;

	if (body.classList.contains("light-mode")) {
		newMode = "dark-mode";
	} else {
		newMode = "light-mode";
	}

	applyMode(newMode);

	localStorage.setItem("mode", newMode);
});

const hideOverlayBtn = document.getElementById("hide-overlay-btn");
const hideOverlayIcon = document.getElementById("hide-overlay-icon");
const mapOverlay = document.querySelector(".overlay-image");

hideOverlayBtn.addEventListener("click", function () {
  if (mapOverlay.style.opacity === "0") {
    mapOverlay.style.opacity = "1";
	hideOverlayIcon.classList.remove("bi-check-circle");
	hideOverlayIcon.classList.add("bi-check-circle-fill");
  } else {
    mapOverlay.style.opacity = "0";
	hideOverlayIcon.classList.remove("bi-check-circle-fill");
	hideOverlayIcon.classList.add("bi-check-circle");
  }
});