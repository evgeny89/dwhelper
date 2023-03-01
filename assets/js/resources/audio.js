window.resizeTo(0, 0);
onload = () => {
    let audio = new Audio('alarm.mp3');
    audio.volume = 1;
    audio.play();
    setTimeout(()=>{
        close();
    }, 3500);
}
