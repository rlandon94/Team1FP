const menuBtn = document.querySelector(".menu-btn"),
  screen = document.querySelector(".screen"),
  playlistContainer = document.getElementById("playlist"),
  coverImage = document.querySelector(".coverImage"),
  infoWrapper = document.querySelector(".info"),
  current = document.querySelector(".current"),
  playPause = document.getElementById("playpause"),
  prev = document.getElementById("prev"),
  next = document.getElementById("next"),
  CurrentFavorite = document.querySelector("#current-favorite"),
  shuffleBtn = document.querySelector("#shuffle"),
  repeatBtn = document.querySelector("#repeat"),
  optionsBtn = document.querySelector("#options"),
  progressBar = document.querySelector(".bar"),
  progressDot = document.querySelector(".dot"),
  currentTimeEl = document.querySelector(".current-time"),
  durationEl = document.querySelector(".duration");

let playing = false,
  currentSong = 0,
  favorites = [],
  shuffle = false,
  repeat = false,
  interval = null;
audio = new Audio();

menuBtn.addEventListener("click", () => {
  screen.classList.toggle("active");
});

const songs = [
  {
    title: "Song 1 SDEV265",
    artist: "Team 1",
    img_src: "1.jpg",
    src: "1.mp3",
  },
  {
    title: "Song 2 SDEV265",
    artist: "Team 1",
    img_src: "2.jpg",
    src: "2.mp3",
  },
];

function init() {
  addToList(songs);
  loadSong(currentSong);
}

function addToList(songs) {
  playlistContainer.innerHTML = "";

  songs.forEach((song, index) => {
    const { title, src } = song;

    const isFavorit = favorites.includes(index);
    const tr = document.createElement("tr");
    tr.classList.add("song");
    tr.innerHTML = `
        <td class="nr">
            <h5>${index + 1}</h5>
        </td>
        <td class="title">
            <h6>${title}</h6>
        </td>
        <td class="length">
            <h5>00:00</h5>
        </td>
        <td>
            <i class="fas fa-heart ${
              isFavorit ? "active" : ""
            } favorite-list"></i>
        </td>
    `;

    tr.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-list")) {
        addToFavorites(index);
        e.target.classList.toggle("active");
        return;
      }
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      screen.classList.remove("active");
      playPause.classList.replace("fa-play", "fa-pause");
      playing = true;
    });
    playlistContainer.appendChild(tr);

    const audioForDuration = new Audio(`media/${src}`);
    audioForDuration.addEventListener("loadedmetadata", () => {
      const duration = audioForDuration.duration;

      let songDuration = formatTime(duration);
      tr.querySelector(".length h5").innerText = songDuration;
    });
  });
}

init();

function loadSong(num) {
  coverImage.style.backgroundImage = `url(media/${songs[num].img_src})`;
  infoWrapper.innerHTML = `
        <h2>${songs[num].title}</h2>
        <h3>${songs[num].artist}</h3>
    `;
  current.innerHTML = songs[num].title;
  audio.src = `media/${songs[num].src}`;
  if (favorites.includes(num)) {
    CurrentFavorite.classList.add("active");
  } else {
    CurrentFavorite.classList.remove("active");
  }
  progress();
}

function nextSong() {
  if (shuffle) {
    shuffleFunc();
    loadSong(currentSong);
  } else if (currentSong < songs.length - 1) {
    currentSong++;
    loadSong(currentSong);
  } else {
    currentSong = 0;
    loadSong(currentSong);
  }

  if (playing) {
    audio.play();
  }
}

function prevSong() {
  if (shuffle) {
    shuffleFunc();
    loadSong(currentSong);
  }
  if (currentSong > 0) {
    currentSong--;
    loadSong(currentSong);
  } else {
    currentSong = songs.length - 1;
    loadSong(currentSong);
  }
  if (playing) {
    audio.play();
  }
}

playPause.addEventListener("click", () => {
  if (playing) {
    playPause.classList.replace("fa-pause", "fa-google-play");
    playing = false;
    audio.pause();
  } else {
    playPause.classList.replace("fa-google-play", "fa-pause");
    playing = true;
    audio.play();
  }
});
next.addEventListener("click", nextSong);
prev.addEventListener("click", prevSong);

function addToFavorites(index) {
  if (favorites.includes(index)) {
    favorites = favorites.filter((item) => item !== index);
    CurrentFavorite.classList.remove("active");
  } else {
    favorites.push(index);
    if (index === currentSong) {
      CurrentFavorite.classList.add("active");
    }
  }
  addToList(songs);
}

CurrentFavorite.addEventListener("click", () => {
  addToFavorites(currentSong);
  CurrentFavorite.classList.toggle("active");
});

function shuffleFunc() {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else {
    currentSong++;
  }
}

function shuffleSongs() {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
}

function repeatSongs() {
  if (repeat === 1) {
    repeat = 2;
    repeatBtn.classList.add("active");
  } else if (repeat === 2) {
    repeat = 0;
    repeatBtn.classList.remove("active");
  } else {
    repeat = 1;
    repeatBtn.classList.add("active");
  }
}

shuffleBtn.addEventListener("click", shuffleSongs);
repeatBtn.addEventListener("click", repeatSongs);

audio.addEventListener("ended", () => {
  if (repeat === 1) {
    loadSong(currentSong);
    audio.play();
  } else if (repeat === 2) {
    nextSong();
    audio.play();
  } else {
    if (currentSong === songs.length - 1) {
      audio.pause();
      playPause.classList.replace("fa-pause", "fa-google-play");
      playing = false;
    } else {
      nextSong();
      audio.play();
    }
  }
});

function progress() {
  let { duration, currentTime } = audio;
  isNaN(duration) ? (duration = 0) : duration;
  isNaN(currentTime) ? (currentTime = 0) : currentTime;

  currentTimeEl.innerHTML = formatTime(currentTime);
  durationEl.innerHTML = formatTime(duration);

  let progressPercent = (currentTime / duration) * 100;
  progressDot.style.left = `${progressPercent}%`;
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}

audio.addEventListener("timeupdate", progress);

function setProgress(e) {
  let width = this.clientWidth;
  let clickX = e.offsetX;
  let duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener("click", setProgress);
