import express from "express";
import http from "http";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
//socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  //   console.log("io connected!");
  console.log(`user connected, ${socket.id}`);
  socket.on("join_room", (data) => {
    //data pass from frontend
    socket.join(data);
    console.log(`user with ID ${socket.id} has join the room: ${data}`); //front end truyen room vao data
  });
  socket.on("send_message", (data) => {
    // console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log(`user disconnected", ${socket.id}`);
  });
});
server.listen(3001, () => {
  console.log("server on port 3001");
});
