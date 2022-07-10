const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./build'));

app.use('/', (req, res, next) => {
    if (req.method !== 'GET' ){
        return next();
    }  else {
        res.sendFile(path.join(__dirname+'/build/index.html'));
    }
});

//app.use(express.static(__dirname + '/build/index.html'));

const { mongoose } = require("mongoose");
const uri = "mongodb+srv://pub:2VCFbXX0Ift1Qpp7@chatnow.6oilf.mongodb.net/chatnow?retryWrites=true&w=majority";
mongoose.connect(uri);

const userSchema = mongoose.Schema({
    username: String,
    password: String,
 });
const User = mongoose.model("User", userSchema);

app.post('/checkusername', (req, res) => {
    const username = req.body.username;
    User.findOne({username: username}, (err, response)=>{
        const result = {taken: false};
        if(response){
            result.taken = true;
            res.send(JSON.stringify(result));
        } else {
            res.send(JSON.stringify(result));
        }
    })
});

app.post('/reguser', (req, res) => {
    const username = req.body.username; const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    var newUser = new User({
        username: username,
        password: password
    });

    newUser.save( (err)=>{
        if (err){
            const result = {success: false};
            res.send(JSON.stringify(result));
        } else {
            const result = {success: true};
            res.send(JSON.stringify(result));
        }
    });
});

app.post('/loginuser', (req, res) => {
    const username = req.body.username;
    User.findOne({username: username}, (err, response)=>{
        const result = {username: false, password: false};
        if(!response){
            res.send(JSON.stringify(result));
        } else {
            result.username = true;
            if (response.password === crypto.createHash('sha256').update(req.body.password).digest('hex')){
                result.password = true;
                res.send(JSON.stringify(result));
            } else {
                res.send(JSON.stringify(result));
            }
        }
    })
});

const io = new Server(httpServer);

const bot_name = "ChatNow_Bot";

//Object of array
userList = {
    Felwood: [],
    Lordaeron: [],
    Kalimdor: [],
    Dalaran: [],
    Ashenvale: []
};

io.on("connection", (socket) => {
    let user = {username: '', room: ''};

    //Handle Room Joining
    socket.on("joinRoom", (username, room)=>{
        if (user.room){
            socket.leave(user.room); //Quit previous room if available, sanity check
        }

        user = {username:username, room:room};
        socket.join(user.room);

        if ((userList[user.room]).findIndex(users=>users===user.username) === -1){
            socket.to(user.room).emit("message", messageFormat(`${user.username} has joined the room!`, bot_name));
            socket.emit("welcomeMessage", messageFormat(`Welcome to ${user.room}, ${user.username}!`, bot_name));
        }

        userList[user.room] = userList[user.room].concat(username);

        const uniqueList = (userList[user.room]).filter(onlyUnique);
        io.to(user.room).emit("userListUpdate", uniqueList);
    });

    //Handle Message
    socket.on("chatMessage", (message)=>{
        io.to(user.room).emit("message", messageFormat(message, user.username));
    })

    //Handle Leave Silently
    socket.on("leaveSilent", ()=>{
        if(user.room){
            socket.leave(user.room);
            user.room = '';
        }
    })

    //Handle Room Leaving
    socket.on("leaveRoom", ()=>{
        if (user.room){ //sanity check
            socket.leave(user.room);

            socket.to(user.room).emit("message", messageFormat(`${user.username} has left the room`, bot_name));
            socket.to(user.room).emit("leaveAll", user.username);

            //Leave all room
            userList[user.room] = userList[user.room].filter(item => item !== user.username);

            const uniqueList = (userList[user.room]).filter(onlyUnique);
            socket.to(user.room).emit("userListUpdate", uniqueList);
            user.room = ''; 
        }
    })    
    
    //Handle Room Switching
    socket.on("switchRoom", (newRoom)=>{
        if (user.room){ //sanity check
            socket.leave(user.room);

            socket.to(user.room).emit("message", messageFormat(`${user.username} has left the room`, bot_name));
            socket.to(user.room).emit("switchAll", user.username, newRoom);

            //Leave all room
            userList[user.room] = userList[user.room].filter(item => item !== user.username);

            const uniqueList = (userList[user.room]).filter(onlyUnique);
            socket.to(user.room).emit("userListUpdate", uniqueList);
            user.room = ''; 
        }
    })

    socket.on("disconnect", (reason)=>{
        if (user.room){
            
            //Leave 1 room
            const index = userList[user.room].findIndex(item => item === user.username);
            if (index !== -1){
                userList[user.room].splice(index, 1);
                if(userList[user.room].findIndex(item => item === user.username) === -1){
                    socket.to(user.room).emit("message", messageFormat(`${user.username} has left the room`, bot_name));
                }
            }
            
            const uniqueList = (userList[user.room]).filter(onlyUnique);
            socket.to(user.room).emit("userListUpdate", uniqueList);
            user.room = ''; 
        }
    })

});

httpServer.listen(3001);
function messageFormat (message, sender){
    return {
        message: message,
        sender: sender,
        time: Date.now()
    };
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}