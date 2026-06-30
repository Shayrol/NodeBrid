const Sequelize = require("sequelize");

module.exports = class Message extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.TEXT, // 긴 대화 내용을 위해 TEXT 사용
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt을 통해 메시지 전송 시간 자동 생성
        modelName: "Message",
        tableName: "messages",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    // 메시지는 특정 유저가 작성함 (N:1)
    db.Message.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
    // 메시지는 특정 방에 속함 (N:1)
    db.Message.belongsTo(db.ChatRoom, {
      foreignKey: "roomId",
      targetKey: "id",
    });
  }
};
