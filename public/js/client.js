
    const socket = io('https://chatapp-socketio-nodejs.herokuapp.com');
// const io = require('socket.io')(8000);




const form = document.getElementById("send-container")

const message = document.getElementById("messageInput")

const card = document.querySelector(".card-body")

const user = prompt("Who are you?","Guest");

var typing = false;

var timeout = undefined;


form.addEventListener('submit',(e)=>{

    e.preventDefault();

    const msg = message.value;

    append(`${msg}:You`,'right');

    socket.emit('send',msg);

    message.value = "";
})

const append = (message,positions) => {

    const messageElement = document.createElement("div")

    messageElement.innerText = message;
    
    messageElement.classList.add('message');

    messageElement.classList.add(positions);

    const timeElement =  document.createElement("p")
    var today = new Date();
    timeElement.innerText = today.getHours() + ":" + today.getMinutes();

    timeElement.classList.add('time'+positions);

    timeElement.classList.add('commonTime');

    card.append(messageElement);
    card.append(timeElement);


    scrollDown();

}


socket.emit('new-user-joined',user)

socket.on('new-user-joined',name=>{
    
        append(`${name} Is Just Joined The Chat`,'right')
})


socket.on('receive', data => {

    append(` ${data.name}:${data.message} `, 'left')
})

socket.on('left',user=>{

     append(`${user} Left The Chat`, 'right')
})

function scrollDown(){
    var objDiv = document.getElementById("chatbox");

    objDiv.scrollTop = objDiv.scrollHeight - objDiv.clientHeight;

    console.log(objDiv.scrollHeight)

}



$(document).ready(function () {
    $('#messageInput').keypress((e) => {
        if (e.which != 13) {
            typing = true
            socket.emit('typing', { user: user, typing: true })
            clearTimeout(timeout)
            timeout = setTimeout(typingTimeout, 3000)
        } else {
            clearTimeout(timeout)
            typingTimeout()
            
        }
    })

})
function typingTimeout() {
    typing = false
    socket.emit('typing', { user: user, typing: false })
}

socket.on('display', (data) => {
    if (data.typing == true)
        $('.typing').text(`${data.user} is typing...`)
    else
        $('.typing').text("")
    scrollDown();
})
