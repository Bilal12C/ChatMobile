const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

app.get('/',(req,res)=>{
  res.json("hello word")
})
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("sendUserSocket",sendUserSocket)
    if (sendUserSocket) {
      console.log("data",data)
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }  
  });

  socket.on("send-voice", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
    console.log("datajnbjk",data)
      socket.to(sendUserSocket).emit("voice-recieve", data.message);
    }  
  });



  
});
