let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if seconds is less than 10
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }

    return minutes + ":" + remainingSeconds;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }
    return songs
}

const playMusic=(track)=>{
    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    play.src = "Assets/pause_song.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songduration").innerHTML = "00:00/00:00"
}

async function main()
{
    songs = await getSongs("Songs/R&B");
    let list = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        list.innerHTML = list.innerHTML + `<li> <div class="songsCard">
        <img src="/Assets/music.svg" alt="">
        ${song.replace("%20"," ")}
        <img src="/Assets/play_song_2.svg" alt="">
    </div> </li>`;
    }
    

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector("div").innerText)
        })
        
    })
    
    play.addEventListener("click", ()=>{
        if(currentSong.paused)
        {
            currentSong.play()
            play.src = "Assets/pause_song.svg"
        }
        else 
        {
            currentSong.pause()
            play.src = "Assets/play_song.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%"
    })

    document.querySelector(".seekBar").addEventListener("click",e=>{

        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent+"%";

        currentSong.currentTime = currentSong.duration*percent/100
    })

    document.querySelector(".hamb").addEventListener("click", ()=>{
        document.querySelector(".cross").style.display="inline"
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".cross").addEventListener("click", ()=>{
        
        document.querySelector(".left").style.left="-100%"
    })

    prev.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        playMusic(songs[index-1].replace("%20"," "))
    })

    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        playMusic(songs[index+1].replace("%20"," "))
    })

    document.querySelector(".range").addEventListener("change", (e)=>{
        currentSong.volume=e.target.value/100
    })

}

main()
