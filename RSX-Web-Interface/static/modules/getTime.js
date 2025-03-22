// gets the current time and truncates the string to include only HH:MM:SS

export default function getTime(){
    let time = new Date(Date.now()).toTimeString().substring(0, 8);
    return(time);
}