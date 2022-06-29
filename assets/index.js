const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  synonyms = wrapper.querySelector(".synonym .list"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text");
let audio = document.getElementById("audio");

// ---------------- Events ----------------
volume.addEventListener("click", (e) => {
  if (e.target.nextElementSibling.getAttribute("src") === "") {
    console.error("No media file found");
  } else {
    audio.play();
  }
})

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchApi(e.target.value);
  }
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active")
  infoText.style.color = "#9a9a9a"
  infoText.innerHTML = " Type any existing word and press enter to get meaning, example, synonyms, etc."
});

// ---------------- End of Events ----------------

/**
 * Fetch API Function
 * @param {*} word 
 */
function fetchApi(word) {
  infoText.style.color = "#000";
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching for the meaning of <span>"${word}"</span>`;

  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word))
    .catch(err => console.error(err));
}

/**
 * Data Processing Function
 * @param {*} result 
 * @param {*} word 
 * @returns 
 */
function data(result, word) {
  if (result.title) {
    wrapper.querySelector(".word p").innerText = word;
    wrapper.querySelector(".word span").innerText = `${result.message}`;
  }

  wrapper.classList.add("active");
  wrapper.querySelector("ul").style.height = "100%";
  wrapper.querySelector("ul").style.opacity = 1;

  phoneticsText = `Commonly pronounced as ${result[0].phonetics[0].text}`;
  phoneticsAudio = result[0].phonetics[result[0].phonetics.length - 1].audio;

  wrapper.querySelector(".word p").innerText = result[0].word;
  wrapper.querySelector(".word span").innerText = phoneticsText;
  audio.setAttribute("src", phoneticsAudio);

  let definitions = result[0].meanings[0].definitions[0];

  wrapper.querySelector(".meaning span").innerText = definitions.definition;

  if (definitions.example === undefined) {
    wrapper.querySelector(".example").style.display = "none";
  } else {
    wrapper.querySelector(".example span").innerText = definitions.example;
  }

  if (definitions.synonyms[0] === undefined) {
    synonyms.parentElement.style.display = "none";
  } else {
    synonyms.parentElement.style.display = "block";
    synonyms.innerHTML = "";
    for (let syn in synonyms) {
      let tag = `<span onclick=search('${definitions.synonyms[syn]}')>${definitions.synonyms[syn]}</span>`
      synonyms.insertAdjacentHTML("beforeend", tag)
    }
  }
}