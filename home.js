console.log("Lets write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
let Index = 0;
const playMusic = (songFile, track, category, pause = false) => {
  currFolder = category;
  // console.log(currFolder);
  // console.log(track);
  currentSong.src = `songs/${currFolder}/` + track; // Fixed path
  Index = songFile.indexOf(track); // Find the track in the songs array
  // console.log(Index);

  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  return Index;
};

async function displayAlbums() {
  console.log("displaying albums");
  fetch("songs/songs.json")
    .then((response) => response.json())
    .then((data) => {
      displayCategories(data);
    })
    .catch((error) => console.error("Error loading songs:", error));
  function displayCategories(data) {
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ""; // Clear existing content

    Object.keys(data).forEach((category) => {
      const coverImage = `songs/${category}/cover.jpg`; // Assuming cover.jpg is present in each category folder

      // Create a category card
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                    <img src="${coverImage}" alt="${category}">
                    <h3>${category.toUpperCase()}</h3>
                    <p>Click to view songs</p>
                `;
      card.addEventListener("click", () =>
        displaySongs(category, data[category])
      
      ); // Click event
      cardContainer.appendChild(card);
    });
  }
  function displaySongs(category, songFiles) {
    songs = songFiles;
    const songList = document.querySelector(".songlist ul");
    songList.innerHTML = ""; // Clear previous songs
    document.getElementById("folder").innerHTML= `${category}`
    // Open the hamburger menu automatically
    document.querySelector(".left").style.left = "0"; 
    songFiles.forEach((songFile) => {
      const songName = songFile.replace(/\.[^/.]+$/, ""); // Remove file extension
      const songPath = `songs/${category}/${songFile}`; // Full path to song file
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                    <div class="info">
                        <strong>${songName}</strong>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img src="play.svg" alt="Play" class="invert">
                    </div>
                `;
                listItem.addEventListener("click", (e) => {
                  // Reset all other buttons to "play"
                  document.querySelectorAll(".playnow img").forEach(img => img.src = "play.svg");
                
                  // Set current button to "pause"
                  const playBtn = e.currentTarget.querySelector(".playnow img");
                  playMusic(songs, songFile, category);
                  playBtn.src = "pause.svg";
                
                  // Store reference to the current play button
                  currentSong.playBtn = playBtn;
                });// Pass category
      songList.appendChild(listItem);
    });
    return songs;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector(".Loginbtn");
  const profileContainer = document.querySelector(".profile-container");
  const profileIcon = document.querySelector(".profile-icon");
  const popup = document.querySelector(".popup");
  const popupEmail = document.getElementById("popup-email");
  const signOutBtn = document.getElementById("signout-btn");
  const closePopup = document.querySelector(".close-popup");

  let registereddate = localStorage.getItem("email");
  let userEmail = localStorage.getItem("username");
  console.log(registereddate);
  console.log(userEmail);
  let googleUser = JSON.parse(localStorage.getItem("user")); // Google login
  if (googleUser) {
    // Show Google User Name
    profileContainer.style.display = "inline-block";
    profileIcon.textContent = googleUser.name.charAt(0).toUpperCase(); // First letter as icon
    popupEmail.textContent = googleUser.name; // Show full name in popup
  } else if (userEmail) {
    // Show Manual User Name
    profileContainer.style.display = "inline-block";
    profileIcon.textContent = userEmail.charAt(0).toUpperCase();
    popupEmail.textContent = userEmail;
  } else {
    // Redirect to login if no user is found
    alert("You must log in first!");
    window.location.href = "index.html";
  }

  // Show popup when clicking the profile icon
  profileIcon.addEventListener("click", function () {
    popup.style.display = "block";
  });

  // Close popup when clicking ✖
  closePopup.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // Sign out
  signOutBtn.addEventListener("click", function () {
    window.location.href = "index.html"; // Redirect to login page
  });
});

async function main() {
  // Display all the albums on the page
  await displayAlbums();

  // Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
      document.querySelector(
        ".songtime"
      ).innerHTML = `${secondsToMinutesSeconds(
        currentSong.currentTime
      )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
      document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
  });

  previous.addEventListener("click", () => {
    if (!songs.length) return; // Prevent errors if no songs are loaded

    currentSong.pause();
    console.log("Previous clicked");
    if (currentSong.playBtn) {
      currentSong.playBtn.src = "play.svg"; // reset previous button to play
    }
    if (Index > 0) {
      Index--; // Move to the previous song
    } else {
      Index = songs.length - 1; // Loop to the last song if at the start
    }

    playMusic(songs, songs[Index], currFolder);
    const allButtons = document.querySelectorAll(".songlist ul li");
    const nextBtn = allButtons[Index]?.querySelector(".playnow img");
    if (nextBtn) {
      nextBtn.src = "pause.svg";
      currentSong.playBtn = nextBtn; // update reference
    }
  });

  next.addEventListener("click", () => {
    if (!songs.length) return; // Prevent errors if no songs are loaded
    if (currentSong.playBtn) {
      currentSong.playBtn.src = "play.svg"; // reset previous button to play
    }
    currentSong.pause();
    console.log("Next clicked");

    if ((Index + 1) < songs.length) {
      Index ++; // Move to the next song
    } else {
      Index = 0; // Loop to the last song if at the start
    }

    playMusic(songs, songs[Index], currFolder);
    const allButtons = document.querySelectorAll(".songlist ul li");
    const nextBtn = allButtons[Index]?.querySelector(".playnow img");
    if (nextBtn) {
      nextBtn.src = "pause.svg";
      currentSong.playBtn = nextBtn; // update reference
    }
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("mute.svg", "volume.svg");
      }
    });

  // Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });

  currentSong.addEventListener("ended", () => {
    if (currentSong.playBtn) {
      currentSong.playBtn.src = "play.svg"; // reset previous button to play
    }
    if (Index + 1 < songs.length) {
      Index ++
      console.log(Index)
    } else {
      // If it's the last song, restart from the first song
      Index = 0;
      console.log(Index)
    }
    playMusic(songs, songs[Index], currFolder);

    const allButtons = document.querySelectorAll(".songlist ul li");
    const nextBtn = allButtons[Index]?.querySelector(".playnow img");
    if (nextBtn) {
      nextBtn.src = "pause.svg";
      currentSong.playBtn = nextBtn; // update reference
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // 🌟 Add hover effect to profile icon
  const profileIcon = document.querySelector(".profile-icon");
  if (profileIcon) {
    profileIcon.addEventListener("mouseover", () => {
      profileIcon.style.backgroundColor = "#f6d365"; /* Change color on hover */
    });

    profileIcon.addEventListener("mouseleave", () => {
      profileIcon.style.backgroundColor = "#1db954"; /* Reset color */
    });
  }
});

main();
