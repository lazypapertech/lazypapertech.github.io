const emojis = ["🖥️", "💻", "🎬", "🚀", "🎵", "🎨", "🎧", "📈"];
const emojis_setBlue = ["🔵", "🔵", "🔵", "🔵", "🔵", "🔵", "🔵"];
const emojis_setTech = ["💻", "🖥️", "📱", "⌨️", "💾", "🖱️", "🕹️", "🔌"];
const emojis_setNature = ["🌳", "🌻", "🌦️", "🌈", "🍁", "🌿", "🌊", "🏞️"];
const emojis_setArt = ["🎨", "🖌️", "🖼️", "🎭", "🎵", "🎬", "🎤", "🎧"];
const emojis_setSpace = ["🌕", "🌠", "🚀", "💫", "🛰️", "🪐", "🌌", "🌟"];
const emojis_setFitness = ["💪", "🏋️", "🧘", "🚴", "🥗", "🏃", "🏊", "⛹️"];

function randomEmoji() {
	// change the emoji array here and it will reflect
	return emojis[Math.floor(Math.random() * emojis.length)];
}

function createGrid() {
	const container = document.getElementById("grid-container");

	for (let i = 0; i < 100; i++) {
		// Reduced the grid to 10x10
		const emojiDiv = document.createElement("div");
		emojiDiv.className = "emoji";
		emojiDiv.textContent = randomEmoji();
		const delay = Math.random() * 2;

		// Apply the animation to only 50% of the emojis
		if (Math.random() > 0.5) {
			emojiDiv.classList.add("show-emoji");
		}

		emojiDiv.style.animationDelay = `${delay}s`;
		container.appendChild(emojiDiv);
	}
}

function updateGrid() {
	const emojisDivs = document.querySelectorAll(".emoji");
	emojisDivs.forEach((emojiDiv) => {
		if (emojiDiv.classList.contains("show-emoji")) {
			emojiDiv.textContent = randomEmoji();
		}
	});
}

function start() {
	alert("Starting the journey of education!");
}

createGrid();
setInterval(updateGrid, 10000);
