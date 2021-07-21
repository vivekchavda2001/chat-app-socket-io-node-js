//node server

const express = require("express");

const app = express()

const server = require("http").createServer(app);

const path = require('path');

const port = process.env.PORT || 8000;



const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});


const users = {};
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

app.use(express.static("public"))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index');
});


io.on('connection',socket =>{
  
    socket.on('new-user-joined',name=>{

        users[socket.id] = name;       
        socket.broadcast.emit('new-user-joined',name)

    });

    socket.on('send',message=>{

        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})

    });
    socket.on('disconnect', message => {
            socket.broadcast.emit('left',users[socket.id]);
            delete users[socket.id];
    })

    socket.on('typing', (data) => {
        if (data.typing == true)
            io.emit('display', data)
        else
            io.emit('display', data)
    })
})


server.listen(port, () => {
    console.log("Server is listening at port...",port);
});
