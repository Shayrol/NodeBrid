const { Server } = require("socket.io");
const { Message } = require("../models");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("연결됨");

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, content, userId } = data;

        const savedMsg = await Message.create({
          roomId,
          userId,
          content,
        });

        io.to(roomId).emit("newMessage", savedMsg);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("연결 종료");
    });
  });

  return io;
};
// socket.op(...) 은 클라이언트 -> 서버
// io.emit(...) 은 서버 -> 모든 클라이언트

// 프론트엔드에서는 npm install socket.io-client 설치
