const emojis = ["📱", "🎵", "🎬", "🚀", "💻", "🎵", "🎧", "🎬"];
const emojis_setBlue = ["🔵", "🔵", "🔵", "🔵", "🔵", "🔵", "🔵"];
const emojis_setTech = ["💻", "🖥️", "📱", "⌨️", "💾", "🖱️", "🕹️", "🔌"];
const emojis_setNature = ["🌳", "🌻", "🌦️", "🌈", "🍁", "🌿", "🌊", "🏞️"];
const emojis_setArt = ["🎨", "🖌️", "🖼️", "🎭", "🎵", "🎬", "🎤", "🎧"];
const emojis_setSpace = ["🌕", "🌠", "🚀", "💫", "🛰️", "🪐", "🌌", "🌟"];
const emojis_setFitness = ["💪", "🏋️", "🧘", "🚴", "🥗", "🏃", "🏊", "⛹️"];

function randomEmoji() {
	return emojis[Math.floor(Math.random() * emojis.length)];
}

function createGrid() {
	const container = document.getElementById("grid-container");

	for (let i = 0; i < 100; i++) {
		const emojiDiv = document.createElement("div");
		emojiDiv.className = "emoji";
		emojiDiv.textContent = randomEmoji();
		const delay = Math.random() * 2;

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

createGrid();
setInterval(updateGrid, 10000);
