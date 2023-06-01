const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const bodyParser = require("body-parser");
const path = require('path');
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
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/images/:filename', (req, res) => {
  const { filename } = req.params;
  console.log("dir",__dirname)
  console.log("filename",filename)
  const imagePath = path.join(__dirname, 'public', 'uploads', filename);
   console.log("file path",imagePath)
  res.sendFile(imagePath);
});

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
