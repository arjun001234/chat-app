const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const router = require('./router');
const Filter = require('bad-words');
const {getMessages,getLocationMessage,getImage} = require('./utils/messages');
const {getUser,addUsers,removeUser,getUserInRoom} = require('./utils/user')

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection',(socket) => {
    console.log('connection');
    socket.on('join',(options,callback) => {
        const {error,user} = addUsers({id: socket.id, ...options})
        if(error){
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message',getMessages("Welcome!",'Admin'));
        socket.broadcast.to(user.room).emit('message',getMessages(`${user.username} has joined`,user.username));
        io.to(user.room).emit('roomData',{
            roomName: user.room,
            users: getUserInRoom(user.room)
        })
        callback();
    })
    socket.on('userMessage',(userMessage,callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(userMessage)){
            return callback('Bad-words not allowed')
        }
        io.to(user.room).emit('message',getMessages(userMessage,user.username))
        callback('Delivered');
    })
    socket.on('locationMessage',(coords,callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('userLocation',getLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user.username))
        callback('Location Shared!')
    })
    socket.on('image',(img,callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('imageupload',getImage(img,user.username));
        callback('image Uploaded')
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message',getMessages(user.username + " had left",'Admin'))
        io.to(user.room).emit('roomData',{
            roomName: user.room,
            users: getUserInRoom(user.room)
        })
        }
    })
})

app.use(router);

server.listen(port,() => {
    console.log(`Running on port ${port}`);
})