const express = require("express");
const {
  ChatRoom,
  ChatParticipant,
  User,
  Message,
  Sequelize,
} = require("../models");
const { Op } = require("sequelize");
const router = express.Router();
const { isLoggedIn } = require("./middlewares");

// 채팅방 찾기 및 생성
router.post("/find-or-create", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "로그인이 필요합니다.",
      });
    }

    const myUserId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        message: "상대방 정보가 없습니다.",
      });
    }

    if (Number(targetUserId) === myUserId) {
      return res.status(400).json({
        message: "자기 자신과 채팅할 수 없습니다.",
      });
    }

    const directKey =
      myUserId < targetUserId
        ? `${myUserId}_${targetUserId}`
        : `${targetUserId}_${myUserId}`;

    let room = await ChatRoom.findOne({
      where: {
        directKey,
      },
    });

    if (room) {
      return res.json({
        roomId: room.id,
        message: "기존 채팅방입니다.",
      });
    }

    room = await ChatRoom.create({
      type: "direct",
      directKey,
    });

    await ChatParticipant.bulkCreate([
      {
        roomId: room.id,
        userId: myUserId,
      },
      {
        roomId: room.id,
        userId: targetUserId,
      },
    ]);

    return res.status(201).json({
      roomId: room.id,
      message: "채팅방이 생성되었습니다.",
    });
  } catch (err) {
    next(err);
  }
});

// 채팅방 메시지 불러오기
router.get("/:roomId/messages", async (req, res) => {
  const messages = await Message.findAll({
    where: { roomId: req.params.roomId },
    order: [["createdAt", "ASC"]],
    include: [User],
  });
  res.json(messages);
});

module.exports = router;
