export default function getTime(){
    let time = new Date(Date.now()).toTimeString().substring(0, 8);
    return(time);
}