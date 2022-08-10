const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const mongoose = require("mongoose");
const path = require("path");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/user", require("./routes/users"));

const port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio(server); //소켓 서버 생성.

function publicRooms(roomtype) {
  const sids = io.sockets.adapter.sids; //연결된 모든 소켓의 id값을 받아옴.
  const rooms = io.sockets.adapter.rooms;

  const sidsArr = [];
  const roomsArr = [];

  console.log(rooms);
  for (let key in sids) {
    sidsArr.push(key);
  }

  const publicRooms = [];

  for (let key in rooms) {
    roomsArr.push(key);
  }

  roomsArr.forEach((roomId) => {
    if (sidsArr.indexOf(roomId) === -1) {
      let parse = JSON.parse(roomId);
      if (parse.roomtype === roomtype) {
        publicRooms.push({ roomId: roomId, userCount: rooms[roomId].length });
      }
    }
  });

  console.log("public rooms : ", publicRooms);
  return publicRooms; //해당 카테고리의 room_id들을 담아서 반환.
}

function searchSomeone(mySocketId) {
  // console.log(io.sockets.connected[mySocketId].username);
  let someone = null;
  for (let key in io.sockets.connected) {
    //해당 키값은 socketid값이 나옴.
    if (mySocketId !== key) {
      if (
        io.sockets.connected[key].searching &&
        !io.sockets.connected[key].searched
      ) {
        //상대방도 찾고있다면?

        //이친구가 그대의 매칭상대인것임.
        someone = key;
        break;
      }
    }
  }

  return someone;
}
io.on("connection", (socket) => {
  console.log("새로운 connection이 발생했습니다.");

  socket.on("publicRooms", (type) => {
    io.sockets.emit("publicRooms", publicRooms(type));
  });

  socket.on("disconnecting", () => {
    if (socket.matching) {
      if (io.sockets.connected[socket.matching]) {
        io.sockets.connected[socket.matching].searching = false;
        io.sockets.connected[socket.matching].searched = false;
      }
      socket.to(socket.roomId).emit("leaveRandomChat");
    } else {
      socket.to(socket.roomId).emit("leave", {
        roomId: socket.roomId,
        username: socket.username,
        image: socket.image,
      });
      io.sockets.emit("publicRooms", publicRooms(socket.type));
    }
  });
  socket.on("disconnect", () => {
    console.log("유저가 떠났어요.");
  });

  socket.on("create_room", (obj, done) => {
    const { username, roomname, roomtype, image } = obj;
    let newId = {};
    newId["roomname"] = roomname;
    newId["roomtype"] = roomtype;
    newId["data"] = Date.now();
    const roomId = JSON.stringify(newId);
    socket.join(roomId); //해당 롬으로 입장. 룸 이름을 고유한 값이 되도록 설정.
    socket.roomId = roomId;
    socket.username = username;
    socket.image = image;
    socket.roomtype = roomtype;
    console.log(io.sockets.adapter.rooms);
    done(username, roomId, image);
    // io.sockets.in(roomId).emit("welcome", username, roomId, image);
    socket.to(roomId).emit("welcome", username, roomId, image);
  });

  socket.on("enter_room", (obj, done) => {
    const { roomId, username, image, roomtype } = obj;
    socket.roomId = roomId;
    socket.username = username;
    socket.image = image;
    socket.roomtype = roomtype;
    socket.join(roomId);
    done(username, image);
    // io.sockets.in(roomId).emit("welcome", username, roomId, image, email);
    socket.to(roomId).emit("welcome", username, roomId, image);
  });

  socket.on("new_message", (obj) => {
    io.sockets.in(obj.roomId).emit("new_message", obj);
  });

  socket.on("leave", (obj, done) => {
    socket.leave(obj.roomId);
    done();
    socket.to(obj.roomId).emit("leave", obj);
  });

  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer, roomId);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer, roomId);
  });

  socket.on("ice", (ice, roomId) => {
    socket.to(roomId).emit("ice", ice);
  });

  socket.on("searching", (obj, done) => {
    socket.username = obj.username;
    socket.image = obj.image;
    socket.searching = true; //해당소켓이 상대방을 찾고있다.
    socket.searched = false; //찾고는 있으나 아직 매칭되진 못한상태.
    done();

    const result = searchSomeone(socket.id);
    if (result) {
      //둘이 매칭이 완료되었다는 뭐 그런것.
      socket.searching = false;
      socket.searched = true;
      io.sockets.connected[result].searching = false;
      io.sockets.connected[result].searched = true;
      socket.matching = result;
      io.sockets.connected[result].matching = socket.id;

      //두 사람들을 방안으로 집어넣자.
      let roomId = Date.now();
      socket.roomId = roomId;
      io.sockets.connected[result].roomId = roomId;
      socket.join(roomId);
      io.sockets.connected[result].join(roomId);

      //방안에 있는 사람들께 메세지를 날리자.
      io.sockets.in(roomId).emit("successMatching", roomId);
    }
  });

  socket.on("leaveRandomChat", (roomId, done) => {
    socket.leave(roomId); //나가기 누른 사람도 방을 떠나고
    if (io.sockets.connected[socket.matching]) {
      io.sockets.connected[socket.matching].leave(roomId); //상대도 떠나짐.
    }

    socket.searching = false;
    socket.searched = false;
    if (io.sockets.connected[socket.matching]) {
      io.sockets.connected[socket.matching].searching = false;
      io.sockets.connected[socket.matching].searched = false;
    }

    io.sockets.in(socket.roomId).emit("leaveRandomChat");
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Server Listening on ${port} port`);
});

/*
app.listen(port, () => {
  console.log(`Server Listening on ${port} port`);
}); */
