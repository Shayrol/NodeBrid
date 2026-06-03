const Sequelize = require("sequelize");

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtags",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    // db.Hashtag.belongsToMany(db.Post, { through: "posthashtag" });
    db.Hashtag.belongsToMany(db.Post, {
      through: "PostHashtag",
      foreignKey: "hashtagId", // 현재 모델(Hashtag)의 ID
      otherKey: "postId", // 상대 모델(Post)의 ID
    });
  }
};
