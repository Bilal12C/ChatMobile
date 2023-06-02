const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const bodyParser = require("body-parser");
const connectDB = require("./database/connect");
require("dotenv").config();
app.use(cors());
app.use(express.json());




app.use(bodyParser.urlencoded({extended:true}))
connectDB()



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);





const io = socket(server, {
  cors: {
    origin: "*",
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;  
  
  socket.on('online',(userId)=>{
    return "online"
  })

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });




  socket.on("send-msg", (data) => {
    console.log("data to sent",data)
    console.log("id of user to sent ",onlineUsers.get(data.to))
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log("is user avalible or not",sendUserSocket)
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });

  
});
