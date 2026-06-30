const Sequelize = require("sequelize");

module.exports = class ChatRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: Sequelize.ENUM("direct", "group"),
          allowNull: false,
          defaultValue: "direct",
        },

        directKey: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "ChatRoom",
        tableName: "chatroom",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.ChatRoom.hasMany(db.ChatParticipant, {
      foreignKey: "roomId",
      sourceKey: "id",
      onDelete: "CASCADE",
    });

    db.ChatRoom.hasMany(db.Message, {
      foreignKey: "roomId",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  }
};
