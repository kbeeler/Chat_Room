// Server Side

var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const {joinUser, removeUser} = require('./users');


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

let thisRoom = "";

io.on("connection", function (socket) {
    console.log("Connected");
    //Handling the ‘join room’ event
  socket.on("join room", (data) => {
    console.log("in room");
    //user data is grabbing info from data  passed in from index. to give it to the joinUser function. 
    let Newuser = joinUser(socket.id, data.username, data.roomName);
    //send Newuser data to users handler
    socket.emit("send data", {
      id: socket.id,
      username: Newuser.username,
      roomname: Newuser.roomname,
    });
    //save user and roomname to thisRoom Variable
    thisRoom = Newuser.roomname;
    console.log(Newuser);
    //join room with given name
    socket.join(Newuser.roomname);
  });

  socket.on("chat message", (data) => {
    io.to(thisRoom).emit("chat message", {data:data,id : socket.id});
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if(user) {
        console.log(user.username + ' Has left');
    }
    console.log("disconnected");
  });
 

})


http.listen(3000, function () {});

