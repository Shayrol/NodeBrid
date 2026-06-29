const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("접속: ", socket.id);

    socket.on("chat", (message) => {
      console.log("채팅: ", message);

      io.emit("chat", message);
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
