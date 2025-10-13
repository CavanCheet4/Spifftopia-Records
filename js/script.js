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