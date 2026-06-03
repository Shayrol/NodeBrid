const Sequelize = require("sequelize");

module.exports = class PostLike extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        modelName: "PostLike",
        tableName: "postLikes",
        charset: "utf8",
        collate: "utf8_general_ci",

        indexes: [
          {
            unique: true,
            fields: ["userId", "postId"],
          },
        ],
      },
    );
  }

  static associate(db) {}
};
