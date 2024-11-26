let library = document.querySelector(".song-card");
let times = document.querySelector(".song-time");
let info = document.querySelector(".song-info");
let play = document.querySelector("#ert");
let currentAudio = null;
let currentButton = null;
let pre = document.querySelector("#pre");
let next = document.querySelector("#next");



function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}


function audiotime() {
    if (currentAudio != null) {
        currentAudio.addEventListener("timeupdate", () => {
            times.innerHTML = `${convertSecondsToMinutes(currentAudio.
                currentTime)} / ${convertSecondsToMinutes(currentAudio.duration)}`;
            document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";

        });
    }
}

let getsong = async () => {
    let response = await fetch("http://127.0.0.1:5501/spotifyclone/songs/");
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let a of as) {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href.split("/songs/")[1]);
        }
    }
    return songs;
}
let playbutton = () => {
    document.querySelectorAll(".song-card button").forEach(button => {
        button.addEventListener("click", async () => {
            info.innerText = button.innerText;

            let songName = button.innerText.replaceAll(" ", "%20"); // Replace spaces with %20
            let audioSrc = `http://127.0.0.1:5501/spotifyclone/songs/${songName}`;

            if (currentAudio && currentAudio.src === audioSrc) {
                if (currentAudio.paused) {
                    play.src = "pause.svg";
                    await currentAudio.play();
                } else {
                    play.src = "play.svg";
                    currentAudio.pause();
                }
            } else {
                if (currentAudio) {
                    currentAudio.pause();
                }
                let audio = new Audio(audioSrc);
                currentAudio = audio;
                play.src = "pause.svg";
                await currentAudio.play();
            }
            currentButton = button;
            audiotime();
        });
    });
};

next.addEventListener("click", () => {
    let btn = currentButton.nextElementSibling;
    if (btn) {
        info.innerText = btn.innerText;
        let songName = btn.innerHTML.replaceAll(" ", "%20"); // Replace spaces with %20
        let audioSrc = `http://127.0.0.1:5501/spotifyclone/songs/${songName}`;
        let audio = new Audio(audioSrc);
        if (currentAudio) {
            currentAudio.pause();
        }
        console.log("hello");
        play.src = "pause.svg"
        audio.play();
        currentAudio = audio;
        currentButton = btn;
        audiotime();
    }
});

pre.addEventListener("click", () => {
    let btn = currentButton.previousElementSibling;
    if (btn) {
        let songName = btn.innerHTML.replaceAll(" ", "%20"); // Replace spaces with %20
        let audioSrc = `http://127.0.0.1:5501/bigprojects/songs/${songName}`;
        let audio = new Audio(audioSrc);
        if (currentAudio) {
            currentAudio.pause();
        }
        currentAudio = audio;
        play.src = "pause.svg"
        audio.play();
        info.innerText = btn.innerText;
        currentButton = btn;
        audiotime();
    }
});

play.addEventListener("click", () => {
    if (play.src.includes("pause.svg")) {
        play.src = "play.svg";
        currentAudio.pause();
    } else if (play.src.includes("play.svg")) {
        play.src = "pause.svg";
        currentAudio.play();
    }
});

document.querySelector(".seek-bar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + '%';
    currentAudio.currentTime = ((currentAudio.duration) * percent) / 100;

})


document.querySelector(".range").addEventListener("change", e => {
    console.log(e.target.value);
    currentAudio.volume = parseInt(e.target.value) / 100;
})

let flag = 1;
document.querySelector(".vol").addEventListener("click", () => {
    if (flag == 1) {
        document.querySelector(".vol").src = "mute.svg";
        currentAudio.volume = 0;
        document.querySelector(".range").value = 0;
        flag = 0;
    }
    else {
        document.querySelector(".volume img").src = "volume.svg";
        currentAudio.volume = 1;
        flag = 1;
    }

})

async function main() {
    let songs = await getsong();
    for (let song of songs) {
        let btn = document.createElement("button");
        btn.innerHTML = song.replaceAll("%20", " ");
        btn.style.width = "95%";
        btn.classList.add('songcard-btn');
        library.appendChild(btn);
    }
    playbutton();
}

main();


