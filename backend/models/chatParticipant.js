const Sequelize = require("sequelize");

module.exports = class ChatParticipant extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        roomId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        lastReadMessageId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        joinedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "ChatParticipant",
        tableName: "chatparticipant",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.ChatParticipant.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    db.ChatParticipant.belongsTo(db.ChatRoom, {
      foreignKey: "roomId",
      targetKey: "id",
    });
  }
};
