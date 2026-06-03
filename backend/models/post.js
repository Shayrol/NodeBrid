const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        likeCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    // 1:N 관계 연결 - userId 컬럼이 해당 Post 테이블 컬럼에 저장이 됨 User에서는 hasMany로 서로 연결함
    db.Post.belongsTo(db.User);
    // N:M 관계 연결 - PostHashtag 테이블 생성이 되며 PostId, HashtagId 컬럼이 key : key로 저장
    // Post 에서도 같이 생성을 해서 연결함
    // db.Post.belongsToMany(db.Hashtag, { through: "posthashtag" });
    db.Post.belongsToMany(db.Hashtag, {
      through: "PostHashtag",
      foreignKey: "postId", // 현재 모델(Post)의 ID가 교차 테이블에 들어갈 컬럼명
      otherKey: "hashtagId", // 상대 모델(Hashtag)의 ID가 교차 테이블에 들어갈 컬럼명
    });
    db.Post.belongsToMany(db.User, {
      through: db.PostLike,
      as: "Likers",
      foreignKey: "postId",
      otherKey: "userId",
    });
  }
};
