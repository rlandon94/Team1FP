//assigning vars to elements on page 
//track info
let track_art = document.querySelector(".song-img");
let track_name = document.querySelector('h1');
let track_artist = document.querySelector("p")
//buttons
let playpause_btn = document.querySelector(".pauseplay")
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
//slider
let seek_slider = document.querySelector('.seek_slider')
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0
let updateTimer;
let isPlaying = false;

//create audio element 
let curr_track = document.createElement('audio');


let track_list = [
    {
        name: "Night Owl",
        artist: "Broke For Free",
        image: "https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
    },
    {
        name: "Shipping Lanes",
        artist: "Chad Crouch",
        image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    }

]

//load track
function loadTrack(track_index){
    //clear previous track
    clearInterval(updateTimer)
    resetValues();

    //load new track
    curr_time.src = track_list[track_index].path;
    curr_track.load();

    //update track info
    track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    track_name.textContent = track_list[track_index].name;
    track_artist.textContent = track_list[track_index].artist;

    //update slider
    updateTimer = setInterval(seekUpdate, 1000);

    //move to next track
    curr_track.addEventListener("ended", nextTrack);
}

function resetValues(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value=0;
}

function playPauseTrack(){
    //switch between play and pause
    if (!isPlaying){playTrack();}
    else {pauseTrack();}
}

function playTrack(){
    curr_track.play();
    isPlaying = true;
}

function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
}

function nextTrack(){
    if (track_index < track_list.length - 1){
        track_index +=1
    }
    else {track_index = 0};

    loadTrack(track_index);
    playTrack();
}

function prevTrack(){
    if (track_index > 0){
        track_index -= 1;
    }
    else {track_index = track_list.length - 1};
    loadTrack(track_index);
    playTrack();

}

function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value /100)
    curr_track.currentTime = seekto;
}

function seekUpdate(){
    let seekPosition = 0;
    if (!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100/curr_track.duration);
        seek_slider.value = seekPosition;

        //calc time left 
        let currentMin = Math.floor(curr_track.currentTime / 60)
        let currentSec = Math.florr(curr_track.currentTime - currentMin * 60);
        let durationMin = Math.floor(curr_track.duration / 60);
        let durationSec = Math.floor(curr.duration - durationMin * 60)

        //format time correctly
        if (currentSec < 10){
            currentSec = "0" +currentSec
        };
        if (durationSec < 10){
            durationSec = "0" +durationSec
        };
        if (currentMin < 10){
            currentMin = "0" +currentMin
        };
        if (durationMin<10){
            durationMin = "0" +durationMin
        };

        curr_time.textContent = currentMin+":"+currentSec;
        total_duration.textContent = durationMin+':'+durationSec;
    }
}

loadTrack(track_index)